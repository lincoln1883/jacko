# frozen_string_literal: true

require "rails_helper"

RSpec.describe TradesPersonProfilesController, type: :controller do
  let(:user) { create(:user, :tradesperson) }
  let(:client_user) { create(:user, :client) }
  let(:profile) { create(:trades_person_profile, user: user) }

  before do
    sign_in(user)
  end

  describe "GET #show" do
    context "when user is a tradesperson" do
      it "renders the show template with profile data" do
        get :show

        expect(response).to have_http_status(:success)
        expect_inertia_render("Profile/TradesPersonShow")
      end

      it "creates profile if it doesn't exist" do
        user.trades_person_profile&.destroy
        expect(user.trades_person_profile).to be_nil

        get :show

        expect(response).to have_http_status(:success)
        expect(user.reload.trades_person_profile).to be_present
      end
    end

    context "when user is not a tradesperson" do
      before { sign_in(client_user) }

      it "redirects with access denied" do
        get :show

        expect(response).to redirect_to(root_path)
        expect(flash[:alert]).to eq("Access denied. Only tradespeople can access this page.")
      end
    end
  end

  describe "GET #edit" do
    context "when user is a tradesperson" do
      it "renders the edit template" do
        get :edit

        expect(response).to have_http_status(:success)
        expect_inertia_render("Profile/TradesPersonEdit")
      end
    end

    context "when client wants to switch roles" do
      before { sign_in(client_user) }

      it "handles role switch to tradesperson" do
        get :edit, params: {switch_role: "true"}

        expect(response).to redirect_to(edit_profile_tradesperson_path)
        expect(flash[:notice]).to include("switched to Tradesperson")
        expect(client_user.reload.role).to eq("tradesperson")
      end
    end

    context "when user is not authorized" do
      before { sign_in(client_user) }

      it "redirects with access denied" do
        get :edit

        expect(response).to redirect_to(root_path)
        expect(flash[:alert]).to eq("Access denied. Only tradespeople can access this page.")
      end
    end
  end

  describe "PATCH #update" do
    let!(:skills) { create_list(:skill, 3) }

    let(:valid_params) do
      {
        trades_person_profile: {
          bio: "Updated bio",
          company_name: "Updated Company",
          years_experience: 5,
          hourly_rate: 75.00,
          phone: "+1-876-555-0123",
          website: "https://updated-website.com",
          availability_status: "busy",
          description: "Updated services description",
          skill_ids: skills.map(&:id)
        }
      }
    end

    let(:invalid_params) do
      {
        trades_person_profile: {
          bio: "x" * 1001, # Too long
          years_experience: -1, # Invalid
          hourly_rate: 0, # Invalid
          phone: "invalid-phone",
          website: "not-a-url"
        }
      }
    end

    context "with valid parameters" do
      let!(:existing_profile) { create(:trades_person_profile, user: user) }

      it "updates the profile and renders show template" do
        patch :update, params: valid_params

        expect(response).to have_http_status(:success)
        expect_inertia_render("Profile/TradesPersonShow")

        existing_profile.reload
        expect(existing_profile.bio).to eq("Updated bio")
        expect(existing_profile.company_name).to eq("Updated Company")
        expect(existing_profile.years_experience).to eq(5)
        expect(existing_profile.skills.count).to eq(3)
      end

      it "marks profile as completed when requirements are met" do
        patch :update, params: valid_params

        profile = user.trades_person_profile.reload
        expect(profile.profile_completed_at).to be_present
        expect(profile.skills.count).to be > 0
      end

      it "assigns skills to the profile" do
        patch :update, params: valid_params

        existing_profile.reload
        expect(existing_profile.skills.pluck(:id)).to match_array(skills.map(&:id))
      end

      it "updates skills when changing skill selection" do
        # First add some skills
        existing_profile.skills = [skills.first]

        # Update with different skills
        new_params = valid_params.dup
        new_params[:trades_person_profile][:skill_ids] = [skills.second.id, skills.third.id]

        patch :update, params: new_params

        existing_profile.reload
        expect(existing_profile.skills.pluck(:id)).to match_array([skills.second.id, skills.third.id])
      end
    end

    context "with invalid parameters" do
      let!(:existing_profile) { create(:trades_person_profile, user: user) }

      it "renders edit template with errors" do
        patch :update, params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect_inertia_render("Profile/TradesPersonEdit")
      end

      it "does not update the profile" do
        original_bio = existing_profile.bio
        patch :update, params: invalid_params

        expect(existing_profile.reload.bio).to eq(original_bio)
      end
    end

    context "without skills" do
      let!(:existing_profile) { create(:trades_person_profile, user: user) }
      let(:params_without_skills) do
        {
          trades_person_profile: {
            bio: "Complete bio",
            company_name: "Complete Company",
            years_experience: 5,
            hourly_rate: 75.00,
            phone: "+1-876-555-0123",
            website: "https://complete-website.com",
            availability_status: "available",
            description: "Complete services description"
          }
          # No skill_ids provided
        }
      end

      it "does not mark profile as completed without skills" do
        patch :update, params: params_without_skills

        profile = user.trades_person_profile.reload
        expect(profile.profile_completed_at).to be_nil
      end
    end

    context "when user is not authorized" do
      let(:other_user) { create(:user, :tradesperson) }
      let!(:other_profile) { create(:trades_person_profile, user: other_user) }
      let!(:current_user_profile) { create(:trades_person_profile, user: user) }

      before { sign_in(other_user) }

      it "redirects with authorization error" do
        # Try to update the current user's profile while signed in as other_user
        allow(controller).to receive(:current_user).and_return(other_user)
        allow(other_user).to receive(:trades_person_profile).and_return(current_user_profile)

        patch :update, params: valid_params

        expect(response).to redirect_to(profile_tradesperson_path)
        expect(flash[:alert]).to eq("You can only edit your own profile.")
      end
    end
  end

  describe "role switching" do
    let(:client_with_profile) { create(:user, :client) }

    before do
      create(:client_profile, user: client_with_profile)
      sign_in(client_with_profile)
    end

    it "destroys client profile when switching to tradesperson" do
      expect(client_with_profile.client_profile).to be_present

      get :edit, params: {switch_role: "true"}

      expect(client_with_profile.reload.client_profile).to be_nil
      expect(client_with_profile.role).to eq("tradesperson")
    end
  end

  private

  def sign_in(user)
    session = user.sessions.create!(
      user_agent: "Test Browser",
      ip_address: "127.0.0.1"
    )
    cookies.signed[:session_token] = session.id
    Current.session = session
  end

  # Helper method to check Inertia component rendering
  def expect_inertia_render(component)
    expect(assigns(:_inertia)[:component]).to eq(component)
  end
end
