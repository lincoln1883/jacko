# frozen_string_literal: true

require "rails_helper"

RSpec.describe PasswordsController, type: :controller do
  let(:user) { create(:user, :verified) }

  before do
    sign_in(user)
  end

  describe "GET #edit" do
    it "renders the password edit page" do
      get :edit

      expect(response).to have_http_status(:success)
      expect_inertia_render("Passwords/Edit")
    end

    it "requires authentication" do
      sign_out

      get :edit

      expect(response).to redirect_to("/sign_in")
    end
  end

  describe "PATCH #update" do
    let(:valid_params) do
      {
        password: "new_secure_password_123",
        password_confirmation: "new_secure_password_123",
        password_challenge: "current_password_123"
      }
    end

    let(:invalid_params) do
      {
        password: "short",
        password_confirmation: "different",
        password_challenge: "wrong_password"
      }
    end

    context "with valid parameters" do
      before do
        # Set the current password for the user
        user.update!(password: "current_password_123", password_confirmation: "current_password_123")
      end

      it "updates the password successfully" do
        patch :update, params: valid_params

        expect(response).to redirect_to(root_path)
        expect(flash[:notice]).to eq("Your password has been changed")

        # Verify password was actually updated
        user.reload
        expect(user.authenticate("new_secure_password_123")).to be_truthy
      end

      it "requires authentication" do
        sign_out

        patch :update, params: valid_params

        expect(response).to redirect_to("/sign_in")
      end
    end

    context "with invalid parameters" do
      it "renders the edit page with errors for short password" do
        invalid_params_short = valid_params.merge(
          password: "short",
          password_confirmation: "short"
        )

        patch :update, params: invalid_params_short

        expect(response).to have_http_status(:unprocessable_entity)
        expect_inertia_render("Passwords/Edit")
      end

      it "renders the edit page with errors for mismatched confirmation" do
        invalid_params_mismatch = valid_params.merge(
          password_confirmation: "different_password"
        )

        patch :update, params: invalid_params_mismatch

        expect(response).to have_http_status(:unprocessable_entity)
        expect_inertia_render("Passwords/Edit")
      end

      it "handles missing password_challenge gracefully" do
        params_without_challenge = {
          password: "new_secure_password_123",
          password_confirmation: "new_secure_password_123"
        }

        patch :update, params: params_without_challenge

        # Should render edit with errors since password_challenge is not valid
        expect(response).to have_http_status(:unprocessable_entity)
        expect_inertia_render("Passwords/Edit")
      end
    end

    context "password validation" do
      it "requires minimum password length" do
        short_password_params = valid_params.merge(
          password: "123",
          password_confirmation: "123"
        )

        patch :update, params: short_password_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(assigns(:user).errors[:password]).to be_present
      end

      it "requires password confirmation to match" do
        mismatch_params = valid_params.merge(
          password_confirmation: "completely_different_password"
        )

        patch :update, params: mismatch_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect(assigns(:user).errors[:password_confirmation]).to be_present
      end
    end

    context "edge cases" do
      it "handles empty parameters" do
        patch :update, params: {}

        expect(response).to have_http_status(:unprocessable_entity)
        expect_inertia_render("Passwords/Edit")
      end

      it "handles nil password" do
        nil_params = {password: nil, password_confirmation: nil}

        patch :update, params: nil_params

        expect(response).to have_http_status(:unprocessable_entity)
        expect_inertia_render("Passwords/Edit")
      end

      it "sets current user correctly" do
        patch :update, params: valid_params

        expect(assigns(:user)).to eq(user)
      end
    end
  end

  describe "private methods" do
    describe "#set_user" do
      it "sets the current user" do
        get :edit

        expect(assigns(:user)).to eq(user)
      end
    end
  end

  private

  # Helper method to check Inertia component rendering
  def expect_inertia_render(component)
    expect(assigns(:_inertia)[:component]).to eq(component)
  end
end
