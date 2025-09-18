# frozen_string_literal: true

# FactoryBot configuration and support

RSpec.configure do |config|
  # Include FactoryBot methods
  config.include FactoryBot::Syntax::Methods

  # Lint factories before running the test suite
  # config.before(:suite) do
  #   FactoryBot.lint
  # end
end
