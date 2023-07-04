# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_07_04_160331) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "card_set_cards", force: :cascade do |t|
    t.bigint "card_id"
    t.bigint "card_set_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["card_id"], name: "index_card_set_cards_on_card_id"
    t.index ["card_set_id"], name: "index_card_set_cards_on_card_set_id"
  end

  create_table "card_sets", force: :cascade do |t|
    t.integer "base_set_size"
    t.string "block"
    t.integer "cardsphere_set_id"
    t.string "code"
    t.boolean "is_foreign_only"
    t.boolean "is_foil_only"
    t.boolean "is_non_foil_only"
    t.boolean "is_online_only"
    t.boolean "is_partial_preview"
    t.string "keyrune_code"
    t.integer "mcm_id"
    t.integer "mcm_id_extras"
    t.string "mcm_name"
    t.string "mtgo_code"
    t.string "name"
    t.string "parent_code"
    t.date "release_date"
    t.integer "tcgplayer_group_id"
    t.integer "total_set_size"
    t.string "set_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_card_sets_on_code", unique: true
  end

  create_table "cards", force: :cascade do |t|
    t.string "artist"
    t.string "artist_ids", default: [], array: true
    t.string "ascii_name"
    t.string "atraction_lights", default: [], array: true
    t.string "availability", default: [], array: true
    t.string "booster_types", default: [], array: true
    t.string "border_color"
    t.string "card_parts", default: [], array: true
    t.string "color_identity", default: [], array: true
    t.string "color_indicator", default: [], array: true
    t.string "colors", default: [], array: true
    t.string "defense"
    t.string "duel_deck"
    t.integer "edhrec_rank"
    t.float "edhrec_saltiness"
    t.integer "face_converted_mana_cost"
    t.string "face_flavor_name"
    t.integer "face_mana_value"
    t.string "face_name"
    t.string "finishes", default: [], array: true
    t.string "flavor_name"
    t.string "flavor_text"
    t.string "frame_effects", default: [], array: true
    t.string "frame_version"
    t.string "hand"
    t.boolean "has_alternative_deck_limit"
    t.boolean "has_content_warning"
    t.boolean "has_foil"
    t.boolean "has_non_foil"
    t.boolean "is_alternative"
    t.boolean "is_full_art"
    t.boolean "is_funny"
    t.boolean "is_online_only"
    t.boolean "is_oversized"
    t.boolean "is_promo"
    t.boolean "is_rebalanced"
    t.boolean "is_reprint"
    t.boolean "is_reserved"
    t.boolean "is_starter"
    t.boolean "is_story_spotlight"
    t.boolean "is_textless"
    t.boolean "is_timeshifted"
    t.string "keywords", default: [], array: true
    t.string "language"
    t.string "layout"
    t.string "leadership_skills"
    t.string "life"
    t.string "loyalty"
    t.string "mana_cost"
    t.string "mana_value"
    t.string "name"
    t.string "number"
    t.string "original_printings", default: [], array: true
    t.string "original_release_date"
    t.string "original_text"
    t.string "original_type"
    t.string "other_face_ids", default: [], array: true
    t.string "power"
    t.string "printings", default: [], array: true
    t.string "promo_types", default: [], array: true
    t.string "rarity"
    t.string "rebalanced_printings", default: [], array: true
    t.string "related_cards"
    t.string "security_stamp"
    t.string "set_code"
    t.string "side"
    t.string "signature"
    t.string "subsets", default: [], array: true
    t.string "subtypes", default: [], array: true
    t.string "supertypes", default: [], array: true
    t.string "text"
    t.string "toughness"
    t.string "card_type"
    t.string "types", default: [], array: true
    t.string "uuid"
    t.string "variations", default: [], array: true
    t.string "watermark"
    t.bigint "card_set_id"
    t.index ["card_set_id"], name: "index_cards_on_card_set_id"
    t.index ["uuid"], name: "index_cards_on_uuid", unique: true
  end

  create_table "collected_cards", force: :cascade do |t|
    t.bigint "collection_id"
    t.bigint "card_id"
    t.integer "quantity"
    t.integer "foil"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["card_id"], name: "index_collected_cards_on_card_id"
    t.index ["collection_id"], name: "index_collected_cards_on_collection_id"
  end

  create_table "collections", force: :cascade do |t|
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_collections_on_user_id"
  end

  create_table "identifiers", force: :cascade do |t|
    t.string "card_kingdom_etched_id"
    t.string "card_kingdom_foil_id"
    t.string "card_kingdom_id"
    t.string "cardsphere_id"
    t.string "mcm_id"
    t.string "mcm_meta_id"
    t.string "mtg_arena_id"
    t.string "mtgjson_foil_version_id"
    t.string "mtgjson_non_foil_version_id"
    t.string "mtgjson_v4_id"
    t.string "mtgo_foil_id"
    t.string "mtgo_id"
    t.string "multiverse_id"
    t.string "scryfall_id"
    t.string "scryfall_illustration_id"
    t.string "scryfall_oracle_id"
    t.string "tcgplayer_etched_product_id"
    t.string "tcgplayer_product_id"
    t.string "uuid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uuid"], name: "index_identifiers_on_uuid", unique: true
  end

  create_table "legalities", force: :cascade do |t|
    t.string "uuid", null: false
    t.string "alchemy"
    t.string "brawl"
    t.string "commander"
    t.string "duel"
    t.string "explorer"
    t.string "future"
    t.string "gladiator"
    t.string "historic"
    t.string "historicbrawl"
    t.string "legacy"
    t.string "modern"
    t.string "oathbreaker"
    t.string "oldschool"
    t.string "pauper"
    t.string "paupercommander"
    t.string "penny"
    t.string "pioneer"
    t.string "predh"
    t.string "premodern"
    t.string "standard"
    t.string "vintage"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uuid"], name: "index_legalities_on_uuid", unique: true
  end

  create_table "prices", force: :cascade do |t|
    t.integer "index"
    t.string "uuid"
    t.string "card_finish"
    t.string "currency"
    t.date "date"
    t.string "game_availability"
    t.float "price"
    t.string "price_provider"
    t.string "provider_listing"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["index"], name: "index_prices_on_index", unique: true
  end

  create_table "purchase_urls", force: :cascade do |t|
    t.string "card_kingdom"
    t.string "card_kingdom_etched"
    t.string "card_kingdom_foil"
    t.string "cardmarket"
    t.string "tcgplayer"
    t.string "tcgplayer_etched"
    t.string "uuid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uuid"], name: "index_purchase_urls_on_uuid", unique: true
  end

  create_table "rulings", force: :cascade do |t|
    t.integer "index"
    t.string "uuid"
    t.string "text"
    t.date "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["index"], name: "index_rulings_on_index", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "cards", "card_sets"
end
