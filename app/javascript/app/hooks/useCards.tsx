import { useState, useEffect } from 'react'
import { collectionCardActions, deckCardActions } from '../utils/cardActions'
import { Card } from '../interface/Card'
import { CardStats } from '../interface/CardStats'

interface Get {
  (query?: URLSearchParams): Promise<void>
}

interface PaginationProps {
  page: number
  perPage?: number
  total?: number
  totalPages: number
  changePage: any
}

interface Options {
  setId?: number
  query?: URLSearchParams
  deckId?: number
  isDeck?: boolean
}

interface Actions {
  getCards: Get
  cards: Array<Card>
  pagination: PaginationProps
  stats: CardStats
  isLoading: boolean
}

interface CardsResponse {
  cards: Array<Card>
  pagination: PaginationProps
  stats: CardStats
}

const defaultStats = {
  colors: {
    total: 0,
    W: 0,
    U: 0,
    B: 0,
    R: 0,
    G: 0,
    C: 0,
    M: 0,
  },
  types: {
    creature: { count: 0, subtypes: {} },
    enchantment: { count: 0, subtypes: {} },
    instant: { count: 0, subtypes: {} },
    land: { count: 0, subtypes: {} },
    sorcery: { count: 0, subtypes: {} },
    planeswalker: { count: 0, subtypes: {} },
    artifact: { count: 0, subtypes: {} },
  },
  cmc: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  },
  counts: {
    creature: 0,
    nonCreature: 0,
    land: 0,
    nonLand: 0,
  },
  rarity: {
    common: 0,
    uncommon: 0,
    rare: 0,
    mythic: 0,
  },
  cards: 0,
}

/**
 * Contains crud functionality for the Card component.
 * This makes it a lot easier to dynamically set where we update
 * card information for User Collection or Sets.
 */
export const useCards = (options: Options = {}): Actions => {
  const [isLoading, setIsLoading] = useState(true)
  const [cards, setCards] = useState<Array<Card>>([])
  const [pagination, setPagination] = useState<PaginationProps>({
    page: 1,
    totalPages: 1,
    changePage: () => null,
  })
  const [stats, setStats] = useState(defaultStats)
  const [query, setQuery] = useState(options?.query || new URLSearchParams())

  const buildQuery = (cardQuery = new URLSearchParams()): URLSearchParams => {
    const mergedQuery = new URLSearchParams(options?.query?.toString() || '')

    Array.from(cardQuery.keys()).forEach((key) => {
      mergedQuery.delete(key)
      cardQuery.getAll(key).forEach((value) => mergedQuery.append(key, value))
    })

    if (!mergedQuery.has('page')) {
      mergedQuery.append('page', '1')
    }

    mergedQuery.set('per_page', '30')
    mergedQuery.set('q[side_not_eq]', 'b')

    return mergedQuery
  }

  const getCards = async (cardQuery = new URLSearchParams()): Promise<void> => {
    const requestQuery = buildQuery(cardQuery)

    setIsLoading(true)
    setQuery(requestQuery)

    try {
      let response: CardsResponse | undefined
      const { setId, deckId, isDeck } = options

      // Get cards from a set or from a deck
      if (setId || deckId) {
        // Get cards from a set with deck quantities
        if (setId && deckId) {
          response = (await deckCardActions.set(
            requestQuery,
            setId,
            deckId,
          )) as unknown as CardsResponse
          // Get cards from a deck
        } else if (deckId && isDeck) {
          response = (await deckCardActions.deck(requestQuery, deckId)) as unknown as CardsResponse
          // get cards with deck quantities
        } else if (deckId) {
          response = (await deckCardActions.search(
            requestQuery,
            deckId,
          )) as unknown as CardsResponse
          // get set cards without deck quantities
        } else if (setId) {
          response = (await collectionCardActions.set(
            requestQuery,
            setId,
          )) as unknown as CardsResponse
        }
      } else {
        response = (await collectionCardActions.search(requestQuery)) as unknown as CardsResponse
      }

      if (response) {
        setCards(response.cards)
        setPagination(response.pagination)
        setStats(response.stats)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const changePage = (newPage: number): void => {
    const newQuery = new URLSearchParams(query.toString())

    newQuery.set('page', String(newPage))

    getCards(newQuery)
  }

  useEffect(() => {
    if (isLoading) {
      getCards(options.query)
    }
  }, [isLoading])

  useEffect(() => {
    setIsLoading(true)
  }, [options.query])

  return {
    isLoading,
    getCards,
    cards,
    pagination: {
      ...pagination,
      changePage,
    },
    stats,
  }
}
