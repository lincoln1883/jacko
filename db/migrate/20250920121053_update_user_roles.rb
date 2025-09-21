# frozen_string_literal: true

class UpdateUserRoles < ActiveRecord::Migration[8.0]
  def change
    # Set default role for new users to 'client'
    change_column_default :users, :role, from: nil, to: 0 # 0 for client

    # Update existing 'tradesperson' roles to 'supplier'
    # Assuming 'tradesperson' was 1 and 'supplier' is now 1
    User.where(role: 1).update_all(role: 1) # Still 1, but semantically changed

    # For any new users created with the old default (if any exist between code update and migration)
    # This might be redundant if the default is handled at the model level for new records
    # and we only care about existing data here.
    # If there were users with role 'admin' before, their role value would have shifted from 2 to 3.
    # We need to account for this shift.
    User.where(role: 2).update_all(role: 3) # Old admin (2) becomes new admin (3)

    # Note: If there were any users with the old default role (e.g., if default was nil and some users had no role explicitly set),
    # they would now effectively be 'client' due to change_column_default.
  end
end
