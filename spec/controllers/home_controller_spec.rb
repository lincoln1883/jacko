# frozen_string_literal: true

require "rails_helper"

RSpec.describe HomeController, type: :controller do
  describe "GET #index" do
    context "when user is not signed in" do
      it "renders the home page" do
        get :index

        expect(response).to have_http_status(:success)
        expect_inertia_render("Home/Index")
      end

      it "does not set Current.session" do
        get :index

        expect(Current.session).to be_nil
      end
    end

    context "when user has a valid session" do
      let(:user) { create(:user, :supplier, :verified) }
      let(:session) { create(:session, user: user) }

      before do
        sign_in(user)
      end

      it "renders the home page successfully" do
        create(:supplier_profile, :completed, user: user)

        get :index

        expect(response).to have_http_status(:success)
        expect_inertia_render("Home/Index")
      end

      context "when user is admin" do
        let(:user) { create(:user, :admin, :verified) }
        let(:session) { create(:session, user: user) }

        before do
          sign_in(user)
        end

        it "renders home page without redirect" do
          get :index

          expect(response).to have_http_status(:success)
          expect_inertia_render("Home/Index")
        end
      end

      context "when user is supplier" do
        let(:user) { create(:user, :supplier, :verified) }
        let(:session) { create(:session, user: user) }

        before do
          sign_in(user)
        end

        context "without profile" do
          it "redirects to profile creation" do
            get :index

            expect(response).to redirect_to(edit_profile_supplier_path)
            expect(flash[:notice]).to include("Please complete your profile")
          end
        end

        context "with incomplete profile" do
          before do
            create(:supplier_profile, user: user, profile_completed_at: nil)
          end

          it "redirects to profile completion" do
            get :index

            expect(response).to redirect_to(edit_profile_supplier_path)
            expect(flash[:notice]).to include("Please complete your profile")
          end
        end

        context "with completed profile" do
          before do
            create(:supplier_profile, :completed, user: user)
          end

          it "renders home page" do
            get :index

            expect(response).to have_http_status(:success)
            expect_inertia_render("Home/Index")
          end
        end
      end

      context "when user is client" do
        let(:user) { create(:user, :client, :verified) }
        let(:session) { create(:session, user: user) }

        before do
          sign_in(user)
        end

        context "without profile" do
          it "redirects to profile creation" do
            get :index

            expect(response).to redirect_to(edit_profile_client_path)
            expect(flash[:notice]).to include("Please complete your profile")
          end
        end

        context "with incomplete profile" do
          before do
            create(:client_profile, user: user, profile_completed_at: nil)
          end

          it "redirects to profile completion" do
            get :index

            expect(response).to redirect_to(edit_profile_client_path)
            expect(flash[:notice]).to include("Please complete your profile")
          end
        end

        context "with completed profile" do
          before do
            create(:client_profile, :completed, user: user)
          end

          it "renders home page" do
            get :index

            expect(response).to have_http_status(:success)
            expect_inertia_render("Home/Index")
          end
        end
      end
    end


    context "with invalid session token" do
      before do
        cookies.signed[:session_token] = "invalid-token"
      end

      it "does not set Current.session" do
        get :index

        expect(Current.session).to be_nil
        expect(response).to have_http_status(:success)
      end
    end
  end

  private

  # Helper method to check Inertia component rendering
  def expect_inertia_render(component)
    expect(assigns(:_inertia)[:component]).to eq(component)
  end
end
