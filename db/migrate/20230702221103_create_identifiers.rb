class CreateIdentifiers < ActiveRecord::Migration[7.0]
  def change
    create_table :identifiers do |t|
      t.string :cardKingdomEtchedId
      t.string :cardKingdomFoilId
      t.string :cardKingdomId
      t.string :cardsphereId
      t.string :mcmId
      t.string :mcmMetaId
      t.string :mtgArenaId
      t.string :mtgjsonFoilVersionId
      t.string :mtgjsonNonFoilVersionId
      t.string :mtgjsonV4Id
      t.string :mtgoFoilId
      t.string :mtgoId
      t.string :multiverseId
      t.string :scryfallId
      t.string :scryfallIllustrationId
      t.string :scryfallOracleId
      t.string :tcgplayerEtchedProductId
      t.string :tcgplayerProductId
      t.string :uuid

      t.timestamps
    end

    add_index :identifiers, :uuid, unique: true
  end
end
