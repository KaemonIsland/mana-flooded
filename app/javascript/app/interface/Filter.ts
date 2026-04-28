interface RangeFilter {
  min: number
  max: number
}

interface PriceRangeFilter {
  min: number | null
  max: number | null
}

export interface Filter {
  color: Array<string>
  rarity: Array<string>
  type: string | null
  manaValue: RangeFilter
  price: PriceRangeFilter
  sort: string
}
