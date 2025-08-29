# frozen_string_literal: true

module AuthenticationHelpers
  def sign_in(user)
    session = user.sessions.create!(
      user_agent: "Test Browser",
      ip_address: "127.0.0.1"
    )
    set_signed_cookie(:session_token, session.id)
    Current.session = session
  end

  def sign_out
    cookies.delete(:session_token)
    Current.reset
  end

  def set_signed_cookie(name, value)
    # Check if we're in a request spec by checking if cookies responds to signed
    if cookies.respond_to?(:signed)
      # Controller spec context - use normal signed cookies
      cookies.signed[name] = value
    else
      # Request spec context - use signed cookies but work around the test limitation
      signed_value = sign_cookie_value(value)
      cookies[name] = signed_value
    end
  end

  def get_signed_cookie(name)
    # Check if we're in a request spec by checking if cookies responds to signed
    if cookies.respond_to?(:signed)
      # Controller spec context - use normal signed cookies
      cookies.signed[name]
    else
      # Request spec context - manually verify the cookie
      cookie_value = cookies[name]
      return nil unless cookie_value

      # Handle both our test format and real Rails signed cookies
      if cookie_value.start_with?("signed:")
        # Our simple test format
        unsign_cookie_value(cookie_value)
      else
        # Real Rails signed cookie format
        decode_rails_signed_cookie(cookie_value)
      end
    end
  end

  private

  def sign_cookie_value(value)
    # Simple signing for tests - just wrap the value
    # In real app, Rails uses cryptographic signing
    "signed:#{value}"
  end

  def unsign_cookie_value(signed_value)
    return nil unless signed_value&.start_with?("signed:")
    signed_value.gsub(/^signed:/, "")
  end

  def decode_rails_signed_cookie(cookie_value)
    return nil unless cookie_value

    # Rails signed cookie format: base64_payload--signature
    # We'll extract the payload and decode it (ignoring signature verification for tests)
    payload_part = cookie_value.split("--").first
    return nil unless payload_part

    begin
      # Decode base64
      decoded = Base64.decode64(payload_part)
      # Parse JSON
      parsed = JSON.parse(decoded)
      # Extract the actual value
      rails_data = parsed["_rails"]
      return nil unless rails_data

      # The message contains the actual value, which might be base64 encoded
      message = rails_data["message"]

      # Try to decode the message as base64 (Rails often base64 encodes values)
      begin
        Base64.decode64(message)
      rescue
        # If base64 decode fails, return the raw message
        message
      end
    rescue => e
      Rails.logger.debug "Failed to decode Rails signed cookie: #{e.message}" if defined?(Rails)
      nil
    end
  end

  # Helper to simulate proper cookie signing in request specs
  def simulate_signed_session_for_request(user)
    session = user.sessions.create!(
      user_agent: "Test Browser",
      ip_address: "127.0.0.1"
    )
    # Set the cookie in a way that matches what Rails would do
    set_signed_cookie(:session_token, session.id)
    session
  end
end

RSpec.configure do |config|
  config.include AuthenticationHelpers, type: :controller
  config.include AuthenticationHelpers, type: :request

  config.before(:each, type: :controller) do
    Current.reset
    ActionMailer::Base.deliveries.clear
  end

  config.before(:each, type: :request) do
    Current.reset
    ActionMailer::Base.deliveries.clear
  end
end
