require 'open-uri'
require 'zip'
require 'csv'
require 'openssl'


def get_card_files(file_names)
  # Fetch csv files in zip format from mtgjson
  content = URI.open('https://www.mtgjson.com/api/v5/AllPrintingsCSVFiles.zip')

  # Clean up files!
  file_names.each do |file|
    File.delete(file) if File.exist? (file)
  end

  # Opens zip files and adds required files to root directory
  Zip::File.open_buffer(content) do |zip|
    zip.each do |entry|
      if file_names.include? entry.name
        puts "Extracting #{entry.name}"
        # Adds file to root directory
        entry.extract
      end
    end
  end
end

def remove_file(file_name)
  # Clean up file!
  File.delete(file_name) if File.exist? (file_name)
end

# CSV includes: alchemy,brawl,commander,duel,explorer,future,gladiator,historic,historicbrawl,legacy,modern,oathbreaker,oldschool,pauper,paupercommander,penny,pioneer,predh,premodern,standard,uuid,vintage
# @see https://mtgjson.com/data-models/legalities/
def update_legalities
  csv_text = File.read('cardLegalities.csv')

  legalities = CSV.parse(csv_text, headers: true)

  legality_attrs = legalities.map do |legality|
    {
      uuid: legality["uuid"] || '',
      alchemy: legality["alchemy"] || '',
      brawl: legality["brawl"] || '',
      commander: legality["commander"] || '',
      duel: legality["duel"] || '',
      explorer: legality["explorer"] || '',
      future: legality["future"] || '',
      gladiator: legality["gladiator"] || '',
      historic: legality["historic"] || '',
      historicbrawl: legality["historicbrawl"] || '',
      legacy: legality["legacy"] || '',
      modern: legality["modern"] || '',
      oathbreaker: legality["oathbreaker"] || '',
      oldschool: legality["oldschool"] || '',
      pauper: legality["pauper"] || '',
      paupercommander: legality["paupercommander"] || '',
      penny: legality["penny"] || '',
      pioneer: legality["pioneer"] || '',
      predh: legality["predh"] || '',
      premodern: legality["premodern"] || '',
      standard: legality["standard"] || '',
      vintage: legality["vintage"] || ''
    }
  end

  Legality.upsert_all(legality_attrs, unique_by: [:uuid])
  
  puts "Legalities updated, removing file"
  remove_file('cardLegalities.csv')
end

# CSV includes: date,text,uuid
# @see https://mtgjson.com/data-models/rulings/
def update_rulings
  csv_text = File.read('cardRulings.csv')

  rulings = CSV.parse(csv_text, headers: true)

  ruling_attrs = rulings.map.with_index do |ruling, index|
    {
      index: index,
      date: ruling["date"] || '',
      text: ruling["text"] || '',
      uuid: ruling["uuid"] || '',
    }
  end

  Ruling.upsert_all(ruling_attrs, unique_by: [:index])

  puts "Rulings updated, removing file"
  remove_file('cardRulings.csv')
end

# CSV includes: cardKingdomEtchedId,cardKingdomFoilId,cardKingdomId,cardsphereId,mcmId,mcmMetaId,mtgArenaId,mtgjsonFoilVersionId,mtgjsonNonFoilVersionId,mtgjsonV4Id,mtgoFoilId,mtgoId,multiverseId,scryfallId,scryfallIllustrationId,scryfallOracleId,tcgplayerEtchedProductId,tcgplayerProductId,uuid
# @see https://mtgjson.com/data-models/identifiers/
def update_identifiers
  csv_text = File.read('cardIdentifiers.csv')

  identifiers = CSV.parse(csv_text, headers: true)

  identifier_attrs = identifiers.map do |identifier|
    {
      card_kingdom_etched_id: identifier["cardKingdomEtchedId"] || '',
      card_kingdom_foil_id: identifier["cardKingdomFoilId"] || '',
      card_kingdom_id: identifier["cardKingdomId"] || '',
      cardsphere_id: identifier["cardsphereId"] || '',
      mcm_id: identifier["mcmId"] || '',
      mcm_meta_id: identifier["mcmMetaId"] || '',
      mtg_arena_id: identifier["mtgArenaId"] || '',
      mtgjson_foil_version_id: identifier["mtgjsonFoilVersionId"] || '',
      mtgjson_non_foil_version_id: identifier["mtgjsonNonFoilVersionId"] || '',
      mtgjson_v4_id: identifier["mtgjsonV4Id"] || '',
      mtgo_foil_id: identifier["mtgoFoilId"] || '',
      mtgo_id: identifier["mtgoId"] || '',
      multiverse_id: identifier["multiverseId"] || '',
      scryfall_id: identifier["scryfallId"] || '',
      scryfall_illustration_id: identifier["scryfallIllustrationId"] || '',
      scryfall_oracle_id: identifier["scryfallOracleId"] || '',
      tcgplayer_etched_product_id: identifier["tcgplayerEtchedProductId"] || '',
      tcgplayer_product_id: identifier["tcgplayerProductId"] || '',
      uuid: identifier["uuid"] || '',
    }
  end

  Identifier.upsert_all(identifier_attrs, unique_by: [:uuid])

  puts "Identifiers updated, removing file"
  remove_file('cardIdentifiers.csv')
end

# CSV includes: cardFinish,currency,date,gameAvailability,price,priceProvider,providerListing,uuid
def update_prices
  csv_text = File.read('cardPrices.csv')

  prices = CSV.parse(csv_text, headers: true)

  price_attrs = prices.map.with_index do |price, index|
    {
      index: index,
      card_finish: price["cardFinish"] || '',
      currency: price["currency"] || '',
      date: price["date"] || '',
      price: price["price"] || '',
      price_provider: price["priceProvider"] || '',
      provider_listing: price["providerListing"] || '',
      game_availability: price["gameAvailability"] || '',
      uuid: price["uuid"] || '',
    }
  end

  Price.upsert_all(price_attrs, unique_by: [:index])

  puts "prices updated, removing file"
  remove_file('cardPrices.csv')
end

# CSV includes: cardKingdom,cardKingdomEtched,cardKingdomFoil,cardmarket,tcgplayer,tcgplayerEtched,uuid
# @see https://mtgjson.com/data-models/purchase-urls/
def update_purchase_urls
  csv_text = File.read('cardPurchaseUrls.csv')

  purchase_urls = CSV.parse(csv_text, headers: true)

  purchase_url_attrs = purchase_urls.map do |purchase_url|
    {
      card_kingdom: purchase_url["cardKingdom"] || '',
      card_kingdom_etched: purchase_url["cardKingdomEtched"] || '',
      card_kingdom_foil: purchase_url["cardKingdomFoil"] || '',
      cardmarket: purchase_url["cardmarket"] || '',
      tcgplayer: purchase_url["tcgplayer"] || '',
      tcgplayer_etched: purchase_url["tcgplayerEtched"] || '',
      uuid: purchase_url["uuid"] || '',
    }
  end

  PurchaseUrl.upsert_all(purchase_url_attrs, unique_by: [:uuid])

  puts "Purchase URLs updated, removing file"
  remove_file('cardPurchaseUrls.csv')
end

# CSV includes: baseSetSize,block,cardsphereSetId,code,decks,isFoilOnly,isForeignOnly,isNonFoilOnly,isOnlineOnly,isPartialPreview,keyruneCode,languages,mcmId,mcmIdExtras,mcmName,mtgoCode,name,parentCode,releaseDate,tcgplayerGroupId,tokenSetCode,totalSetSize,type
# @see https://mtgjson.com/data-models/set/
def update_card_sets
  csv_text = File.read('sets.csv')

  card_sets = CSV.parse(csv_text, headers: true)

  card_set_attrs = card_sets.map do |card_set|
    if card_set["isPartialPreview"] != '1'
      {
        base_set_size: card_set["baseSetSize"] || 0,
        block: card_set["block"] || '',
        code: card_set["code"] || '',
        is_foreign_only: card_set["isForeignOnly"] === '1' ? true : false,
        is_foil_only: card_set["isFoilOnly"] === '1' ? true : false,
        is_non_foil_only: card_set["isNonFoilOnly"] === '1' ? true : false,
        is_online_only: card_set["isOnlineOnly"] === '1' ? true : false,
        is_partial_preview: card_set["isPartialPreview"] === '1' ? true : false,
        keyrune_code: card_set["keyruneCode"] || '',
        mtgo_code: card_set["mtgoCode"] || '',
        name: card_set["name"] || '',
        parent_code: card_set["parentCode"] || '',
        release_date: card_set["releaseDate"] || '',
        tcgplayer_group_id: card_set["tcgplayerGroupId"] || 0,
        total_set_size: card_set["totalSetSize"] || 0,
        set_type: card_set["type"] || '',
      }
    end
  end

  CardSet.upsert_all(card_set_attrs.compact, unique_by: [:code])
end

# Checks available sets for partial preview codes and returns them
def get_partial_preview_set_codes
  csv_text = File.read('sets.csv')

  card_sets = CSV.parse(csv_text, headers: true)

  partialPreviewSets = []

  card_set_attrs = card_sets.map do |card_set|
    # Do not include partial preview sets
    if card_set["isPartialPreview"] == '1'
      partialPreviewSets << card_set["code"]
    end
  end

  partialPreviewSets
end

def update_cards
  csv_text = File.read('cards.csv')

  cards = CSV.parse(csv_text, headers: true)

  partialPreviewSets = get_partial_preview_set_codes()

  card_attrs = cards.map do |card|
    # Only update cards that do not belong to partial preview sets
    if !partialPreviewSets.include?(card["setCode"] || "")
      {
        artist: card["artist"] || '',
        border_color: card["borderColor"] || '',
        color_identity: (card["colorIdentity"] || '')&.split(', '),
        color_indicator: (card["colorIndicator"] || '')&.split(', '),
        colors: (card["colors"] || '')&.split(','),
        converted_mana_cost: card["convertedManaCost"] || 0,
        edhrec_rank: card["edhrecRank"] || 0,
        face_converted_mana_cost: card["faceConvertedManaCost"] || 0,
        flavor_text: card["flavorText"] || '',
        has_foil: card["hasFoil"] === '1' ? true : false,
        has_non_foil: card["hasNonFoil"] === '1' ? true : false,
        is_alternative: card["isAlternative"] === '1' ? true : false,
        is_full_art: card["isFullArt"] === '1' ? true : false,
        is_online_only: card["isOnlineOnly"] === '1' ? true : false,
        is_oversized: card["isOversized"] === '1' ? true : false,
        is_promo: card["isPromo"] === '1' ? true : false,
        is_reprint: card["isReprint"] === '1' ? true : false,
        is_reserved: card["isReserved"] === '1' ? true : false,
        is_starter: card["isStarter"] === '1' ? true : false,
        is_story_spotlight: card["isStorySpotlight"] === '1' ? true : false,
        is_textless: card["isTextless"] === '1' ? true : false,
        layout: card["layout"] || '',
        leadership_skills: card["leadershipSkills"] || '',
        loyalty: card["loyalty"] || '',
        mana_cost: card["manaCost"] || '',
        mcm_id: card["mcmId"] || 0,
        mcm_meta_id: card["mcmMetaId"] || 0,
        mtg_arena_id: card["mtgArenaId"] || 0,
        mtgo_foil_id: card["mtgoFoilId"] || 0,
        mtgo_id: card["mtgoId"] || 0,
        multiverse_id: card["multiverseId"] || 0,
        name: card["name"] || '',
        number: card["number"] || '',
        original_text: card["originalText"] || '',
        original_type: card["originalType"] || '',
        other_face_ids: (card["otherFaceIds"] || '')&.split(','),
        power: card["power"] || '',
        printings: card["printings"] || '',
        rarity: card["rarity"] || '',
        scryfall_id: card["scryfallId"] || '',
        scryfall_oracle_id: card["scryfallOracleId"] || '',
        scryfall_illustration_id: card["scryfallIllustrationId"] || '',
        side: card["side"] || '',
        subtypes: (card["subtypes"] || '')&.split(','),
        supertypes: (card["supertypes"] || '')&.split(','),
        tcgplayer_product_id: card["tcgplayerProductId"] || 0,
        text: card["text"] || '',
        toughness: card["toughness"] || '',
        card_type: card["type"] || '',
        card_types: (card["types"] || '')&.split(','),
        uuid: card["uuid"] || '',
        variations: (card["variations"] || '')&.split(','),
        watermark: card["watermark"] || '',
        ascii_name: card["asciiName"] || '',
        flavor_name: card["flavorName"] || '',
        availability: (card["availability"] || '')&.split(','),
        frame_effects: (card["frameEffects"] || '')&.split(','),
        keywords: (card["keywords"] || '')&.split(','),
        promo_types: (card["promoTypes"] || '')&.split(','),
        purchase_urls: card["purchaseUrls"] || '',
        card_kingdom_foil_id: card["cardKingdomFoilId"] || '',
        card_kingdom_id: card["cardKingdomId"] || '',
        duel_deck: card["duelDeck"] || '',
        face_name: card["faceName"] || '',
        frame_version: card["frameVersion"] || '',
        hand: card["hand"] || '',
        has_alternative_deck_limit: card["hasAlternativeDeckLimit"] || '' === '1' ? true : false,
        has_content_warning: card["hasContentWarning"] || '' === '1' ? true : false,
        is_timeshifted: card["isTimeshifted"] || '' === '1' ? true : false,
        life: card["life"] || '',
        set_code: card["setCode"] || '',
        original_release_date: card["originalReleaseDate"] || '',
      }
    end
  end

  # Remove nil insances from card_attrs
  card_attrs_filtered = card_attrs.select{ |c| c }

  Card.upsert_all(card_attrs_filtered, unique_by: [:uuid])
end

# I've had soooooo many problems linking cards to card sets.
# This time I think it'll work if we just clear out all cards, then re add them to the set.
def connect_cards_to_sets
  CardSet.all.each { |card_set|
    card_set.cards = []

    set_code = card_set.code

    cards = Card.where(set_code: set_code)

    card_set.cards << cards
  }
end

def list_preview_cards
  csv_text = File.read('cards.csv')

  cards = CSV.parse(csv_text, headers: true)

  latest_cards_uuid = cards.map{ |card| card["uuid"] }

  db_cards_uuid = Card.all.map(&:uuid)

  puts "Listing preview card uuids"
  preview_cards = db_cards_uuid - latest_cards_uuid

  if preview_cards.empty?
    puts "The DB is in sync with the current card list!"
  else
    puts preview_cards
  end
end

namespace :cards do
  desc "Updates all card info for the app"
  task update: :environment do
    puts "Fetching CSV files from MTGJSON"
    get_card_files(['cardLegalities.csv', 'cardRulings.csv', 'cardIdentifiers.csv', 'cardPrices.csv', 'cardPurchaseUrls.csv', 'sets.csv'])

    puts "Updating Legalities"
    update_legalities()

    puts "Updating Rulings"
    update_rulings()

    puts "Updating Identifiers"
    update_identifiers()

    puts "Updating Prices"
    update_prices()

    puts "Updating Purchase Urls"
    update_purchase_urls()

    # puts "Updating Card Sets"
    # update_card_sets()

    # puts "Updating Cards"
    # update_cards()

    # puts "Connecting Cards to Card Sets"
    # connect_cards_to_sets()
  end

  desc "Updates all card info for the app"
  task list_preview: :environment do
    puts "Fetching CSV files from MTGJSON"
    get_card_files(['cards.csv'])

    puts "Locating preview cards in DB"
    list_preview_cards()

    puts "Removing files"
    remove_files(['cards.csv'])
  end

  desc "Get's price of list of cards"
  task :price, [:cards] => :environment do |t, args|
    cards = args[:cards] || []
    public = Rails.application.credentials.tcg[:public]
    private = Rails.application.credentials.tcg[:private]

    access_token = HTTParty.post("https://api.tcgplayer.com/token?grant_type=client_credentials&client_id=#{public}&client_secret=#{private}")

    puts access_token.body

    puts "Getting card prices!"
  end
end
