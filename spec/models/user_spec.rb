# frozen_string_literal: true

require "rails_helper"

RSpec.describe User, type: :model do
  include ActiveSupport::Testing::TimeHelpers

  subject(:user) { build(:user) }

  describe "validations" do
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_uniqueness_of(:email).ignoring_case_sensitivity }
    it { is_expected.to validate_presence_of(:role) }
    it { is_expected.to validate_inclusion_of(:role).in_array(%w[client tradesperson admin]) }

    it "validates email format" do
      user.email = "invalid_email"
      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("is invalid")
    end

    it "allows valid email formats" do
      valid_emails = [
        "user@example.com",
        "test+tag@domain.co.uk",
        "user.name@example-domain.com"
      ]

      valid_emails.each do |email|
        user.email = email
        expect(user).to be_valid, "Expected #{email} to be valid"
      end
    end

    context "password validation" do
      it "requires password to be at least 12 characters" do
        user.password = "short"
        expect(user).not_to be_valid
        expect(user.errors[:password]).to include("is too short (minimum is 12 characters)")
      end

      it "does not require password for updates when not changing password" do
        user.save! # Save first to make it an existing record
        # Update other attributes without touching password
        user.email = "new@example.com"
        expect(user).to be_valid
      end

      it "allows passwords with minimum length" do
        user.password = "valid_pass_12"
        user.password_confirmation = "valid_pass_12"
        expect(user).to be_valid
      end
    end
  end

  describe "associations" do
    it { is_expected.to have_many(:sessions).dependent(:destroy) }
    it { is_expected.to have_secure_password }
  end

  describe "email normalization" do
    it "normalizes email to lowercase" do
      user.email = "USER@EXAMPLE.COM"
      user.save
      expect(user.email).to eq("user@example.com")
    end

    it "strips whitespace from email" do
      user.email = "  user@example.com  "
      user.save
      expect(user.email).to eq("user@example.com")
    end
  end

  describe "token generation" do
    let(:user) { create(:user, verified: true) }

    describe "email_verification token" do
      it "generates a token for email verification" do
        token = user.generate_token_for(:email_verification)
        expect(token).to be_present
        expect(token).to be_a(String)
      end

      it "token expires after 2 days" do
        token = user.generate_token_for(:email_verification)

        travel_to(2.days.from_now - 1.minute) do
          expect(User.find_by_token_for(:email_verification, token)).to eq(user)
        end

        travel_to(2.days.from_now + 1.minute) do
          expect(User.find_by_token_for(:email_verification, token)).to be_nil
        end
      end

      it "invalidates token when email changes" do
        token = user.generate_token_for(:email_verification)
        user.update!(email: "new@example.com")
        expect(User.find_by_token_for(:email_verification, token)).to be_nil
      end
    end

    describe "password_reset token" do
      it "generates a token for password reset" do
        token = user.generate_token_for(:password_reset)
        expect(token).to be_present
        expect(token).to be_a(String)
      end

      it "token expires after 20 minutes" do
        token = user.generate_token_for(:password_reset)

        travel_to(20.minutes.from_now - 1.minute) do
          expect(User.find_by_token_for(:password_reset, token)).to eq(user)
        end

        travel_to(20.minutes.from_now + 1.minute) do
          expect(User.find_by_token_for(:password_reset, token)).to be_nil
        end
      end

      it "invalidates token when password changes" do
        token = user.generate_token_for(:password_reset)
        user.update!(password: "new_password_123", password_confirmation: "new_password_123")
        expect(User.find_by_token_for(:password_reset, token)).to be_nil
      end
    end
  end

  describe "callbacks" do
    describe "email verification reset on email change" do
      let(:user) { create(:user, verified: true) }

      it "sets verified to false when email changes" do
        expect(user.verified).to be true
        user.update!(email: "new@example.com")
        expect(user.verified).to be false
      end

      it "does not change verified status when email stays the same" do
        expect(user.verified).to be true
        user.update!(password: "new_password_123", password_confirmation: "new_password_123")
        expect(user.verified).to be true
      end
    end

    describe "session cleanup on password change" do
      let(:user) { create(:user) }
      let!(:session1) { create(:session, user: user) }
      let!(:session2) { create(:session, user: user) }
      let!(:current_session) { create(:session, user: user) }

      before do
        # Simulate current session
        allow(Current).to receive(:session).and_return(current_session)
      end

      it "destroys other sessions when password changes" do
        expect { user.update!(password: "new_password_123", password_confirmation: "new_password_123") }
          .to change { user.sessions.count }.by(-2)

        expect(user.sessions).to contain_exactly(current_session)
      end

      it "does not destroy sessions when other attributes change" do
        expect { user.update!(email: "new@example.com") }
          .not_to change { user.sessions.count }
      end
    end
  end

  describe "authentication" do
    let(:user) { create(:user, password: "test_password_123", password_confirmation: "test_password_123") }

    it "authenticates with correct credentials" do
      authenticated_user = User.authenticate_by(email: user.email, password: "test_password_123")
      expect(authenticated_user).to eq(user)
    end

    it "returns nil with incorrect password" do
      authenticated_user = User.authenticate_by(email: user.email, password: "wrong_password")
      expect(authenticated_user).to be_nil
    end

    it "returns nil with incorrect email" do
      authenticated_user = User.authenticate_by(email: "wrong@example.com", password: "test_password_123")
      expect(authenticated_user).to be_nil
    end
  end

  describe "roles" do
    describe "enum" do
      it { is_expected.to define_enum_for(:role).with_values(client: 0, tradesperson: 1, admin: 2) }
    end

    describe "default role" do
      it "defaults to client role" do
        user = create(:user)
        expect(user.role).to eq("client")
        expect(user).to be_client
      end
    end

    describe "role predicates" do
      it "correctly identifies client role" do
        user = create(:user, role: :client)
        expect(user).to be_client
        expect(user).not_to be_tradesperson
        expect(user).not_to be_admin
      end

      it "correctly identifies tradesperson role" do
        user = create(:user, role: :tradesperson)
        expect(user).to be_tradesperson
        expect(user).not_to be_client
        expect(user).not_to be_admin
      end

      it "correctly identifies admin role" do
        user = create(:user, role: :admin)
        expect(user).to be_admin
        expect(user).not_to be_client
        expect(user).not_to be_tradesperson
      end
    end

    describe "scopes" do
      let!(:client) { create(:user, role: :client) }
      let!(:tradesperson) { create(:user, role: :tradesperson) }
      let!(:admin) { create(:user, role: :admin) }

      it "filters clients" do
        expect(User.clients).to contain_exactly(client)
      end

      it "filters tradespeople" do
        expect(User.tradespeople).to contain_exactly(tradesperson)
      end

      it "filters admins" do
        expect(User.admins).to contain_exactly(admin)
      end
    end

    describe "role helper methods" do
      let(:client) { create(:user, role: :client) }
      let(:tradesperson) { create(:user, role: :tradesperson) }
      let(:admin) { create(:user, role: :admin) }

      describe "#role_display" do
        it "returns formatted role names" do
          expect(client.role_display).to eq("Client")
          expect(tradesperson.role_display).to eq("Tradesperson")
          expect(admin.role_display).to eq("Administrator")
        end
      end

      describe "#can_create_profile?" do
        it "returns true for tradespeople" do
          expect(tradesperson.can_create_profile?).to be true
        end

        it "returns false for clients and admins" do
          expect(client.can_create_profile?).to be false
          expect(admin.can_create_profile?).to be false
        end
      end

      describe "#can_hire?" do
        it "returns true for clients" do
          expect(client.can_hire?).to be true
        end

        it "returns false for tradespeople and admins" do
          expect(tradesperson.can_hire?).to be false
          expect(admin.can_hire?).to be false
        end
      end

      describe "#has_admin_access?" do
        it "returns true for admins" do
          expect(admin.has_admin_access?).to be true
        end

        it "returns false for clients and tradespeople" do
          expect(client.has_admin_access?).to be false
          expect(tradesperson.has_admin_access?).to be false
        end
      end
    end
  end

  describe "factory" do
    it "creates a valid user" do
      user = build(:user)
      expect(user).to be_valid
    end

    it "creates verified user with trait" do
      user = build(:user, :verified)
      expect(user.verified).to be true
    end

    it "creates unverified user with trait" do
      user = build(:user, :unverified)
      expect(user.verified).to be false
    end
  end
end
