# frozen_string_literal: true

require "rails_helper"
require "cgi" # Required for CGI.unescapeHTML

RSpec.describe "Admin::Jobs", type: :request do
  let(:admin_user) { create(:user, :admin) }
  before { sign_in admin_user }

  describe "GET /index" do
    it "returns http success" do
      create_list(:job, 3, :with_supplier) # Create some jobs for index, ensuring they have suppliers
      get admin_jobs_path
      expect(response).to have_http_status(:success)

      json_response = JSON.parse(CGI.unescapeHTML(response.body.match(/<div id="app" data-page="(.*)"><\/div>/)[1]))
      jobs_props = json_response["props"]["jobs"]

      expect(jobs_props.map { |j| j["title"] }).to include(Job.first.title)
    end
  end

  describe "GET /new" do
    it "returns http success" do
      get new_admin_job_path
      expect(response).to have_http_status(:success)
    end
  end

  describe "POST /create" do
    let(:client_user) { create(:user, :client) }
    let(:parish) { create(:parish) }

    context "with valid parameters" do
      it "creates a new Job" do
        expect do
          post admin_jobs_path, params: {job: {title: "New Job", description: "Job description", budget: 1000, due_date: 1.week.from_now, location: "Location", parish_id: parish.id, client_id: client_user.id, status: "open"}}
        end.to change(Job, :count).by(1)
        expect(response).to redirect_to(admin_job_path(Job.last))
        expect(flash[:notice]).to eq("Job created successfully.")
      end
    end

    context "with invalid parameters" do
      it "does not create a Job" do
        expect do
          post admin_jobs_path, params: {job: {title: "", description: "", budget: nil}}
        end.to_not change(Job, :count)
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe "GET /show" do
    let!(:job) { create(:job, :open, :with_supplier) }
    it "returns http success" do
      get admin_job_path(job)
      expect(response).to have_http_status(:success)
      expect(response.body).to include(job.title)
    end
  end

  describe "GET /edit" do
    let!(:job) { create(:job, :open, :with_supplier) }
    it "returns http success" do
      get edit_admin_job_path(job)
      expect(response).to have_http_status(:success)
      expect(response.body).to include(job.title)
    end
  end

  describe "PATCH /update" do
    let!(:job) { create(:job, :open, :with_supplier) }

    context "with valid parameters" do
      it "updates the Job" do
        patch admin_job_path(job), params: {job: {title: "Updated Job"}}
        job.reload
        expect(job.title).to eq("Updated Job")
        expect(response).to redirect_to(admin_job_path(job))
        expect(flash[:notice]).to eq("Job updated successfully.")
      end
    end

    context "with invalid parameters" do
      it "does not update the Job" do
        patch admin_job_path(job), params: {job: {title: ""}}
        job.reload
        expect(job.title).to_not eq("")
        expect(response).to have_http_status(:unprocessable_content)
      end
    end
  end

  describe "DELETE /destroy" do
    let!(:job) { create(:job, :open, :with_supplier) }
    it "destroys the Job" do
      expect do
        delete admin_job_path(job)
      end.to change(Job, :count).by(-1)
      expect(response).to redirect_to(admin_jobs_path)
      expect(flash[:notice]).to eq("Job deleted successfully.")
    end
  end
end
