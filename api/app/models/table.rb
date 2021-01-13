class Table < ApplicationRecord
  has_many :columns, dependent: :delete_all
  has_many :joined_tables, class_name: 'JoinedTable', :foreign_key => 'main_table_id', dependent: :delete_all

  validates :name, presence: true
end
