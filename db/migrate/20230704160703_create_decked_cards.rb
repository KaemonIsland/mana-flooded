class CreateDeckedCards < ActiveRecord::Migration[7.0]
  def change
    create_table :decked_cards do |t|
      t.belongs_to :deck
      t.belongs_to :card
      t.integer :quantity
      t.integer :foil
      t.string :categories, array: true, default: []

      t.timestamps
    end
  end
end
