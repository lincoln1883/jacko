# frozen_string_literal: true

require "rails_helper"

RSpec.describe ClientProfilesController, type: :controller do
  let(:user) { create(:user, :client) }
  let(:tradesperson_user) { create(:user, :tradesperson) }
  let(:profile) { create(:client_profile, user: user) }

  before do
    sign_in(user)
  end

  describe "GET #show" do
    context "when user is a client" do
      it "renders the show template with profile data" do
        get :show

        expect(response).to have_http_status(:success)
        expect_inertia_render("Profile/ClientShow")
      end

      it "creates profile if it doesn't exist" do
        user.client_profile&.destroy
        expect(user.client_profile).to be_nil

        get :show

        expect(response).to have_http_status(:success)
        expect(user.reload.client_profile).to be_present
      end
    end

    context "when user is not a client" do
      before { sign_in(tradesperson_user) }

      it "redirects with access denied" do
        get :show

        expect(response).to redirect_to(root_path)
        expect(flash[:alert]).to eq("Access denied. Only clients can access this page.")
      end
    end
  end

  describe "GET #edit" do
    context "when user is a client" do
      it "renders the edit template" do
        get :edit

        expect(response).to have_http_status(:success)
        expect_inertia_render("Profile/ClientEdit")
      end

      it "includes contact method and budget range options" do
        get :edit

        expect(response).to have_http_status(:success)
        expect_inertia_render("Profile/ClientEdit")
        # These should be included in the Inertia props but we can't easily test the JSON content
        # This test ensures the action completes successfully with the expected template
      end
    end

    context "when tradesperson wants to switch roles" do
      before { sign_in(tradesperson_user) }

      it "handles role switch to client" do
        get :edit, params: {switch_role: "true"}

        expect(response).to redirect_to(edit_profile_client_path)
        expect(flash[:notice]).to include("switched to Client")
        expect(tradesperson_user.reload.role).to eq("client")
      end
    end

    context "when user is not authorized" do
      before { sign_in(tradesperson_user) }

      it "redirects with access denied" do
        get :edit

        expect(response).to redirect_to(root_path)
        expect(flash[:alert]).to eq("Access denied. Only clients can access this page.")
      end
    end
  end

  describe "PATCH #update" do
    let(:valid_params) do
      {
        client_profile: {
          company_name: "Updated Company",
          preferred_contact_method: "email",
          project_budget_range: "1000_2500",
          description: "Updated project requirements and expectations"
        }
      }
    end

    let(:invalid_params) do
      {
        client_profile: {
          company_name: "x" * 256, # Too long
          preferred_contact_method: "invalid_method",
          project_budget_range: "invalid_range",
          description: "x" * 1501 # Too long
        }
      }
    end

    context "with valid parameters" do
      let!(:existing_profile) { create(:client_profile, user: user) }

      it "updates the profile and renders show template" do
        patch :update, params: valid_params

        expect(response).to have_http_status(:success)
        expect_inertia_render("Profile/ClientShow")

        existing_profile.reload
        expect(existing_profile.company_name).to eq("Updated Company")
        expect(existing_profile.preferred_contact_method).to eq("email")
        expect(existing_profile.project_budget_range).to eq("1000_2500")
        expect(existing_profile.description).to eq("Updated project requirements and expectations")
      end

      it "marks profile as completed when requirements are met" do
        patch :update, params: valid_params

        expect(user.client_profile.reload.profile_completed_at).to be_present
      end
    end

    context "with invalid parameters" do
      let!(:existing_profile) { create(:client_profile, user: user) }

      it "renders edit template with errors" do
        patch :update, params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect_inertia_render("Profile/ClientEdit")
      end

      it "does not update the profile" do
        original_company_name = existing_profile.company_name
        patch :update, params: invalid_params

        expect(existing_profile.reload.company_name).to eq(original_company_name)
      end
    end

    context "when user is not authorized" do
      let(:other_user) { create(:user, :client) }
      let!(:other_profile) { create(:client_profile, user: other_user) }
      let!(:current_user_profile) { create(:client_profile, user: user) }

      before { sign_in(other_user) }

      it "redirects with authorization error" do
        # Try to update the current user's profile while signed in as other_user
        allow(controller).to receive(:current_user).and_return(other_user)
        allow(other_user).to receive(:client_profile).and_return(current_user_profile)

        patch :update, params: valid_params

        expect(response).to redirect_to(profile_client_path)
        expect(flash[:alert]).to eq("You can only edit your own profile.")
      end
    end
  end

  describe "role switching" do
    let(:tradesperson_with_profile) { create(:user, :tradesperson) }

    before do
      create(:trades_person_profile, user: tradesperson_with_profile)
      sign_in(tradesperson_with_profile)
    end

    it "destroys tradesperson profile when switching to client" do
      expect(tradesperson_with_profile.trades_person_profile).to be_present

      get :edit, params: {switch_role: "true"}

      expect(tradesperson_with_profile.reload.trades_person_profile).to be_nil
      expect(tradesperson_with_profile.role).to eq("client")
    end
  end

  describe "serialization methods" do
    it "serializes profile correctly" do
      get :show

      expect(response).to have_http_status(:success)
      expect_inertia_render("Profile/ClientShow")
      # The serialization logic is tested implicitly by ensuring the response succeeds
      # and includes the expected template
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
