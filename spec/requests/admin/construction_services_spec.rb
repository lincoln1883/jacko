# frozen_string_literal: true

require "rails_helper"
require "cgi" # Required for CGI.unescapeHTML

RSpec.describe "Admin::ConstructionServices", type: :request do
  let(:admin_user) { create(:user, :admin) }
  before { sign_in admin_user }

  describe "GET /index" do
    it "returns http success" do
      services = create_list(:construction_service, 3) # Create some services for index
      get admin_construction_services_path
      expect(response).to have_http_status(:success)

      json_response = JSON.parse(CGI.unescapeHTML(response.body.match(/<div id="app" data-page="(.*)"><\/div>/)[1]))
      services_props = json_response["props"]["services"]

      expect(services_props.map { |s| s["name"] }).to include(services.first.name)
    end
  end

  describe "GET /new" do
    it "returns http success" do
      get new_admin_construction_service_path
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new ConstructionService" do
        expect do
          post admin_construction_services_path, params: {construction_service: {name: "New Service", unit: "unit", price: 100, category: "Category A"}}
        end.to change(ConstructionService, :count).by(1)
        expect(response).to redirect_to(admin_construction_service_path(ConstructionService.last))
        expect(flash[:notice]).to eq("Construction service created successfully.")
      end
    end

    context "with invalid parameters" do
      it "does not create a ConstructionService" do
        expect do
          post admin_construction_services_path, params: {construction_service: {name: "", unit: "", price: nil, category: ""}}
        end.to_not change(ConstructionService, :count)
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe "GET /show" do
    let!(:construction_service) { create(:construction_service) }
    it "returns http success" do
      get admin_construction_service_path(construction_service)
      expect(response).to have_http_status(:success)
      expect(response.body).to include(construction_service.name)
    end
  end

  describe "GET /edit" do
    let!(:construction_service) { create(:construction_service) }
    it "returns http success" do
      get edit_admin_construction_service_path(construction_service)
      expect(response).to have_http_status(:success)
      expect(response.body).to include(construction_service.name)
    end
  end

  describe "PATCH /update" do
    let!(:construction_service) { create(:construction_service) }

    context "with valid parameters" do
      it "updates the ConstructionService" do
        patch admin_construction_service_path(construction_service), params: {construction_service: {name: "Updated Service"}}
        construction_service.reload
        expect(construction_service.name).to eq("Updated Service")
        expect(response).to redirect_to(admin_construction_service_path(construction_service))
        expect(flash[:notice]).to eq("Construction service updated successfully.")
      end
    end

    context "with invalid parameters" do
      it "does not update the ConstructionService" do
        patch admin_construction_service_path(construction_service), params: {construction_service: {name: ""}}
        construction_service.reload
        expect(construction_service.name).to_not eq("")
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe "DELETE /destroy" do
    let!(:construction_service) { create(:construction_service) }
    it "destroys the ConstructionService" do
      expect do
        delete admin_construction_service_path(construction_service)
      end.to change(ConstructionService, :count).by(-1)
      expect(response).to redirect_to(admin_construction_services_path)
      expect(flash[:notice]).to eq("Construction service deleted successfully.")
    end
  end
end
