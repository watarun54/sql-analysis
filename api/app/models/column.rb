class Column < ApplicationRecord
  belongs_to :table

  validates :name, presence: true
  validates :table_id, presence: true

end
