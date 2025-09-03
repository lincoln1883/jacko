# frozen_string_literal: true

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Sample Users and Profiles for Development
if Rails.env.development?
  puts "Creating sample tradesperson profiles for development..."

  # Create sample tradespeople with profiles
  sample_trades = [
    {
      email: "marcus.builder@example.com",
      company_name: "Marcus Construction Ltd",
      bio: "Experienced builder with 15+ years in residential and commercial construction. Specializing in concrete work, foundations, and general contracting.",
      years_experience: 15,
      hourly_rate: 45.00,
      phone: "+1-876-555-0101",
      website: "https://marcusconstruction.jm",
      availability_status: :available,
      description: "I provide high-quality construction services across Kingston and surrounding areas. From small repairs to complete builds, I deliver on time and within budget. All work comes with a satisfaction guarantee."
    },
    {
      email: "sarah.electrician@example.com",
      company_name: "Lightning Fast Electric",
      bio: "Certified electrician with expertise in residential wiring, solar installations, and electrical repairs.",
      years_experience: 8,
      hourly_rate: 55.00,
      phone: "+1-876-555-0102",
      availability_status: :busy,
      description: "Professional electrical services with focus on safety and code compliance. I handle everything from outlet installations to complete electrical system upgrades. Solar panel installation specialist."
    },
    {
      email: "junior.plumber@example.com",
      company_name: "Flow Right Plumbing",
      bio: "Professional plumber handling all water system needs from installation to emergency repairs.",
      years_experience: 6,
      hourly_rate: 40.00,
      phone: "+1-876-555-0103",
      website: "https://flowrightplumbing.jm",
      availability_status: :available,
      description: "24/7 emergency plumbing services. Specializing in pipe repairs, bathroom installations, water heater servicing, and drain cleaning. Quick response times guaranteed."
    },
    {
      email: "maria.painter@example.com",
      company_name: "Colorful Spaces",
      bio: "Interior and exterior painting specialist with an eye for color and detail.",
      years_experience: 4,
      hourly_rate: 30.00,
      phone: "+1-876-555-0104",
      availability_status: :available,
      description: "Transform your space with professional painting services. Interior design consultation included. Eco-friendly paint options available. Free color consultations and estimates."
    },
    {
      email: "dave.mechanic@example.com",
      company_name: "Dave's Auto Repair",
      bio: "ASE certified automotive technician with 20+ years of experience in all types of vehicle repair.",
      years_experience: 22,
      hourly_rate: 65.00,
      phone: "+1-876-555-0105",
      website: "https://davesautorepair.jm",
      availability_status: :booked,
      description: "Complete automotive repair services including engine work, transmissions, brakes, and electrical systems. All makes and models welcome. Warranty on all work performed."
    }
  ]

  sample_trades.each do |trade_data|
    # Create or find user
    user = User.find_or_create_by(email: trade_data[:email]) do |u|
      u.password = "secure_password_123"
      u.role = :tradesperson
      u.verified = true
    end

    # Create or update tradesperson profile
    profile = user.trades_person_profile || user.build_trades_person_profile
    profile.update!(
      company_name: trade_data[:company_name],
      bio: trade_data[:bio],
      years_experience: trade_data[:years_experience],
      hourly_rate: trade_data[:hourly_rate],
      phone: trade_data[:phone],
      website: trade_data[:website],
      availability_status: trade_data[:availability_status],
      description: trade_data[:description],
      active: true
    )
    profile.mark_as_completed!

    puts "✓ Created #{profile.company_name} (#{user.email})"
  end

  # Create a sample client for testing
  client = User.find_or_create_by(email: "client.test@example.com") do |u|
    u.password = "secure_password_123"
    u.role = :client
    u.verified = true
  end

  if client.client_profile.nil?
    client.create_client_profile!(
      company_name: "Test Client Co",
      preferred_contact_method: :email,
      project_budget_range: "5000_10000",
      description: "Looking for reliable tradespeople for various home improvement projects.",
      active: true
    )
    client.client_profile.mark_as_completed!
    puts "✓ Created test client (#{client.email})"
  end

  # Create admin user
  admin = User.find_or_create_by(email: "admin@jacko.com") do |u|
    u.password = "secure_admin_password_123"
    u.role = :admin
    u.verified = true
  end
  puts "✓ Created admin user (#{admin.email})" if admin.persisted?

  puts "\nSample data created! You can sign in with:"
  puts "Tradespeople: marcus.builder@example.com, sarah.electrician@example.com, etc."
  puts "Client: client.test@example.com"
  puts "Admin: admin@jacko.com"
  puts "Password for all: secure_password_123 (or secure_admin_password_123 for admin)"
end
