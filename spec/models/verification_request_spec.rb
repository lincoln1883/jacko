# frozen_string_literal: true

require "rails_helper"

RSpec.describe VerificationRequest, type: :model do
  subject { build(:verification_request) }

  describe "associations" do
    it { is_expected.to belong_to(:supplier).class_name("User").with_foreign_key("supplier_id") }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:supplier_id) }
    it { is_expected.to validate_uniqueness_of(:supplier_id).with_message("already has a pending or approved verification request") }
    it { is_expected.to validate_presence_of(:status) }
    it { is_expected.to validate_presence_of(:notes) }
    it { is_expected.to validate_length_of(:notes).is_at_most(1000) }

    context "document validations" do
      let(:supplier) { create(:user, :supplier) }

      it "is valid with attached documents within limits" do
        request = build(:verification_request, supplier: supplier)
        expect(request).to be_valid
      end

      it "is invalid without attached documents" do
        request = build(:verification_request, supplier: supplier)
        request.documents.purge
        expect(request).to_not be_valid
        expect(request.errors[:documents]).to include("must be attached")
      end

      it "is invalid with too many documents" do
        request = build(:verification_request, supplier: supplier)
        6.times do
          request.documents.attach(io: File.open(Rails.root.join("spec", "fixtures", "files", "test_document.pdf")), filename: "another.pdf", content_type: "application/pdf")
        end
        expect(request).to_not be_valid
        expect(request.errors[:documents]).to include("can't upload more than 5 files")
      end

      it "is invalid with documents exceeding file size limit" do
        # Create a dummy file larger than 5MB
        large_file_path = Rails.root.join("spec", "fixtures", "files", "large_test_document.pdf")
        File.open(large_file_path, "wb") { |f| f.write("a" * (6 * 1024 * 1024)) } # 6MB file

        request = build(:verification_request, supplier: supplier)
        request.documents.attach(io: File.open(large_file_path), filename: "large_doc.pdf", content_type: "application/pdf")
        expect(request).to_not be_valid
        expect(request.errors[:documents]).to include(/size cannot exceed 5MB/)

        File.delete(large_file_path) if File.exist?(large_file_path)
      end

      it "is invalid with documents of unsupported file types" do
        # Create a dummy unsupported file type
        unsupported_file_path = Rails.root.join("spec", "fixtures", "files", "unsupported.txt")
        File.open(unsupported_file_path, "w") { |f| f.write("unsupported content") }

        request = build(:verification_request, supplier: supplier)
        request.documents.attach(io: File.open(unsupported_file_path), filename: "unsupported.txt", content_type: "text/plain")
        expect(request).to_not be_valid
        expect(request.errors[:documents]).to include(/must be a PDF, JPEG, or PNG/)

        File.delete(unsupported_file_path) if File.exist?(unsupported_file_path)
      end
    end
  end

  describe "enums" do
    it { is_expected.to define_enum_for(:status).with_values(pending: 0, approved: 1, rejected: 2).backed_by_column_of_type(:integer) }
  end

  describe "#document_urls" do
    let(:verification_request) { create(:verification_request) }

    it "returns an array of document URLs when documents are attached" do
      expect(verification_request.document_urls).to be_an(Array)
      expect(verification_request.document_urls.first).to include("/rails/active_storage/blobs/redirect/")
    end

    it "returns an empty array when no documents are attached" do
      verification_request.documents.purge
      expect(verification_request.document_urls).to eq([])
    end
  end
end
