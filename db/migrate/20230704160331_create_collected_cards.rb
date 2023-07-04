class CreateCollectedCards < ActiveRecord::Migration[7.0]
  def change
    create_table :collected_cards do |t|
      t.belongs_to :collection
      t.belongs_to :card
      t.integer :quantity
      t.integer :foil

      t.timestamps
    end
  end
end
