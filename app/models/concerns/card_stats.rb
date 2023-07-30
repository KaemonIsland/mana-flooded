require 'active_support/concern'

module CardStats
  extend ActiveSupport::Concern

  included do
    def self.card_stats(cards)
      stats = {
        colors: { W: 0, U: 0, B: 0, R: 0, G: 0, C: 0, M: 0 },
        types: { 
          creature: { count: 0, subtypes: {} },
          enchantment: { count: 0, subtypes: {} },
          instant: { count: 0, subtypes: {} },
          land: { count: 0, subtypes: {} },
          sorcery: { count: 0, subtypes: {} },
          planeswalker: { count: 0, subtypes: {} },
          artifact: { count: 0, subtypes: {} },
        },
        cmc: { 1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0, 6 => 0 },
        counts: { creature: 0, nonCreature: 0, land: 0, nonLand: 0 },
        rarity: { common: 0, uncommon: 0, rare: 0, mythic: 0, special: 0, bonus: 0 },
        cards: 0,
      }

      # Iterates over every card and updates stats object
      cards.each do |card|
        next if card.is_promo || card.is_alternative

        # Increment total cards
        stats[:cards] += 1

        card_types = card.types
        types = stats[:types]
        card_subTypes = card.subtypes

        # Counts the card types and subTypes
        card_types.each do |type|
          lower_type = type.downcase().to_sym
          types[lower_type][:count] += 1 if types[lower_type]

          card_subTypes.each do |subtype|
            lower_subtype = subtype.downcase().to_sym
            if types[lower_type] && types[lower_type][:subtypes] && types[lower_type][:subtypes][lower_subtype]
              types[lower_type][:subtypes][lower_subtype] += 1
            elsif types[lower_type] && types[lower_type][:subtypes]
              types[lower_type][:subtypes][lower_subtype] = 1
            end
          end
        end

        # Counts multicolored cards and individual colors
        stats[:colors][:M] += 1 if card.color_identity.length > 1
        stats[:colors][:C] += 1 if card.color_identity.length.zero?
        card.color_identity.each { |color| stats[:colors][color.strip.to_sym] += 1 if color.to_sym }

        if card.card_type.include?('Basic Land')
          stats[:counts][:land] += 1
        else
          stats[:counts][:nonLand] += 1
          stats[:counts][:creature] += 1 if card_types.include?('Creature')
          stats[:counts][:nonCreature] += 1 unless card_types.include?('Creature')

          card_cmc = card.mana_value.to_i
          if card_cmc <= 1
            stats[:cmc][1] += 1
          elsif card_cmc >= 6
            stats[:cmc][6] += 1
          else
            stats[:cmc][card_cmc.to_i] += 1
          end

          stats[:rarity][card.rarity.to_sym] += 1
        end
      end

      stats
    end
  end
end
