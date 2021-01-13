class JoinedTable < ApplicationRecord
  has_many :joined_tables, class_name: 'Table', :foreign_key => 'main_table_id'
end
