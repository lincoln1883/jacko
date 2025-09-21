# frozen_string_literal: true

require "rails_helper"
require "cancan/matchers"

RSpec.describe Ability, type: :model do
  subject(:ability) { Ability.new(user) }

  describe "guest users (not signed in)" do
    let(:user) { nil }

    it "can read public profiles" do
      expect(ability).to be_able_to(:read, :public_profiles)
    end

    it "can create new user accounts" do
      expect(ability).to be_able_to(:create, User)
    end

    it "cannot access user-specific resources" do
      existing_user = create(:user)
      expect(ability).not_to be_able_to(:read, existing_user)
      expect(ability).not_to be_able_to(:update, existing_user)
    end
  end

  describe "authenticated users" do
    let(:user) { create(:user, role: role) }

    context "when user is a client" do
      let(:role) { :client }

      it "can read and update own user record" do
        expect(ability).to be_able_to(:read, user)
        expect(ability).to be_able_to(:update, user)
      end

      it "cannot read or update other users" do
        other_user = create(:user)
        expect(ability).not_to be_able_to(:read, other_user)
        expect(ability).not_to be_able_to(:update, other_user)
      end

      it "can read public profiles" do
        expect(ability).to be_able_to(:read, :public_profiles)
      end

      it "can read supplier profiles" do
        expect(ability).to be_able_to(:read, :supplier_profiles)
      end

      it "can create project inquiries" do
        expect(ability).to be_able_to(:create, :project_inquiries)
      end

      it "cannot manage admin-specific resources" do
        expect(ability).not_to be_able_to(:manage, :verification_requests)
        expect(ability).not_to be_able_to(:manage, :platform_settings)
        expect(ability).not_to be_able_to(:read, :analytics)
      end

      it "cannot create verification requests" do
        expect(ability).not_to be_able_to(:create, :verification_requests)
      end
    end

    context "when user is a supplier" do
      let(:role) { :supplier }

      it "can read and update own user record" do
        expect(ability).to be_able_to(:read, user)
        expect(ability).to be_able_to(:update, user)
      end

      it "cannot read or update other users" do
        other_user = create(:user)
        expect(ability).not_to be_able_to(:read, other_user)
        expect(ability).not_to be_able_to(:update, other_user)
      end

      it "can read public profiles" do
        expect(ability).to be_able_to(:read, :public_profiles)
      end

      it "can manage own profile" do
        expect(ability).to be_able_to(:manage, :own_profile)
      end

      it "can read client inquiries" do
        expect(ability).to be_able_to(:read, :client_inquiries)
      end

      it "can create verification requests" do
        expect(ability).to be_able_to(:create, :verification_requests)
      end

      it "cannot create project inquiries" do
        expect(ability).not_to be_able_to(:create, :project_inquiries)
      end

      it "cannot manage admin-specific resources" do
        expect(ability).not_to be_able_to(:manage, :platform_settings)
        expect(ability).not_to be_able_to(:read, :analytics)
      end
    end

    context "when user is an admin" do
      let(:role) { :admin }

      it "can manage all users" do
        other_user = create(:user)
        expect(ability).to be_able_to(:manage, User)
        expect(ability).to be_able_to(:read, other_user)
        expect(ability).to be_able_to(:update, other_user)
        expect(ability).to be_able_to(:destroy, other_user)
      end

      it "can manage all resources" do
        expect(ability).to be_able_to(:manage, :all)
      end

      it "can manage verification requests" do
        expect(ability).to be_able_to(:manage, :verification_requests)
      end

      it "can manage platform settings" do
        expect(ability).to be_able_to(:manage, :platform_settings)
      end

      it "can read analytics" do
        expect(ability).to be_able_to(:read, :analytics)
      end
    end
  end

  describe "edge cases" do
    context "when user object exists but is not persisted" do
      let(:user) { build(:user, role: :client) }

      it "treats as guest user" do
        expect(ability).to be_able_to(:read, :public_profiles)
        expect(ability).to be_able_to(:create, User)
        expect(ability).not_to be_able_to(:create, :project_inquiries)
      end
    end

    context "when user has invalid role" do
      let(:user) { create(:user) }

      before do
        # Directly set invalid role bypassing enum validation
        user.update_column(:role, 999)
        user.reload
      end

      it "does not grant any role-specific permissions" do
        # The case statement won't match, so only basic authenticated permissions apply
        expect(ability).to be_able_to(:read, user)
        expect(ability).to be_able_to(:update, user)
        expect(ability).to be_able_to(:read, :public_profiles)

        # Role-specific permissions should not be granted
        expect(ability).not_to be_able_to(:create, :project_inquiries)
        expect(ability).not_to be_able_to(:manage, :own_profile)
        expect(ability).not_to be_able_to(:manage, :all)
      end
    end
  end
end
