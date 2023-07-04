class CreateCards < ActiveRecord::Migration[7.0]
  def change
    create_table :cards do |t|
      t.string :artist
      t.string :artist_ids, array: true, default: []
      t.string :ascii_name
      t.string :atraction_lights, array: true, default: []
      t.string :availability, array: true, default: []
      t.string :booster_types, array: true, default: []
      t.string :border_color
      t.string :card_parts, array: true, default: []
      t.string :color_identity, array: true, default: []
      t.string :color_indicator, array: true, default: []
      t.string :colors, array: true, default: []
      t.string :defense
      t.string :duel_deck
      t.integer :edhrec_rank
      t.float :edhrec_saltiness
      t.integer :face_converted_mana_cost
      t.string :face_flavor_name
      t.integer :face_mana_value
      t.string :face_name
      t.string :finishes, array: true, default: []
      t.string :flavor_name
      t.string :flavor_text
      t.string :frame_effects, array: true, default: []
      t.string :frame_version
      t.string :hand
      t.boolean :has_alternative_deck_limit
      t.boolean :has_content_warning
      t.boolean :has_foil
      t.boolean :has_non_foil
      t.boolean :is_alternative
      t.boolean :is_full_art
      t.boolean :is_funny
      t.boolean :is_online_only
      t.boolean :is_oversized
      t.boolean :is_promo
      t.boolean :is_rebalanced
      t.boolean :is_reprint
      t.boolean :is_reserved
      t.boolean :is_starter
      t.boolean :is_story_spotlight
      t.boolean :is_textless
      t.boolean :is_timeshifted
      t.string :keywords, array: true, default: []
      t.string :language
      t.string :layout
      t.string :leadership_skills
      t.string :life
      t.string :loyalty
      t.string :mana_cost
      t.string :mana_value
      t.string :name
      t.string :number
      t.string :original_printings, array: true, default: []
      t.string :original_release_date
      t.string :original_text
      t.string :original_type
      t.string :other_face_ids, array: true, default: []
      t.string :power
      t.string :printings, array: true, default: []
      t.string :promo_types, array: true, default: []
      t.string :rarity
      t.string :rebalanced_printings, array: true, default: []
      t.string :related_cards
      t.string :security_stamp
      t.string :set_code
      t.string :side
      t.string :signature
      t.string :subsets, array: true, default: []
      t.string :subtypes, array: true, default: []
      t.string :supertypes, array: true, default: []
      t.string :text
      t.string :toughness
      t.string :card_type
      t.string :types, array: true, default: []
      t.string :uuid
      t.string :variations, array: true, default: []
      t.string :watermark

      t.belongs_to :card_set, foreign_key: true
    end

    add_index :cards, :uuid, unique: true
  end
end
