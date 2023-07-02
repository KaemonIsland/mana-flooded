class CreateCardSets < ActiveRecord::Migration[7.0]
  def change
    create_table :card_sets do |t|
      t.integer :base_set_size
      t.string :block
      t.integer :cardsphere_set_id
      t.string :code
      t.boolean :is_foreign_only
      t.boolean :is_foil_only
      t.boolean :is_non_foil_only
      t.boolean :is_online_only
      t.boolean :is_partial_preview
      t.string :keyrune_code
      t.integer :mcm_id
      t.integer :mcm_id_extras
      t.string :mcm_name
      t.string :mtgo_code
      t.string :name
      t.string :parent_code
      t.date :release_date
      t.integer :tcgplayer_group_id
      t.integer :total_set_size
      t.string :set_type

      t.timestamps
    end

    add_index :card_sets, :code, unique: true
  end
end
