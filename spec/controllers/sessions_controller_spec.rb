require 'rails_helper'

RSpec.describe SessionsController, type: :controller do
  include ActiveSupport::Testing::TimeHelpers
  
  let(:user) { create(:user, :verified, password: 'test_password_123', password_confirmation: 'test_password_123') }

  describe 'GET #index' do
    context 'when user is authenticated' do
      before { sign_in(user) }

      it 'returns a successful response' do
        get :index
        expect(response).to be_successful
      end

      it 'renders the Sessions/Index Inertia component' do
        get :index
        expect_inertia_render('Auth/Sessions/Index')
      end

      it 'includes sessions in props' do
        session1 = create(:session, user: user, user_agent: 'Chrome/1.0', ip_address: '192.168.1.1')
        session2 = create(:session, user: user, user_agent: 'Firefox/1.0', ip_address: '192.168.1.2')

        get :index

        props = assigns(:_inertia)[:props]
        expect(props[:sessions]).to be_present
        expect(props[:sessions].length).to eq(3) # 2 created + 1 from sign_in helper
        
        sessions_data = props[:sessions]
        expect(sessions_data.map { |s| s[:user_agent] }).to include('Chrome/1.0', 'Firefox/1.0')
        expect(sessions_data.map { |s| s[:ip_address] }).to include('192.168.1.1', '192.168.1.2')
      end

      it 'orders sessions by created_at desc' do
        old_session = nil
        new_session = nil

        travel_to(2.hours.ago) do
          old_session = create(:session, user: user, user_agent: 'Old Browser')
        end

        travel_to(1.hour.ago) do
          new_session = create(:session, user: user, user_agent: 'New Browser')
        end

        get :index

        props = assigns(:_inertia)[:props]
        session_user_agents = props[:sessions].map { |s| s[:user_agent] }
        
        # Should be ordered by created_at desc, so newer sessions first
        new_index = session_user_agents.index('New Browser')
        old_index = session_user_agents.index('Old Browser')
        expect(new_index).to be < old_index
      end
    end

    context 'when user is not authenticated' do
      it 'redirects to sign in path' do
        get :index
        expect(response).to redirect_to(sign_in_path)
      end
    end
  end

  describe 'GET #new' do
    it 'returns a successful response' do
      get :new
      expect(response).to be_successful
    end

    it 'renders the Auth/SignIn Inertia component' do
      get :new
      expect_inertia_render('Auth/SignIn')
    end

    it 'includes email_hint in props when provided' do
      get :new, params: { email_hint: 'user@example.com' }
      
      props = assigns(:_inertia)[:props]
      expect(props[:email_hint]).to eq('user@example.com')
    end

    it 'works without email_hint parameter' do
      get :new
      
      props = assigns(:_inertia)[:props]
      expect(props[:email_hint]).to be_nil
    end
  end

  describe 'POST #create' do
    context 'with valid credentials' do
      it 'creates a new session' do
        expect {
          post :create, params: { email: user.email, password: 'test_password_123' }
        }.to change { user.sessions.count }.by(1)
      end

      it 'sets the session token cookie' do
        post :create, params: { email: user.email, password: 'test_password_123' }
        
        expect(cookies.signed[:session_token]).to be_present
        session = Session.find(cookies.signed[:session_token])
        expect(session.user).to eq(user)
      end

      it 'redirects to root path with success notice' do
        post :create, params: { email: user.email, password: 'test_password_123' }
        
        expect(response).to redirect_to(root_path)
        expect(flash[:notice]).to eq('Signed in successfully')
      end

      it 'works with email in different case' do
        post :create, params: { email: user.email.upcase, password: 'test_password_123' }
        
        expect(response).to redirect_to(root_path)
        expect(flash[:notice]).to eq('Signed in successfully')
      end
    end

    context 'with invalid credentials' do
      it 'does not create a session with wrong password' do
        expect {
          post :create, params: { email: user.email, password: 'wrong_password' }
        }.not_to change { user.sessions.count }
      end

      it 'redirects to sign in with alert for wrong password' do
        post :create, params: { email: user.email, password: 'wrong_password' }
        
        expect(response).to redirect_to(sign_in_path(email_hint: user.email))
        expect(flash[:alert]).to eq('That email or password is incorrect')
      end

      it 'does not create a session with wrong email' do
        expect {
          post :create, params: { email: 'wrong@example.com', password: 'test_password_123' }
        }.not_to change { Session.count }
      end

      it 'redirects to sign in with alert for wrong email' do
        post :create, params: { email: 'wrong@example.com', password: 'test_password_123' }
        
        expect(response).to redirect_to(sign_in_path(email_hint: 'wrong@example.com'))
        expect(flash[:alert]).to eq('That email or password is incorrect')
      end
    end

    context 'with missing parameters' do
      it 'handles missing email' do
        post :create, params: { password: 'test_password_123' }
        
        expect(response).to redirect_to(sign_in_path(email_hint: nil))
        expect(flash[:alert]).to eq('That email or password is incorrect')
      end

      it 'handles missing password' do
        post :create, params: { email: user.email }
        
        expect(response).to redirect_to(sign_in_path(email_hint: user.email))
        expect(flash[:alert]).to eq('That email or password is incorrect')
      end
    end
  end

  describe 'DELETE #destroy' do
    let!(:session_to_delete) { create(:session, user: user) }
    let!(:session_to_keep) { create(:session, user: user) }

    before { sign_in(user) }

    it 'destroys the specified session' do
      expect {
        delete :destroy, params: { id: session_to_delete.id }
      }.to change { Session.count }.by(-1)
      
      expect { session_to_delete.reload }.to raise_error(ActiveRecord::RecordNotFound)
      expect(session_to_keep.reload).to be_present
    end

    it 'redirects to sessions path with notice' do
      delete :destroy, params: { id: session_to_delete.id }
      
      expect(response).to redirect_to(sessions_path)
      expect(flash[:notice]).to eq('That session has been logged out')
    end

    it 'only allows user to delete their own sessions' do
      other_user = create(:user, email: 'other@example.com')
      other_session = create(:session, user: other_user)

      expect {
        delete :destroy, params: { id: other_session.id }
      }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it 'raises error for non-existent session' do
      expect {
        delete :destroy, params: { id: 99999 }
      }.to raise_error(ActiveRecord::RecordNotFound)
    end

    context 'when user is not authenticated' do
      before { sign_out }

      it 'redirects to sign in path' do
        delete :destroy, params: { id: session_to_delete.id }
        expect(response).to redirect_to(sign_in_path)
      end
    end
  end

  describe 'authentication skip' do
    it 'allows access to new without authentication' do
      # Ensure we're not signed in
      sign_out
      
      get :new
      expect(response).to be_successful
    end

    it 'allows access to create without authentication' do
      # Ensure we're not signed in
      sign_out
      
      post :create, params: { email: user.email, password: 'test_password_123' }
      expect(response).to be_redirect # Should redirect on success, not authentication failure
    end

    it 'requires authentication for index' do
      sign_out
      
      get :index
      expect(response).to redirect_to(sign_in_path)
    end

    it 'requires authentication for destroy' do
      sign_out
      session_to_delete = create(:session, user: user)
      
      delete :destroy, params: { id: session_to_delete.id }
      expect(response).to redirect_to(sign_in_path)
    end
  end

  # Helper method to check Inertia component rendering
  def expect_inertia_render(component)
    expect(assigns(:_inertia)[:component]).to eq(component)
  end
end
