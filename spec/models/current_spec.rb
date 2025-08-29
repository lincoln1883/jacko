# frozen_string_literal: true

require "rails_helper"

RSpec.describe Current, type: :model do
  describe "attributes" do
    it "has session attribute" do
      session = build(:session)
      Current.session = session
      expect(Current.session).to eq(session)
    end

    it "has user_agent attribute" do
      user_agent = "Test Browser/1.0"
      Current.user_agent = user_agent
      expect(Current.user_agent).to eq(user_agent)
    end

    it "has ip_address attribute" do
      ip_address = "192.168.1.1"
      Current.ip_address = ip_address
      expect(Current.ip_address).to eq(ip_address)
    end
  end

  describe "delegation" do
    let(:user) { create(:user) }
    let(:session) { create(:session, user: user) }

    it "delegates user to session" do
      Current.session = session
      expect(Current.user).to eq(user)
    end

    it "returns nil for user when session is nil" do
      Current.session = nil
      expect(Current.user).to be_nil
    end

    it "allows nil session without raising an error" do
      Current.session = nil
      expect { Current.user }.not_to raise_error
      expect(Current.user).to be_nil
    end
  end

  describe "thread safety" do
    let(:user1) { create(:user, email: "user1@example.com") }
    let(:user2) { create(:user, email: "user2@example.com") }
    let(:session1) { create(:session, user: user1) }
    let(:session2) { create(:session, user: user2) }

    it "maintains separate state per thread" do
      results = []

      threads = [
        Thread.new do
          Current.session = session1
          Current.user_agent = "Browser 1"
          Current.ip_address = "192.168.1.1"
          sleep 0.1 # Allow time for other thread to set values
          results << {
            thread: 1,
            user: Current.user,
            user_agent: Current.user_agent,
            ip_address: Current.ip_address
          }
        end,

        Thread.new do
          Current.session = session2
          Current.user_agent = "Browser 2"
          Current.ip_address = "192.168.1.2"
          sleep 0.1 # Allow time for other thread to set values
          results << {
            thread: 2,
            user: Current.user,
            user_agent: Current.user_agent,
            ip_address: Current.ip_address
          }
        end
      ]

      threads.each(&:join)

      expect(results.size).to eq(2)

      thread1_result = results.find { |r| r[:thread] == 1 }
      thread2_result = results.find { |r| r[:thread] == 2 }

      expect(thread1_result[:user]).to eq(user1)
      expect(thread1_result[:user_agent]).to eq("Browser 1")
      expect(thread1_result[:ip_address]).to eq("192.168.1.1")

      expect(thread2_result[:user]).to eq(user2)
      expect(thread2_result[:user_agent]).to eq("Browser 2")
      expect(thread2_result[:ip_address]).to eq("192.168.1.2")
    end
  end

  describe "reset" do
    let(:session) { create(:session) }

    before do
      Current.session = session
      Current.user_agent = "Test Browser"
      Current.ip_address = "192.168.1.1"
    end

    it "clears all attributes when reset" do
      Current.reset

      expect(Current.session).to be_nil
      expect(Current.user_agent).to be_nil
      expect(Current.ip_address).to be_nil
      expect(Current.user).to be_nil
    end
  end

  describe "inheritance" do
    it "inherits from ActiveSupport::CurrentAttributes" do
      expect(Current.superclass).to eq(ActiveSupport::CurrentAttributes)
    end
  end

  describe "practical usage scenarios" do
    let(:user) { create(:user) }
    let(:session) { create(:session, user: user) }

    before do
      Current.session = session
      Current.user_agent = "Mozilla/5.0 (Test Browser)"
      Current.ip_address = "192.168.1.100"
    end

    after do
      Current.reset
    end

    it "provides access to current user throughout the request" do
      expect(Current.user).to eq(user)
      expect(Current.user.email).to eq(user.email)
    end

    it "provides request context for session creation" do
      new_session = user.sessions.create!
      expect(new_session.user_agent).to eq("Mozilla/5.0 (Test Browser)")
      expect(new_session.ip_address).to eq("192.168.1.100")
    end

    it "allows checking if user is authenticated" do
      expect(Current.user).to be_present

      Current.session = nil
      expect(Current.user).to be_nil
    end
  end
end
