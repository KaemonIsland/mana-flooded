class PurchaseUrl < ApplicationRecord
  validates :uuid, presence: true, uniqueness: true
end
