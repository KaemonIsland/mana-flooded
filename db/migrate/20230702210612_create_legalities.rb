class CreateLegalities < ActiveRecord::Migration[7.0]
  def change
    create_table :legalities do |t|
      t.string :uuid, null: false
      t.string :alchemy
      t.string :brawl
      t.string :commander
      t.string :duel
      t.string :explorer
      t.string :future
      t.string :gladiator
      t.string :historic
      t.string :historicbrawl
      t.string :legacy
      t.string :modern
      t.string :oathbreaker
      t.string :oldschool
      t.string :pauper
      t.string :paupercommander
      t.string :penny
      t.string :pioneer
      t.string :predh
      t.string :premodern
      t.string :standard
      t.string :vintage

      t.timestamps
    end

    add_index :legalities, :uuid, unique: true
  end
end
