class CreateDecks < ActiveRecord::Migration[7.0]
  def change
    create_table :decks do |t|
      t.belongs_to :user
      t.string :name
      t.string :description
      t.string :format

      t.timestamps
    end
  end
end
