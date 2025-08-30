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
      when 'client'
        client_permissions(user)
      when 'tradesperson'
        tradesperson_permissions(user)
      when 'admin'
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
    # can [:create, :read, :update], Project, user: user
    # can [:create, :read], Message, recipient: user
    # can [:create, :read], Message, sender: user
    # can :create, Review # can leave reviews
    # can [:read, :update], Review, client: user
    
    # For now, basic permissions until we have these models
    can :read, :tradesperson_profiles
    can :create, :project_inquiries
  end

  def tradesperson_permissions(user)
    # Tradespeople can manage their own profile and portfolio
    # can [:create, :read, :update], TradesPersonProfile, user: user
    # can [:create, :read, :update, :destroy], Portfolio, tradesperson: user
    # can [:read, :update], Message, recipient: user
    # can [:create, :read], Message, sender: user
    # can :read, Review, tradesperson: user
    # can :create, VerificationRequest, user: user
    
    # For now, basic permissions until we have these models
    can :manage, :own_profile
    can :read, :client_inquiries
    can :create, :verification_requests
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
