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

ActiveRecord::Schema[7.0].define(version: 2023_07_02_223609) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

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

end
