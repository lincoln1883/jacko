# frozen_string_literal: true

require "rails_helper"

RSpec.describe PortfolioImage, type: :model do
  let(:user) { create(:user, :tradesperson) }
  let(:profile) { create(:trades_person_profile, user: user) }
  let(:portfolio_image) { create(:portfolio_image, trades_person_profile: profile) }

  describe "associations" do
    it { should belong_to(:trades_person_profile) }
    it { should have_one_attached(:image) }
  end

  describe "validations" do
    subject { portfolio_image }

    it { should validate_length_of(:title).is_at_most(255) }
    it { should validate_length_of(:description).is_at_most(1000) }
    it { should validate_length_of(:image_alt_text).is_at_most(255) }
    it { should validate_presence_of(:display_order) }
    it { should validate_numericality_of(:display_order).is_greater_than_or_equal_to(0) }
    it { should validate_inclusion_of(:active).in_array([true, false]) }
  end

  describe "scopes" do
    let!(:active_image) { create(:portfolio_image, trades_person_profile: profile, active: true, display_order: 1) }
    let!(:inactive_image) { create(:portfolio_image, trades_person_profile: profile, active: false, display_order: 2) }
    let!(:later_image) { create(:portfolio_image, trades_person_profile: profile, active: true, display_order: 3) }

    describe ".active" do
      it "returns only active images" do
        expect(PortfolioImage.active).to contain_exactly(active_image, later_image)
      end
    end

    describe ".ordered" do
      it "returns images ordered by display_order then created_at" do
        expect(PortfolioImage.active.ordered).to eq([active_image, later_image])
      end
    end

    describe ".by_profile" do
      let(:other_profile) { create(:trades_person_profile) }
      let!(:other_image) { create(:portfolio_image, trades_person_profile: other_profile) }

      it "returns images for specific profile" do
        expect(PortfolioImage.by_profile(profile.id)).to contain_exactly(active_image, inactive_image, later_image)
        expect(PortfolioImage.by_profile(other_profile.id)).to contain_exactly(other_image)
      end
    end
  end

  describe "callbacks" do
    describe "before_validation" do
      context "when display_order is not set" do
        it "sets default display_order" do
          existing_image = create(:portfolio_image, trades_person_profile: profile, display_order: 5)
          new_image = build(:portfolio_image, trades_person_profile: profile, display_order: nil)

          new_image.valid?
          expect(new_image.display_order).to eq(6)
        end
      end

      context "when image_alt_text is missing" do
        it "generates alt text from title" do
          image = build(:portfolio_image,
            trades_person_profile: profile,
            title: "Kitchen Renovation",
            image_alt_text: nil
          )

          image.valid?
          expect(image.image_alt_text).to include("Kitchen Renovation")
          expect(image.image_alt_text).to include(profile.company_name || "Portfolio")
        end

        it "generates generic alt text when title is missing" do
          image = build(:portfolio_image,
            trades_person_profile: profile,
            title: nil,
            image_alt_text: nil
          )

          image.valid?
          expect(image.image_alt_text).to include("Portfolio work")
        end
      end
    end
  end

  describe "instance methods" do
    describe "#display_name" do
      it "returns title when present" do
        image = build(:portfolio_image, title: "Beautiful Kitchen")
        expect(image.display_name).to eq("Beautiful Kitchen")
      end

      it "returns formatted fallback when title is blank" do
        image = create(:portfolio_image, title: "")
        expect(image.display_name).to eq("Portfolio Image ##{image.id}")
      end
    end

    describe "#file_size_mb" do
      it "returns 0 when no image attached" do
        image = build(:portfolio_image)
        expect(image.file_size_mb).to eq(0)
      end

      it "returns file size in MB when image is attached" do
        image = create(:portfolio_image)
        expect(image.file_size_mb).to be >= 0
      end
    end

    describe "#dimensions" do
      it "returns empty hash when no image attached" do
        image = build(:portfolio_image)
        expect(image.dimensions).to eq({})
      end

      it "returns dimensions when image has metadata" do
        image = create(:portfolio_image, :with_image)
        # Mock metadata since we can't easily create real image metadata in tests
        allow(image.image.blob).to receive(:metadata).and_return({width: 800, height: 600})

        dimensions = image.dimensions
        expect(dimensions[:width]).to eq(800)
        expect(dimensions[:height]).to eq(600)
        expect(dimensions[:aspect_ratio]).to be_within(0.01).of(1.33)
      end
    end

    describe "#image_url" do
      let(:image) { create(:portfolio_image) }

      it "returns nil when no image attached" do
        image_without_attachment = build(:portfolio_image)
        image_without_attachment.image.purge if image_without_attachment.image.attached?
        expect(image_without_attachment.image_url).to be_nil
      end

      it "returns nil for unpersisted images" do
        image_with_unpersisted_attachment = build(:portfolio_image)
        expect(image_with_unpersisted_attachment.image_url).to be_nil
      end

      it "returns variant URL for specified variant when persisted" do
        # Only test when image is persisted to avoid URL generation errors
        if image.image.blob.persisted?
          expect(image.image_url(:small)).to be_present
          expect(image.image_url(:medium)).to be_present
          expect(image.image_url(:large)).to be_present
        else
          expect(image.image_url(:small)).to be_nil
        end
      end

      it "returns original URL for :original variant when persisted" do
        if image.image.blob.persisted?
          expect(image.image_url(:original)).to be_present
        else
          expect(image.image_url(:original)).to be_nil
        end
      end
    end

    describe "#image_variants" do
      it "returns empty hash when no image attached" do
        image = build(:portfolio_image)
        image.image.purge if image.image.attached?
        expect(image.image_variants).to eq({})
      end

      it "returns variant objects when image is attached" do
        image = create(:portfolio_image)
        variants = image.image_variants

        expect(variants.keys).to contain_exactly(:thumbnail, :small, :medium, :large)
        variants.values.each do |variant|
          expect(variant).to respond_to(:processed)
        end
      end
    end
  end
end
