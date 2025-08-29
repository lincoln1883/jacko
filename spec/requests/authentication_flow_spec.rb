# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Authentication Flow", type: :request do
  let(:user_attributes) do
    {
      email: "user@example.com",
      password: "secure_password_123",
      password_confirmation: "secure_password_123"
    }
  end

  describe "Full Registration Flow" do
    it "allows a user to register and be automatically signed in" do
      # Visit sign up page
      get "/sign_up"
      expect(response).to have_http_status(:ok)

      # Submit registration form
      post "/sign_up", params: user_attributes

      # Should create user and redirect
      expect(response).to redirect_to(root_path)
      follow_redirect!
      expect(response).to have_http_status(:ok)

      # User should be created
      user = User.find_by(email: "user@example.com")
      expect(user).to be_present
      expect(user.verified).to be false

      # Session should be created and cookie set
      expect(user.sessions.count).to eq(1)
      session = user.sessions.first
      expect(session).to be_present

      # Check that session cookie is set
      cookie_value = get_cookie_value("session_token")
      expect(cookie_value).to eq(session.id.to_s)
    end

    it "prevents registration with invalid data" do
      invalid_attributes = {
        email: "invalid_email",
        password: "short",
        password_confirmation: "different"
      }

      expect {
        post "/sign_up", params: invalid_attributes
      }.not_to change(User, :count)

      expect(response).to have_http_status(:unprocessable_content)
    end
  end

  describe "Full Sign In Flow" do
    let!(:user) { create(:user, :verified, password: "test_password_123", password_confirmation: "test_password_123") }

    it "allows a user to sign in with valid credentials" do
      # Visit sign in page
      get "/sign_in"
      expect(response).to have_http_status(:ok)

      # Submit sign in form
      post "/sign_in", params: {
        email: user.email,
        password: "test_password_123"
      }

      # Should create session and redirect
      expect(response).to redirect_to(root_path)
      follow_redirect!
      expect(response).to have_http_status(:ok)

      # Session should be created
      expect(user.sessions.count).to eq(1)
      session = user.sessions.first

      # Check that session cookie is set
      cookie_value = get_cookie_value("session_token")
      expect(cookie_value).to eq(session.id.to_s)
    end

    it "prevents sign in with invalid credentials" do
      post "/sign_in", params: {
        email: user.email,
        password: "wrong_password"
      }

      expect(response).to redirect_to(sign_in_path(email_hint: user.email))
      follow_redirect!

      # No session should be created
      expect(user.sessions.count).to eq(0)

      # No session cookie should be set
      cookie_value = get_cookie_value("session_token")
      expect(cookie_value).to be_nil
    end

    it "handles case insensitive email matching" do
      post "/sign_in", params: {
        email: user.email.upcase,
        password: "test_password_123"
      }

      expect(response).to redirect_to(root_path)
      expect(user.sessions.count).to eq(1)
    end
  end

  describe "Session Management Flow" do
    let!(:user) { create(:user, :verified, password: "test_password_123", password_confirmation: "test_password_123") }

    before do
      # Sign in the user
      post "/sign_in", params: {
        email: user.email,
        password: "test_password_123"
      }
    end

    it "allows viewing active sessions" do
      get "/sessions"
      expect(response).to have_http_status(:ok)
    end

    it "allows destroying a specific session" do
      # Create additional session
      other_session = user.sessions.create!(user_agent: "Other Browser", ip_address: "192.168.1.2")

      expect {
        delete "/sessions/#{other_session.id}"
      }.to change { user.sessions.count }.by(-1)

      expect(response).to redirect_to(sessions_path)
      expect { other_session.reload }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  describe "Authentication Requirement Flow" do
    it "redirects unauthenticated users to sign in" do
      get "/sessions"
      expect(response).to redirect_to(sign_in_path)
    end

    it "allows access to public pages without authentication" do
      get "/sign_in"
      expect(response).to have_http_status(:ok)

      get "/sign_up"
      expect(response).to have_http_status(:ok)
    end

    it "maintains authentication across requests" do
      user = create(:user, :verified, password: "test_password_123", password_confirmation: "test_password_123")

      # Sign in
      post "/sign_in", params: {
        email: user.email,
        password: "test_password_123"
      }
      expect(response).to redirect_to(root_path)

      # Access protected resource
      get "/sessions"
      expect(response).to have_http_status(:ok)

      # Access another protected resource
      get root_path
      expect(response).to have_http_status(:ok)
    end
  end

  describe "Session Security Flow" do
    let!(:user1) { create(:user, email: "user1@example.com", password: "password123456", password_confirmation: "password123456") }
    let!(:user2) { create(:user, email: "user2@example.com", password: "password123456", password_confirmation: "password123456") }

    it "prevents access to other users sessions" do
      # Sign in as user1
      post "/sign_in", params: {
        email: user1.email,
        password: "password123456"
      }

      # Create session for user2
      user2_session = user2.sessions.create!(user_agent: "Another Browser", ip_address: "192.168.1.3")

      # Try to delete user2's session as user1 - should get 404 or redirect
      delete "/sessions/#{user2_session.id}"

      # Should not be successful (either 404 or redirect to sign in)
      expect(response).not_to have_http_status(:success)
      expect(response).not_to have_http_status(:found) # not a success redirect

      # User2's session should still exist (wasn't deleted)
      expect { user2_session.reload }.not_to raise_error
    end

    it "invalidates other sessions when password changes" do
      # Create multiple sessions for user
      session1 = user1.sessions.create!(user_agent: "Browser 1", ip_address: "192.168.1.1")
      session2 = user1.sessions.create!(user_agent: "Browser 2", ip_address: "192.168.1.2")
      current_session = user1.sessions.create!(user_agent: "Current Browser", ip_address: "192.168.1.3")

      # Simulate current session in context
      allow(Current).to receive(:session).and_return(current_session)

      # Change password
      user1.update!(password: "new_password_123", password_confirmation: "new_password_123")

      # Other sessions should be destroyed
      expect { session1.reload }.to raise_error(ActiveRecord::RecordNotFound)
      expect { session2.reload }.to raise_error(ActiveRecord::RecordNotFound)
      expect(current_session.reload).to be_present # Current session should remain
    end
  end

  describe "Email Verification Flow Integration" do
    it "sends verification email on registration" do
      expect {
        post "/sign_up", params: user_attributes
      }.to change { ActionMailer::Base.deliveries.count }.by(1)

      email = ActionMailer::Base.deliveries.last
      expect(email.to).to include("user@example.com")
      expect(email.subject).to eq("Verify your email")
    end

    it "marks user as unverified by default" do
      post "/sign_up", params: user_attributes

      user = User.find_by(email: "user@example.com")
      expect(user.verified).to be false
    end
  end

  describe "Error Handling Flow" do
    let!(:user) { create(:user, :verified, password: "test_password_123", password_confirmation: "test_password_123") }

    it "handles non-existent session gracefully" do
      # Set an invalid session token
      set_signed_cookie(:session_token, 99999)

      get "/sessions"
      expect(response).to redirect_to(sign_in_path)
    end

    it "handles corrupted session token gracefully" do
      # Set a corrupted session token
      cookies[:session_token] = "invalid_token"

      get "/sessions"
      expect(response).to redirect_to(sign_in_path)
    end

    it "handles deleted user session gracefully" do
      # Sign in user
      post "/sign_in", params: {
        email: user.email,
        password: "test_password_123"
      }

      # Delete the user (which cascades to sessions)
      user.destroy

      # Try to access protected resource
      get "/sessions"
      expect(response).to redirect_to(sign_in_path)
    end
  end

  describe "User Experience Flow" do
    it "preserves email hint on failed sign in" do
      user = create(:user, :verified)

      post "/sign_in", params: {
        email: "user@example.com",
        password: "wrong_password"
      }

      expect(response).to redirect_to(sign_in_path(email_hint: "user@example.com"))
    end

    it "shows appropriate flash messages" do
      # Registration success
      post "/sign_up", params: user_attributes
      follow_redirect!
      expect(flash[:notice]).to eq("Welcome! You have signed up successfully")

      # Sign in success
      user = User.find_by(email: "user@example.com")
      user.update!(password: "test_password_123", password_confirmation: "test_password_123")

      post "/sign_in", params: {
        email: user.email,
        password: "test_password_123"
      }
      follow_redirect!
      expect(flash[:notice]).to eq("Signed in successfully")

      # Session deletion
      session_to_delete = user.sessions.first
      delete "/sessions/#{session_to_delete.id}"
      follow_redirect!
      expect(flash[:notice]).to eq("That session has been logged out")
    end
  end

  private

  def get_cookie_value(name)
    get_signed_cookie(name)
  end
end
