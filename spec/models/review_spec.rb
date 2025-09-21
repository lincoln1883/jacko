# frozen_string_literal: true

require "rails_helper"

RSpec.describe Review, type: :model do
  subject { build(:review) }

  describe "associations" do
    it { is_expected.to belong_to(:job) }
    it { is_expected.to belong_to(:reviewer).class_name("User").with_foreign_key("reviewer_id") }
    it { is_expected.to belong_to(:reviewee).class_name("User").with_foreign_key("reviewee_id") }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:rating) }
    it { is_expected.to validate_numericality_of(:rating).is_in(1..5) }
    it { is_expected.to validate_length_of(:comment).is_at_most(1000) }
    it { is_expected.to validate_presence_of(:job_id) }
    it { is_expected.to validate_presence_of(:reviewer_id) }
    it { is_expected.to validate_presence_of(:reviewee_id) }

    context "uniqueness validation" do
      let!(:existing_review) { create(:review, job: create(:job, :open), reviewer: create(:user, :client), reviewee: create(:user, :supplier)) }

      it "validates that a job can only be reviewed once by a reviewer for a reviewee" do
        duplicate_review = build(:review, job: existing_review.job, reviewer: existing_review.reviewer, reviewee: existing_review.reviewee)
        expect(duplicate_review).to_not be_valid
        expect(duplicate_review.errors[:job_id]).to include("can only be reviewed once by this user for this reviewee")
      end
    end
  end

  describe "scopes" do
    let!(:job) { create(:job, :open) }
    let!(:reviewer) { create(:user, :client) }
    let!(:reviewee) { create(:user, :supplier) }
    let!(:review1) { create(:review, job: job, reviewer: reviewer, reviewee: reviewee, rating: 5) }
    let!(:review2) { create(:review, job: create(:job, :open), reviewer: create(:user, :client), reviewee: reviewee, rating: 1) }

    describe ".by_job" do
      it "returns reviews for a specific job" do
        expect(Review.by_job(job.id)).to include(review1)
        expect(Review.by_job(job.id)).to_not include(review2)
      end
    end

    describe ".by_reviewer" do
      it "returns reviews by a specific reviewer" do
        expect(Review.by_reviewer(reviewer.id)).to include(review1)
        expect(Review.by_reviewer(reviewer.id)).to_not include(review2)
      end
    end

    describe ".by_reviewee" do
      it "returns reviews for a specific reviewee" do
        expect(Review.by_reviewee(reviewee.id)).to include(review1, review2)
        expect(Review.by_reviewee(create(:user).id)).to_not include(review1, review2)
      end
    end

    describe ".positive" do
      it "returns reviews with a rating of 4 or higher" do
        expect(Review.positive).to include(review1)
        expect(Review.positive).to_not include(review2)
      end
    end

    describe ".negative" do
      it "returns reviews with a rating of 2 or lower" do
        expect(Review.negative).to include(review2)
        expect(Review.negative).to_not include(review1)
      end
    end

    describe ".average_rating" do
      it "returns the average rating of all reviews" do
        # Create another review to ensure average calculation is correct
        create(:review, job: create(:job, :open), reviewer: create(:user, :client), reviewee: reviewee, rating: 3)
        # (5 + 1 + 3) / 3 = 3
        expect(Review.average_rating.to_f.round(2)).to eq(3.00)
      end
    end
  end
end
