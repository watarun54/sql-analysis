class CreateTables < ActiveRecord::Migration[6.0]
  def change
    create_table :tables do |t|
      t.string :name
      t.integer :select_count, default: 0
      t.integer :insert_count, default: 0
      t.integer :update_count, default: 0
      t.integer :delete_count, default: 0

      t.timestamps
    end
  end
end
