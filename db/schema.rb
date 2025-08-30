# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_08_30_110906) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "client_profiles", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "company_name", limit: 255
    t.integer "preferred_contact_method", default: 0, null: false
    t.string "project_budget_range", limit: 100
    t.text "description"
    t.boolean "active", default: true, null: false
    t.datetime "profile_completed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_client_profiles_on_active"
    t.index ["preferred_contact_method"], name: "index_client_profiles_on_preferred_contact_method"
    t.index ["user_id"], name: "index_client_profiles_on_user_id", unique: true
  end

  create_table "sessions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "user_agent"
    t.string "ip_address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "trades_person_profiles", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.text "bio"
    t.string "company_name"
    t.integer "years_experience", default: 0
    t.decimal "hourly_rate", precision: 8, scale: 2
    t.string "phone", limit: 20
    t.string "website", limit: 255
    t.integer "availability_status", default: 0, null: false
    t.text "description"
    t.boolean "active", default: true, null: false
    t.datetime "profile_completed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_trades_person_profiles_on_active"
    t.index ["availability_status"], name: "index_trades_person_profiles_on_availability_status"
    t.index ["user_id"], name: "index_trades_person_profiles_on_user_id", unique: true
    t.index ["years_experience"], name: "index_trades_person_profiles_on_years_experience"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.boolean "verified", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "role", default: 0, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["role"], name: "index_users_on_role"
  end

  add_foreign_key "client_profiles", "users"
  add_foreign_key "sessions", "users"
  add_foreign_key "trades_person_profiles", "users"
end
