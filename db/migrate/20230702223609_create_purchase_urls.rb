class CreatePurchaseUrls < ActiveRecord::Migration[7.0]
  def change
    create_table :purchase_urls do |t|
       t.string :card_kingdom
       t.string :card_kingdom_etched
       t.string :card_kingdom_foil
       t.string :cardmarket
       t.string :tcgplayer
       t.string :tcgplayer_etched
       t.string :uuid

      t.timestamps
    end

    add_index :purchase_urls, :uuid, unique: true
  end
end
