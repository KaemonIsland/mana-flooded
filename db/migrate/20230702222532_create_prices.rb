class CreatePrices < ActiveRecord::Migration[7.0]
  def change
    create_table :prices do |t|
      t.integer :index
      t.string :uuid
      t.string :card_finish
      t.string :currency
      t.date :date
      t.string :game_availability
      t.float :price
      t.string :price_provider
      t.string :provider_listing

      t.timestamps
    end

    add_index :prices, :index, unique: true
  end
end
