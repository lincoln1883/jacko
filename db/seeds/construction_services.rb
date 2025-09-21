# frozen_string_literal: true

# db/seeds/construction_services.rb

require "csv"

puts "Seeding construction services..."

# Helper to determine category based on service name
def determine_category(service_name)
  case service_name.downcase
  when /blocks|lay|roughcast|granite|pavers|bricks|sereeds|tiles|marble|porcelain|vinyl|mosaic/ then "Masonry & Tiling"
  when /foundation|dig|excavate/ then "Foundation & Excavation"
  when /column/ then "Column Work"
  when /belting/ then "Belting"
  when /lintel/ then "Lintel Work"
  when /cantilever/ then "Cantilever Work"
  when /arch/ then "Arch Work"
  when /templates|jamb/ then "General Concrete Finishing"
  when /hack concrete|pebble dash|tyrolean|spanish wave/ then "Wall Finishing"
  when /render to wall|render wall|fair face/ then "Rendering & Fair Facing"
  when /paint|water seal/ then "Painting & Waterproofing"
  when /flooring|spray flooring|rod & settle|fill & ram/ then "Flooring & Slabs"
  when /cut arriss|dress arriss/ then "Finishing Details"
  when /baluster|molding|staircase/ then "Stair & Balustrade"
  when /labourer/ then "General Labour"
  when /steel work|stirrups|links/ then "Steelwork"
  when /shed/ then "Shed Construction"
  when /roofing|lathe|shingle|zinc|aluminium|clay tiles|capping|hip|valleys|gutter/ then "Roofing"
  when /gypsum|plywood/ then "Interior Sheeting"
  when /hurricane straps/ then "Structural Fasteners"
  when /profile boards/ then "Site Preparation"
  when /gully basin|sewer manholes|absorption pit|kerb & channel/ then "Drainage & Sewerage"
  when /window frame|door frame|stiffener|skirting|handrails|baluster|back-up-board|wall plate|rafters|lathe|beam|scaffolding|battens|blocking board|fascia|flooring board|louvers|jamb|door|closet doors|steel door|casement dor|glass|rod|barrel bolts|french doors|kitchen cupboards|lock|panic latch|door closers|door pull|mirror|hoarding/ then "Carpentry & Joinery"
  else "Miscellaneous"
  end
end

# Read the prices.txt file
file_content = File.read(Rails.root.join("prices.txt"))

# Initialize categories
current_category = "Miscellaneous"

# To store the last identified service name, for multi-line entries
last_service_name = nil

# Regex to find price and unit. Capture group 1 is price, group 2 is unit.
price_and_unit_regex = /\$?(S?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)\s*(per\s(?:running\sft|square\syd|square\sft|cubic\syd|pound|dozen|thread|day|ft|sq\.\syd|each|pair|100\ssquare\sft|100\ssguRre\sli|running|sq\.ft))?/i

file_content.each_line do |line|
  stripped_line = line.strip

  # Skip known header/footer lines and empty lines
  next if stripped_line.empty? ||
          stripped_line.include?("INDEPENDENT CONTRACTORS RATE SHEET") ||
          stripped_line.include?("UPDATED DEC") ||
          stripped_line.include?("PAGE") ||
          stripped_line.include?("PLEASE NOTE") ||
          stripped_line.include?("Cost-") ||
          stripped_line.include?("Email:") ||
          stripped_line.match?(/^\d+\.$/) # Skip lines with just numbers and a dot (e.g., "11.")

  # Update category based on section headers
  if stripped_line.include?("STEELWORK")
    current_category = "Steelwork"
    next
  elsif stripped_line.include?("PAINTING")
    current_category = "Painting & Waterproofing"
    next
  elsif stripped_line.include?("CARPENTER")
    current_category = "Carpentry & Joinery"
    next
  elsif stripped_line.include?("ROOFING")
    current_category = "Roofing"
    next
  elsif stripped_line.include?("FOR PROFILE BOARDS")
    current_category = "Site Preparation"
    next
  elsif stripped_line.include?("Trap Gully Basin") ||
        stripped_line.include?("To build Sewer Manholes") ||
        stripped_line.include?("To dig Absorption pit") ||
        stripped_line.include?("To build Kerb & Channel")
    current_category = "Drainage & Sewerage"
  end

  # Try to find price and unit first
  price_unit_match = stripped_line.match(price_and_unit_regex)

  if price_unit_match
    # If we find a price and unit, check if there's a service name on this line
    # The part of the string before the price/unit match could be the service name
    potential_name_part = price_unit_match.pre_match.strip

    if potential_name_part.present?
      # If there's a potential name and it's not just a number prefix
      # Assume this is a complete service definition
      name = potential_name_part.sub(/^\d+\.\s*/, "").strip # Remove leading numbers and dots
      last_service_name = name # Update last_service_name for future multi-line parsing
    elsif last_service_name # If no name on this line, use the last identified service name
      name = last_service_name
    else
      # Still no service name, skip this line or handle as an error
      # For now, let's skip to avoid "Name can't be blank"
      next
    end

    price_str = price_unit_match[1].sub("S", "").gsub(",", "")
    price = price_str.to_d
    unit = (price_unit_match[2] || "").strip.gsub("per", "").strip

    # Correct common typos in units
    unit = unit.gsub("sguRre fi", "square ft").gsub("unn", "running ft").gsub("sSquare f", "square ft").gsub("sguRre li", "square ft")
    unit = unit.presence || "unit" # Default to "unit" if still empty

    ConstructionService.find_or_create_by!(name: name) do |service|
      service.unit = unit
      service.price = price
      service.category = determine_category(name) # Determine category based on the actual service name
    end

    # Reset last_service_name if this was a complete entry
    last_service_name = nil

  elsif stripped_line.match?(/^(?:\d+\.\s*)?(.+)$/) # Line contains text, might be a service name
    # If it's not a price/unit line, it might be a service name or part of it
    potential_name = stripped_line.sub(/^\d+\.\s*/, "").strip # Remove leading numbers and dots
    if potential_name.present? && !potential_name.match?(/^\$?(S?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)$/i) # Ensure it's not just a price string
      last_service_name = potential_name
    end
  end
end

puts "Construction services seeding completed."
