import React, { ReactChild, ReactChildren, ReactElement, createContext, useContext, useState } from 'react'

interface PricePreferenceContextTypes {
  preferredPriceProvider: string
  availableProviders: Array<string>
  updatePreferredPriceProvider: (provider: string) => void
}

const PRICE_PROVIDER_STORAGE_KEY = 'mana-flood::preferred-price-provider'
const DEFAULT_PRICE_PROVIDER = 'tcgplayer'
const AVAILABLE_PRICE_PROVIDERS = [
  'tcgplayer',
  'cardkingdom',
  'cardmarket',
  'cardsphere',
  'cardhoarder',
  'manapool',
]

const getStoredPriceProvider = (): string => {
  const storedProvider = window.localStorage.getItem(PRICE_PROVIDER_STORAGE_KEY)
  return storedProvider || DEFAULT_PRICE_PROVIDER
}

const PricePreferenceContext = createContext<PricePreferenceContextTypes>({
  preferredPriceProvider: DEFAULT_PRICE_PROVIDER,
  availableProviders: AVAILABLE_PRICE_PROVIDERS,
  updatePreferredPriceProvider: () => null,
})

export const usePricePreference = (): PricePreferenceContextTypes => useContext(PricePreferenceContext)

interface PricePreferenceProviderProps {
  children: ReactChildren | ReactChild
}

export const PricePreferenceProvider = ({ children }: PricePreferenceProviderProps): ReactElement => {
  const [preferredPriceProvider, setPreferredPriceProvider] = useState(getStoredPriceProvider())

  const updatePreferredPriceProvider = (provider: string): void => {
    setPreferredPriceProvider(provider)
    window.localStorage.setItem(PRICE_PROVIDER_STORAGE_KEY, provider)
  }

  return (
    <PricePreferenceContext.Provider
      value={{
        preferredPriceProvider,
        availableProviders: AVAILABLE_PRICE_PROVIDERS,
        updatePreferredPriceProvider,
      }}
    >
      {children}
    </PricePreferenceContext.Provider>
  )
}