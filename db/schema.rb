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

ActiveRecord::Schema[8.0].define(version: 2025_09_18_185816) do
  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "client_profiles", force: :cascade do |t|
    t.integer "user_id", null: false
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

  create_table "parishes", force: :cascade do |t|
    t.string "name", null: false
    t.string "code", null: false
    t.text "description"
    t.boolean "active"
    t.integer "population"
    t.string "main_city"
    t.decimal "latitude"
    t.decimal "longitude"
    t.string "svg_path"
    t.string "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_parishes_on_code", unique: true
  end

  create_table "portfolio_images", force: :cascade do |t|
    t.integer "trades_person_profile_id", null: false
    t.string "title", limit: 255
    t.text "description", limit: 1000
    t.integer "display_order", default: 0, null: false
    t.boolean "active", default: true, null: false
    t.string "image_alt_text", limit: 255
    t.json "metadata", default: "{}", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["metadata"], name: "index_portfolio_images_on_metadata"
    t.index ["trades_person_profile_id", "active"], name: "index_portfolio_images_on_trades_person_profile_id_and_active"
    t.index ["trades_person_profile_id", "display_order"], name: "idx_on_trades_person_profile_id_display_order_e7c8b6a1c4"
    t.index ["trades_person_profile_id"], name: "index_portfolio_images_on_trades_person_profile_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "user_agent"
    t.string "ip_address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "skills", force: :cascade do |t|
    t.string "name", null: false
    t.string "category", null: false
    t.text "description"
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_skills_on_active"
    t.index ["category"], name: "index_skills_on_category"
    t.index ["name"], name: "index_skills_on_name", unique: true
  end

  create_table "trades_person_profiles", force: :cascade do |t|
    t.integer "user_id", null: false
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
    t.integer "parish_id"
    t.string "street_address"
    t.string "city_town"
    t.string "postal_code"
    t.decimal "latitude"
    t.decimal "longitude"
    t.integer "service_radius_km"
    t.text "service_area_notes"
    t.json "additional_parishes"
    t.integer "experience_level"
    t.index ["active"], name: "index_trades_person_profiles_on_active"
    t.index ["availability_status"], name: "index_trades_person_profiles_on_availability_status"
    t.index ["parish_id"], name: "index_trades_person_profiles_on_parish_id"
    t.index ["user_id"], name: "index_trades_person_profiles_on_user_id", unique: true
    t.index ["years_experience"], name: "index_trades_person_profiles_on_years_experience"
  end

  create_table "trades_person_skills", force: :cascade do |t|
    t.integer "trades_person_profile_id", null: false
    t.integer "skill_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["skill_id"], name: "index_trades_person_skills_on_skill_id"
    t.index ["trades_person_profile_id", "skill_id"], name: "index_profile_skills_unique", unique: true
    t.index ["trades_person_profile_id"], name: "index_trades_person_skills_on_trades_person_profile_id"
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

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "client_profiles", "users"
  add_foreign_key "portfolio_images", "trades_person_profiles"
  add_foreign_key "sessions", "users"
  add_foreign_key "trades_person_profiles", "parishes"
  add_foreign_key "trades_person_profiles", "users"
  add_foreign_key "trades_person_skills", "skills"
  add_foreign_key "trades_person_skills", "trades_person_profiles"
end
