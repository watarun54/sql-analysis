class CreateColumns < ActiveRecord::Migration[6.0]
  def change
    create_table :columns do |t|
      t.string :name
      t.integer :access_num, default: 0
      t.references :table, null: false, foreign_key: true

      t.timestamps
    end
  end
end
