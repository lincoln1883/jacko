# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Jobs", type: :request do
  let(:client_user) { create(:user, :client) }
  let(:supplier_user) { create(:user, :supplier) }
  let(:parish) { create(:parish) }

  describe "GET /index" do
    context "when user is authenticated as client" do
      before { sign_in client_user }
      it "returns http success" do
        create_list(:job, 3, :open, client: client_user) # Ensure jobs are open for client view
        get jobs_path
        expect(response).to have_http_status(:success)
      end
    end

    context "when user is not authenticated" do
      it "returns http success" do
        create_list(:job, 3, :open) # Ensure jobs are open for public view
        get jobs_path
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "GET /show" do
    let!(:job) { create(:job, :open) } # Ensure job is open for public view
    context "when user is authenticated" do
      before { sign_in client_user }
      it "returns http success" do
        get job_path(job)
        expect(response).to have_http_status(:success)
      end
    end

    context "when user is not authenticated" do
      it "returns http success" do
        get job_path(job)
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe "GET /new" do
    context "when authenticated as client" do
      before { sign_in client_user }
      it "returns http success" do
        get new_job_path
        expect(response).to have_http_status(:success)
      end
    end

    context "when not authenticated" do
      it "redirects to sign in" do
        get new_job_path
        expect(response).to redirect_to(sign_in_path)
      end
    end

    context "when authenticated as non-client" do
      before { sign_in supplier_user }
      it "redirects to root with alert" do
        get new_job_path
        expect(response).to redirect_to(root_path)
        expect(flash[:alert]).to eq("Access denied. Only clients can post and manage jobs.")
      end
    end
  end

  describe "POST /create" do
    context "when authenticated as client" do
      before { sign_in client_user }
      context "with valid parameters" do
        it "creates a new Job" do
          expect do
            post jobs_path, params: {job: {title: "New Job", description: "Job description", budget: 1000, due_date: 1.week.from_now, location: "Location", parish_id: parish.id, status: "open"}}
          end.to change(Job, :count).by(1)
          expect(response).to redirect_to(job_path(Job.last))
          expect(flash[:notice]).to eq("Job posted successfully!")
        end
      end

      context "with invalid parameters" do
        it "does not create a Job" do
          expect do
            post jobs_path, params: {job: {title: "", description: "", budget: nil}}
          end.to_not change(Job, :count)
          expect(response).to have_http_status(:unprocessable_content)
        end
      end
    end

    context "when not authenticated" do
      it "redirects to sign in" do
        post jobs_path, params: {job: {title: "New Job", description: "Job description", budget: 1000, due_date: 1.week.from_now, location: "Location", parish_id: parish.id, status: "open"}}
        expect(response).to redirect_to(sign_in_path)
      end
    end

    context "when authenticated as non-client" do
      before { sign_in supplier_user }
      it "redirects to root with alert" do
        post jobs_path, params: {job: {title: "New Job", description: "Job description", budget: 1000, due_date: 1.week.from_now, location: "Location", parish_id: parish.id, status: "open"}}
        expect(response).to redirect_to(root_path)
        expect(flash[:alert]).to eq("Access denied. Only clients can post and manage jobs.")
      end
    end
  end

  describe "GET /edit" do
    let!(:job) { create(:job, :open, client: client_user) }

    context "when authenticated as client" do
      before { sign_in client_user }
      it "returns http success" do
        get edit_job_path(job)
        expect(response).to have_http_status(:success)
      end
    end

    context "when not authenticated" do
      it "redirects to sign in" do
        get edit_job_path(job)
        expect(response).to redirect_to(sign_in_path)
      end
    end

    context "when authenticated as non-client" do
      before { sign_in supplier_user }
      it "redirects to root with alert" do
        get edit_job_path(job)
        expect(response).to redirect_to(root_path)
        expect(flash[:alert]).to eq("Access denied. Only clients can post and manage jobs.")
      end
    end
  end

  describe "PATCH /update" do
    let!(:job) { create(:job, :open, client: client_user) }

    context "when authenticated as client" do
      before { sign_in client_user }
      context "with valid parameters" do
        it "updates the Job" do
          patch job_path(job), params: {job: {title: "Updated Job"}}
          job.reload
          expect(job.title).to eq("Updated Job")
          expect(response).to redirect_to(job_path(job))
          expect(flash[:notice]).to eq("Job updated successfully!")
        end
      end

      context "with invalid parameters" do
        it "does not update the Job" do
          patch job_path(job), params: {job: {title: ""}}
          job.reload
          expect(job.title).to_not eq("")
          expect(response).to have_http_status(:unprocessable_content)
        end
      end
    end

    context "when not authenticated" do
      it "redirects to sign in" do
        patch job_path(job), params: {job: {title: "Updated Job"}}
        expect(response).to redirect_to(sign_in_path)
      end
    end

    context "when authenticated as non-client" do
      before { sign_in supplier_user }
      it "redirects to root with alert" do
        patch job_path(job), params: {job: {title: "Updated Job"}}
        expect(response).to redirect_to(root_path)
        expect(flash[:alert]).to eq("Access denied. Only clients can post and manage jobs.")
      end
    end
  end

  describe "DELETE /destroy" do
    let!(:job) { create(:job, :open, client: client_user) }

    context "when authenticated as client" do
      before { sign_in client_user }
      it "destroys the Job" do
        expect do
          delete job_path(job)
        end.to change(Job, :count).by(-1)
        expect(response).to redirect_to(jobs_path)
        expect(flash[:notice]).to eq("Job deleted successfully!")
      end
    end

    context "when not authenticated" do
      it "redirects to sign in" do
        delete job_path(job)
        expect(response).to redirect_to(sign_in_path)
      end
    end

    context "when authenticated as non-client" do
      before { sign_in supplier_user }
      it "redirects to root with alert" do
        delete job_path(job)
        expect(response).to redirect_to(root_path)
        expect(flash[:alert]).to eq("Access denied. Only clients can post and manage jobs.")
      end
    end
  end
end
