require 'rails_helper'

RSpec.describe Session, type: :model do
  subject(:session) { build(:session) }

  describe 'associations' do
    it { is_expected.to belong_to(:user) }
  end

  describe 'validations' do
    it 'is valid with valid attributes' do
      expect(session).to be_valid
    end

    it 'is invalid without a user' do
      session.user = nil
      expect(session).not_to be_valid
      expect(session.errors[:user]).to include("must exist")
    end
  end

  describe 'callbacks' do
    describe 'before_create' do
      let(:user) { create(:user) }
      let(:test_user_agent) { 'Test User Agent' }
      let(:test_ip_address) { '192.168.1.100' }

      before do
        Current.user_agent = test_user_agent
        Current.ip_address = test_ip_address
      end

      after do
        Current.reset
      end

      it 'sets user_agent from Current before creation' do
        session = user.sessions.build
        session.save!
        expect(session.user_agent).to eq(test_user_agent)
      end

      it 'sets ip_address from Current before creation' do
        session = user.sessions.build
        session.save!
        expect(session.ip_address).to eq(test_ip_address)
      end

      it 'sets both user_agent and ip_address on creation' do
        session = user.sessions.create!
        expect(session.user_agent).to eq(test_user_agent)
        expect(session.ip_address).to eq(test_ip_address)
      end

      it 'overrides manually set values with Current values' do
        manual_user_agent = 'Manually Set Agent'
        manual_ip_address = '10.0.0.1'
        
        session = user.sessions.create!(
          user_agent: manual_user_agent,
          ip_address: manual_ip_address
        )
        
        # The callback should override the manually set values
        expect(session.user_agent).to eq(test_user_agent)
        expect(session.ip_address).to eq(test_ip_address)
      end

      context 'when Current attributes are nil' do
        before do
          Current.user_agent = nil
          Current.ip_address = nil
        end

        it 'allows nil values' do
          session = user.sessions.create!
          expect(session.user_agent).to be_nil
          expect(session.ip_address).to be_nil
        end
      end
    end
  end

  describe 'database constraints' do
    it 'allows multiple sessions for the same user' do
      user = create(:user)
      session1 = create(:session, user: user)
      session2 = create(:session, user: user)
      
      expect(session1).to be_persisted
      expect(session2).to be_persisted
      expect(user.sessions.count).to eq(2)
    end

    it 'cascades deletion when user is destroyed' do
      user = create(:user)
      session = create(:session, user: user)
      
      expect { user.destroy }.to change { Session.count }.by(-1)
    end
  end

  describe 'factory' do
    it 'creates a valid session' do
      session = build(:session)
      expect(session).to be_valid
    end

    it 'creates a session with associated user' do
      session = create(:session)
      expect(session.user).to be_present
      expect(session.user).to be_a(User)
    end

    it 'uses Current values when creating sessions' do
      Current.user_agent = "Mozilla/5.0 (compatible test browser)"
      Current.ip_address = "192.168.1.1"
      
      session = create(:session)
      expect(session.user_agent).to eq("Mozilla/5.0 (compatible test browser)")
      expect(session.ip_address).to eq("192.168.1.1")
      
      Current.reset
    end
  end
end
