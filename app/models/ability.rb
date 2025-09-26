# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)

    if user.persisted?
      # Permissions for all authenticated users
      can [:read, :update], User, id: user.id
      can :read, :public_profiles

      # Role-specific permissions
      case user.role
      when "client"
        client_permissions(user)
      when "supplier"
        supplier_permissions(user)
      when "contractor"
        contractor_permissions(user)
      when "admin"
        admin_permissions(user)
      end
    else
      # Permissions for guest users (not logged in)
      can :read, :public_profiles
      can :create, User # allow registration
    end
  end

  private

  def client_permissions(user)
    # Clients can create and manage their own projects/inquiries
    # For now, basic permissions until we have these models
    can :read, :supplier_profiles
    can :create, :project_inquiries
    can :read, Job, client_id: user.id # Clients can read their own jobs
  end

  def supplier_permissions(user)
    # Suppliers can manage their own profile and portfolio
    # For now, basic permissions until we have these models
    can :manage, :own_profile
    can :read, :client_inquiries
    can :create, :verification_requests
    can :read, Job # Suppliers can read all jobs (open for bidding)
    # Note: Suppliers can only read their own user record (set in main permissions)
  end

  def contractor_permissions(user)
    # For now, basic permissions until we have these models
    # Contractor permissions are similar to suppliers, potentially with some differences later
    can :manage, :own_profile
    can :read, :client_inquiries
    can :create, :verification_requests
    can :read, Job # Contractors can read all jobs (open for bidding)
    # Note: Contractors can only read their own user record (set in main permissions)
  end

  def admin_permissions(user)
    # Admins have broad permissions for platform management
    can :manage, User
    can :manage, :all # This gives admin full access

    # Specific admin tasks
    can :manage, :verification_requests
    can :manage, :platform_settings
    can :read, :analytics
  end
end
