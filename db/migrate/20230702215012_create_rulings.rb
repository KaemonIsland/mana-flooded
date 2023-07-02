class CreateRulings < ActiveRecord::Migration[7.0]
  def change
    create_table :rulings do |t|
      t.integer :index
      t.string :uuid
      t.string :text
      t.date :date

      t.timestamps
    end

    add_index :rulings, :index, unique: true
  end
end
