class CreateJoinedTables < ActiveRecord::Migration[6.0]
  def change
    create_table :joined_tables do |t|
      t.integer :main_table_id
      t.integer :joined_table_id
      t.integer :count, default: 0

      t.timestamps
    end
  end
end
