class Identifier < ApplicationRecord
  validates :uuid, presence: true, uniqueness: true
end
