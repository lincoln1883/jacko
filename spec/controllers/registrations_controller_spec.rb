# frozen_string_literal: true

require "rails_helper"

RSpec.describe RegistrationsController, type: :controller do
  describe "GET #new" do
    it "returns a successful response" do
      get :new
      expect(response).to be_successful
    end

    it "renders the Auth/SignUp Inertia component" do
      get :new
      expect_inertia_render("Auth/SignUp")
    end

    it "does not require authentication" do
      # Ensure we're not signed in (should work without authentication)
      expect(controller).not_to receive(:authenticate)
      get :new
      expect(response).to be_successful
    end
  end

  describe "POST #create" do
    let(:valid_attributes) do
      {
        email: "user@example.com",
        password: "secure_password_123",
        password_confirmation: "secure_password_123"
      }
    end

    let(:invalid_attributes) do
      {
        email: "invalid_email",
        password: "short",
        password_confirmation: "different"
      }
    end

    context "with valid parameters" do
      it "creates a new user" do
        expect {
          post :create, params: valid_attributes
        }.to change(User, :count).by(1)
      end

      it "creates a session for the new user" do
        expect {
          post :create, params: valid_attributes
        }.to change(Session, :count).by(1)

        user = User.last
        session = Session.last
        expect(session.user).to eq(user)
      end

      it "sets the session token cookie" do
        post :create, params: valid_attributes

        expect(cookies.signed[:session_token]).to be_present
        session = Session.find(cookies.signed[:session_token])
        expect(session.user).to eq(User.last)
      end

      it "redirects to root path with success notice" do
        post :create, params: valid_attributes

        expect(response).to redirect_to(root_path)
        expect(flash[:notice]).to eq("Welcome! You have signed up successfully")
      end

      it "sends email verification" do
        expect(UserMailer).to receive(:with).with(user: kind_of(User)).and_call_original
        expect_any_instance_of(ActionMailer::MessageDelivery).to receive(:deliver_later)

        post :create, params: valid_attributes
      end

      it "creates user with correct attributes" do
        post :create, params: valid_attributes

        user = User.last
        expect(user.email).to eq("user@example.com")
        expect(user.verified).to be false # Default should be false
        expect(user.authenticate("secure_password_123")).to eq(user)
      end

      it "normalizes email during creation" do
        post :create, params: valid_attributes.merge(email: "  USER@EXAMPLE.COM  ")

        user = User.last
        expect(user.email).to eq("user@example.com")
      end
    end

    context "with invalid parameters" do
      it "does not create a user" do
        expect {
          post :create, params: invalid_attributes
        }.not_to change(User, :count)
      end

      it "does not create a session" do
        expect {
          post :create, params: invalid_attributes
        }.not_to change(Session, :count)
      end

      it "does not set session token cookie" do
        post :create, params: invalid_attributes
        expect(cookies.signed[:session_token]).to be_nil
      end

      it "renders the Auth/SignUp component with errors" do
        post :create, params: invalid_attributes

        expect_inertia_render("Auth/SignUp")
        expect(response).to have_http_status(:unprocessable_entity)

        props = assigns(:_inertia)[:props]
        expect(props[:errors]).to be_present
      end

      it "includes validation errors in props" do
        post :create, params: invalid_attributes

        props = assigns(:_inertia)[:props]
        errors = props[:errors]

        expect(errors[:email]).to include("is invalid")
        expect(errors[:password]).to include("is too short (minimum is 12 characters)")
        expect(errors[:password_confirmation]).to include("doesn't match Password")
      end

      it "does not send email verification" do
        expect(UserMailer).not_to receive(:with)
        post :create, params: invalid_attributes
      end
    end

    context "with duplicate email" do
      let(:existing_user) { create(:user, email: "user@example.com") }

      before { existing_user } # Create the user

      it "does not create a new user" do
        expect {
          post :create, params: valid_attributes.merge(email: existing_user.email)
        }.not_to change(User, :count)
      end

      it "renders errors for duplicate email" do
        post :create, params: valid_attributes.merge(email: existing_user.email)

        expect_inertia_render("Auth/SignUp")
        expect(response).to have_http_status(:unprocessable_entity)

        props = assigns(:_inertia)[:props]
        expect(props[:errors][:email]).to include("has already been taken")
      end
    end

    context "with mismatched password confirmation" do
      let(:mismatched_attributes) do
        {
          email: "user@example.com",
          password: "secure_password_123",
          password_confirmation: "different_password_123"
        }
      end

      it "does not create a user" do
        expect {
          post :create, params: mismatched_attributes
        }.not_to change(User, :count)
      end

      it "includes password confirmation error" do
        post :create, params: mismatched_attributes

        props = assigns(:_inertia)[:props]
        expect(props[:errors][:password_confirmation]).to include("doesn't match Password")
      end
    end

    context "with missing parameters" do
      it "handles missing email" do
        params = valid_attributes.except(:email)

        expect {
          post :create, params: params
        }.not_to change(User, :count)

        props = assigns(:_inertia)[:props]
        expect(props[:errors][:email]).to include("can't be blank")
      end

      it "handles missing password" do
        params = valid_attributes.except(:password)

        expect {
          post :create, params: params
        }.not_to change(User, :count)

        props = assigns(:_inertia)[:props]
        expect(props[:errors][:password]).to include("can't be blank")
      end
    end

    context "when UserMailer raises an exception" do
      before do
        allow_any_instance_of(RegistrationsController).to receive(:send_email_verification).and_raise(StandardError, "Mail server error")
      end

      it "raises the exception (should be handled by error monitoring)" do
        expect {
          post :create, params: valid_attributes
        }.to raise_error(StandardError, "Mail server error")
      end
    end
  end

  describe "parameter filtering" do
    it "only permits expected parameters" do
      extra_params = {
        email: "user@example.com",
        password: "secure_password_123",
        password_confirmation: "secure_password_123",
        verified: true,  # This should not be permitted
        admin: true,     # This should not be permitted
        role: "admin"    # This should not be permitted
      }

      post :create, params: extra_params

      user = User.last
      expect(user).to be_present
      expect(user.verified).to be false  # Should use default, not params value
      expect(user).not_to respond_to(:admin)
      expect(user).not_to respond_to(:role)
    end
  end

  describe "authentication skip" do
    it "allows access to new without authentication" do
      get :new
      expect(response).to be_successful
    end

    it "allows access to create without authentication" do
      post :create, params: {
        email: "user@example.com",
        password: "secure_password_123",
        password_confirmation: "secure_password_123"
      }

      expect(response).to be_redirect # Should redirect on success
    end
  end

  # Helper method to check Inertia component rendering
  def expect_inertia_render(component)
    expect(assigns(:_inertia)[:component]).to eq(component)
  end
end
