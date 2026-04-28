import { CardPrices } from '../interface/Card'

export const formatPriceProvider = (provider?: string): string => {
  if (!provider) {
    return 'Unknown'
  }

  return provider
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export const getDisplayPrices = (
  prices: CardPrices = {},
  preferredProvider?: string,
): CardPrices => {
  if (!preferredProvider || !prices.providers) {
    return prices
  }

  return prices.providers[preferredProvider] || prices
}

export const getPriceSourceNote = (prices: CardPrices = {}): string => {
  const providerLabel = formatPriceProvider(prices.provider)
  const listingLabel = prices.providerListing ? ` ${prices.providerListing}` : ''
  const dateLabel = prices.date ? ` ${prices.date}` : ''

  return `${providerLabel}${listingLabel}${dateLabel}`.trim()
}