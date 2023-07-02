class CreateIdentifiers < ActiveRecord::Migration[7.0]
  def change
    create_table :identifiers do |t|
      t.string :card_kingdom_etched_id
      t.string :card_kingdom_foil_id
      t.string :card_kingdom_id
      t.string :cardsphere_id
      t.string :mcm_id
      t.string :mcm_meta_id
      t.string :mtg_arena_id
      t.string :mtgjson_foil_version_id
      t.string :mtgjson_non_foil_version_id
      t.string :mtgjson_v4_id
      t.string :mtgo_foil_id
      t.string :mtgo_id
      t.string :multiverse_id
      t.string :scryfall_id
      t.string :scryfall_illustration_id
      t.string :scryfall_oracle_id
      t.string :tcgplayer_etched_product_id
      t.string :tcgplayer_product_id
      t.string :uuid

      t.timestamps
    end

    add_index :identifiers, :uuid, unique: true
  end
end
