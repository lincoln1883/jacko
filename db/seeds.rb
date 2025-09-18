# frozen_string_literal: true

# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Sample Users and Profiles for Development
if Rails.env.development?
  puts "Setting up Jamaica parishes..."

  # Create Jamaica parishes first
  jamaica_parishes = [
    {name: "Kingston", code: "KIN", main_city: "Kingston", latitude: 17.9712, longitude: -76.7936, population: 89057},
    {name: "St. Andrew", code: "SAN", main_city: "Half Way Tree", latitude: 18.0179, longitude: -76.8099, population: 573369},
    {name: "St. Thomas", code: "STH", main_city: "Morant Bay", latitude: 17.8816, longitude: -76.4093, population: 93902},
    {name: "Portland", code: "POR", main_city: "Port Antonio", latitude: 18.1758, longitude: -76.4451, population: 82183},
    {name: "St. Mary", code: "STM", main_city: "Port Maria", latitude: 18.3708, longitude: -76.9058, population: 113615},
    {name: "St. Ann", code: "STA", main_city: "Saint Ann's Bay", latitude: 18.4372, longitude: -77.2076, population: 172362},
    {name: "Trelawny", code: "TRL", main_city: "Falmouth", latitude: 18.4917, longitude: -77.6510, population: 75558},
    {name: "St. James", code: "STJ", main_city: "Montego Bay", latitude: 18.4762, longitude: -77.8937, population: 185801},
    {name: "Hanover", code: "HAN", main_city: "Lucea", latitude: 18.4509, longitude: -78.1736, population: 69533},
    {name: "Westmoreland", code: "WES", main_city: "Savanna-la-Mar", latitude: 18.2186, longitude: -78.1336, population: 144817},
    {name: "St. Elizabeth", code: "STE", main_city: "Black River", latitude: 18.0264, longitude: -77.8564, population: 150205},
    {name: "Manchester", code: "MAN", main_city: "Mandeville", latitude: 18.0438, longitude: -77.5016, population: 189797},
    {name: "Clarendon", code: "CLA", main_city: "May Pen", latitude: 17.9651, longitude: -77.2456, population: 245103},
    {name: "St. Catherine", code: "STC", main_city: "Spanish Town", latitude: 17.9909, longitude: -76.9590, population: 516218}
  ]

  jamaica_parishes.each do |parish_data|
    parish = Parish.find_or_create_by(code: parish_data[:code]) do |p|
      p.name = parish_data[:name]
      p.main_city = parish_data[:main_city]
      p.latitude = parish_data[:latitude]
      p.longitude = parish_data[:longitude]
      p.population = parish_data[:population]
      p.active = true
    end
    puts "✓ Created parish: #{parish.name} (#{parish.code})"
  end

  puts "\nCreating sample tradesperson profiles for development..."

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
      experience_level: :expert,
      parish_code: "KIN",
      city_town: "Kingston",
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
      experience_level: :intermediate,
      parish_code: "SAN",
      city_town: "Half Way Tree",
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
      experience_level: :intermediate,
      parish_code: "STJ",
      city_town: "Montego Bay",
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
      experience_level: :graduate,
      parish_code: "MAN",
      city_town: "Mandeville",
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
      experience_level: :master,
      parish_code: "STC",
      city_town: "Spanish Town",
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

    # Find the parish for this tradesperson
    parish = Parish.find_by(code: trade_data[:parish_code])

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
      experience_level: trade_data[:experience_level],
      description: trade_data[:description],
      parish: parish,
      city_town: trade_data[:city_town],
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

  # Skills and Trade Categories for Jamaica Market
  puts "\nCreating Jamaica trade skills and categories..."

  jamaica_skills = [
    # Construction & Building
    {name: "Masonry & Brickwork", category: "Construction & Building", description: "Building with concrete blocks, bricks, and natural stone"},
    {name: "Concrete Work & Foundations", category: "Construction & Building", description: "Concrete pouring, finishing, and foundation construction"},
    {name: "Steel Fixing & Reinforcement", category: "Construction & Building", description: "Rebar placement and steel reinforcement for concrete structures"},
    {name: "Residential Construction", category: "Construction & Building", description: "Home building, renovations, and residential projects"},
    {name: "Commercial Construction", category: "Construction & Building", description: "Office buildings, retail spaces, and commercial structures"},
    {name: "Roofing & Waterproofing", category: "Construction & Building", description: "Roof installation, repair, and waterproofing systems"},
    {name: "Drywall & Plastering", category: "Construction & Building", description: "Interior wall finishing and plaster work"},
    {name: "Painting & Decorating", category: "Construction & Building", description: "Interior and exterior painting, decorative finishes"},
    {name: "Flooring Installation", category: "Construction & Building", description: "Tile, wood, laminate, and specialty flooring"},
    {name: "Carpentry & Joinery", category: "Construction & Building", description: "Custom woodwork, cabinets, and furniture making"},

    # Electrical & Electronics
    {name: "Residential Wiring", category: "Electrical & Electronics", description: "Home electrical systems and wiring installation"},
    {name: "Commercial Electrical", category: "Electrical & Electronics", description: "Commercial building electrical systems and maintenance"},
    {name: "Solar Panel Installation", category: "Electrical & Electronics", description: "Solar energy system design and installation"},
    {name: "Electrical Troubleshooting", category: "Electrical & Electronics", description: "Electrical problem diagnosis and repair"},
    {name: "Generator Installation & Maintenance", category: "Electrical & Electronics", description: "Backup power systems for homes and businesses"},
    {name: "Security System Installation", category: "Electrical & Electronics", description: "CCTV, alarms, and access control systems"},
    {name: "LED Lighting Systems", category: "Electrical & Electronics", description: "Energy-efficient lighting design and installation"},
    {name: "Electronics Repair", category: "Electrical & Electronics", description: "Consumer electronics and appliance repair"},

    # Plumbing & HVAC
    {name: "Residential Plumbing", category: "Plumbing & HVAC", description: "Home plumbing installation and repair"},
    {name: "Commercial Plumbing", category: "Plumbing & HVAC", description: "Commercial building plumbing systems"},
    {name: "Pipe Installation & Repair", category: "Plumbing & HVAC", description: "Water supply and drainage pipe systems"},
    {name: "Water Heater Services", category: "Plumbing & HVAC", description: "Hot water system installation and maintenance"},
    {name: "Bathroom Renovation", category: "Plumbing & HVAC", description: "Complete bathroom remodeling and fixture installation"},
    {name: "Air Conditioning Installation", category: "Plumbing & HVAC", description: "AC unit installation and ductwork"},
    {name: "AC Repair & Maintenance", category: "Plumbing & HVAC", description: "Air conditioning system servicing and repair"},
    {name: "Drainage Systems", category: "Plumbing & HVAC", description: "Storm water and sewage drainage solutions"},

    # Automotive & Transportation
    {name: "Auto Mechanical Repair", category: "Automotive & Transportation", description: "Engine repair and general automotive maintenance"},
    {name: "Auto Body & Paint", category: "Automotive & Transportation", description: "Vehicle body work and automotive painting"},
    {name: "Auto Electrical Systems", category: "Automotive & Transportation", description: "Vehicle electrical diagnostics and repair"},
    {name: "Tire Services", category: "Automotive & Transportation", description: "Tire installation, balancing, and alignment"},
    {name: "Motorcycle Repair", category: "Automotive & Transportation", description: "Motorcycle and scooter maintenance and repair"},
    {name: "Marine Engine Repair", category: "Automotive & Transportation", description: "Boat and marine engine servicing"},
    {name: "Heavy Equipment Operation", category: "Automotive & Transportation", description: "Operating bulldozers, excavators, and construction equipment"},

    # Information Technology
    {name: "Computer Repair", category: "Information Technology", description: "Desktop and laptop computer troubleshooting and repair"},
    {name: "Network Installation", category: "Information Technology", description: "Home and business network setup and configuration"},
    {name: "Web Development", category: "Information Technology", description: "Website design and development services"},
    {name: "Mobile Device Repair", category: "Information Technology", description: "Smartphone and tablet repair services"},
    {name: "Data Recovery Services", category: "Information Technology", description: "Recovering lost data from computers and devices"},
    {name: "POS System Installation", category: "Information Technology", description: "Point of sale system setup for businesses"},

    # Beauty & Personal Care
    {name: "Hair Styling & Cutting", category: "Beauty & Personal Care", description: "Professional hair care and styling services"},
    {name: "Barbering Services", category: "Beauty & Personal Care", description: "Traditional and modern barbering techniques"},
    {name: "Nail Care & Art", category: "Beauty & Personal Care", description: "Manicure, pedicure, and nail art services"},
    {name: "Makeup Artistry", category: "Beauty & Personal Care", description: "Professional makeup application for events"},
    {name: "Spa & Massage Therapy", category: "Beauty & Personal Care", description: "Therapeutic massage and spa treatments"},
    {name: "Skincare Treatments", category: "Beauty & Personal Care", description: "Facial treatments and skincare consultations"},

    # Food Service & Hospitality
    {name: "Caribbean Cuisine", category: "Food Service & Hospitality", description: "Traditional Jamaican and Caribbean cooking"},
    {name: "Catering Services", category: "Food Service & Hospitality", description: "Event catering and food service management"},
    {name: "Baking & Pastry", category: "Food Service & Hospitality", description: "Bread, cakes, and pastry making"},
    {name: "Event Planning", category: "Food Service & Hospitality", description: "Wedding and event coordination services"},
    {name: "Bartending & Mixology", category: "Food Service & Hospitality", description: "Professional bar service and cocktail preparation"},
    {name: "Restaurant Management", category: "Food Service & Hospitality", description: "Food service operations and management"},

    # Agriculture & Landscaping
    {name: "Landscape Design", category: "Agriculture & Landscaping", description: "Garden and outdoor space design and planning"},
    {name: "Lawn Care & Maintenance", category: "Agriculture & Landscaping", description: "Grass cutting, trimming, and lawn maintenance"},
    {name: "Tree Cutting & Trimming", category: "Agriculture & Landscaping", description: "Tree removal and pruning services"},
    {name: "Organic Farming", category: "Agriculture & Landscaping", description: "Sustainable and organic agricultural practices"},
    {name: "Irrigation Systems", category: "Agriculture & Landscaping", description: "Water management systems for agriculture and landscaping"},
    {name: "Plant Nursery Management", category: "Agriculture & Landscaping", description: "Plant cultivation and nursery operations"},

    # Home Services & Maintenance
    {name: "General Handyman", category: "Home Services & Maintenance", description: "Small repairs and maintenance around the home"},
    {name: "House Cleaning", category: "Home Services & Maintenance", description: "Residential and commercial cleaning services"},
    {name: "Pest Control", category: "Home Services & Maintenance", description: "Insect and rodent elimination and prevention"},
    {name: "Security Guard Services", category: "Home Services & Maintenance", description: "Property protection and security services"},
    {name: "Moving & Delivery", category: "Home Services & Maintenance", description: "Furniture moving and delivery services"},
    {name: "Pool Maintenance", category: "Home Services & Maintenance", description: "Swimming pool cleaning and chemical balancing"},

    # Manufacturing & Craft
    {name: "Furniture Making", category: "Manufacturing & Craft", description: "Custom furniture design and construction"},
    {name: "Metalworking & Welding", category: "Manufacturing & Craft", description: "Metal fabrication and welding services"},
    {name: "Jewelry Making", category: "Manufacturing & Craft", description: "Custom jewelry design and repair"},
    {name: "Leather Working", category: "Manufacturing & Craft", description: "Leather goods manufacturing and repair"},
    {name: "Textile & Sewing", category: "Manufacturing & Craft", description: "Clothing alteration and custom textile work"},

    # Health & Wellness
    {name: "Personal Training", category: "Health & Wellness", description: "Fitness coaching and exercise instruction"},
    {name: "Yoga & Meditation", category: "Health & Wellness", description: "Mindfulness and wellness instruction"},
    {name: "Nutrition Consulting", category: "Health & Wellness", description: "Diet and nutrition guidance"},
    {name: "Elder Care Services", category: "Health & Wellness", description: "In-home care for elderly individuals"},

    # Creative & Media
    {name: "Photography Services", category: "Creative & Media", description: "Event, portrait, and commercial photography"},
    {name: "Videography & Editing", category: "Creative & Media", description: "Video production and post-production services"},
    {name: "Graphic Design", category: "Creative & Media", description: "Logo design, branding, and print materials"},
    {name: "Music Production", category: "Creative & Media", description: "Recording, mixing, and music production"},
    {name: "DJ Services", category: "Creative & Media", description: "Event entertainment and music services"}
  ]

  jamaica_skills.each do |skill_data|
    skill = Skill.find_or_create_by(name: skill_data[:name]) do |s|
      s.category = skill_data[:category]
      s.description = skill_data[:description]
      s.active = true
    end
    puts "✓ Created skill: #{skill.name} (#{skill.category})"
  end

  # Add some skills to existing tradesperson profiles
  puts "\nAssigning skills to existing tradesperson profiles..."
  TradesPersonProfile.includes(:user, :skills).each do |profile|
    next if profile.skills.any? # Skip if already has skills

    # Assign relevant skills based on existing profile data
    relevant_skills = []

    case profile.company_name
    when /construction|building/i
      relevant_skills = Skill.where(category: "Construction & Building").limit(3)
    when /electric/i
      relevant_skills = Skill.where(category: "Electrical & Electronics").limit(3)
    when /plumb/i
      relevant_skills = Skill.where(category: "Plumbing & HVAC").limit(3)
    when /auto|mechanic/i
      relevant_skills = Skill.where(category: "Automotive & Transportation").limit(3)
    when /paint/i
      relevant_skills = Skill.where(name: ["Painting & Decorating"]).limit(2)
    else
      # Assign some general skills
      relevant_skills = Skill.where(name: ["General Handyman", "Home Services & Maintenance"]).limit(2)
    end

    relevant_skills.each do |skill|
      profile.skills << skill unless profile.skills.include?(skill)
    end

    puts "✓ Assigned #{relevant_skills.count} skills to #{profile.company_name}"
  end

  puts "\n🎯 Jamaica Skills Taxonomy Complete!"
  puts "Created #{Skill.count} skills across #{Skill.distinct(:category).count} categories"
  puts "Categories: #{Skill.distinct(:category).pluck(:category).join(', ')}"
end
