module AuthenticationHelpers
  def sign_in(user)
    session = user.sessions.create!(
      user_agent: 'Test Browser',
      ip_address: '127.0.0.1'
    )
    cookies.signed[:session_token] = session.id
    Current.session = session
  end

  def sign_out
    cookies.delete(:session_token)
    Current.reset
  end
end

RSpec.configure do |config|
  config.include AuthenticationHelpers, type: :controller
  config.include AuthenticationHelpers, type: :request

  config.before(:each, type: :controller) do
    Current.reset
  end

  config.before(:each, type: :request) do
    Current.reset
  end
end
