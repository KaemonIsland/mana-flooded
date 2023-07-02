class Legality < ApplicationRecord
  validates :uuid, presence: true, uniqueness: true
end
