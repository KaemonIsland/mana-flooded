import { useState } from 'react'

const defaultFilters = {
  sort: 'default',
  color: [],
  rarity: [],
  type: null,
  manaValue: {
    min: 0,
    max: 20,
  },
  price: {
    min: null,
    max: null,
  },
}

export const useFilter = (cardSearch) => {
  const [filters, setFilters] = useState(defaultFilters)

  const formatKey = (key): string => `q[${key}]`

  const buildQuery = (queryFilters = defaultFilters) => {
    const {
      sort = 'default',
      color = [],
      rarity = [],
      type = '',
      manaValue = { min: null, max: null },
      price = { min: null, max: null },
    } = queryFilters
    const q = new URLSearchParams()

    if (sort && sort !== 'default') {
      q.append('sort', sort)
    }

    if (color.length) {
      q.append('colors', String(color))
    }

    if (type) {
      q.append(formatKey('card_type_cont'), type)
    }

    if (rarity.length) {
      rarity.forEach((rareVal) => {
        q.append(`${formatKey('rarity_in')}[]`, String(rareVal))
      })
    }

    if (manaValue.min) {
      q.append(formatKey('mana_value_gteq'), String(manaValue.min))
    }

    if (manaValue.max && manaValue.max !== 20) {
      q.append(formatKey('mana_value_lteq'), String(manaValue.max))
    }

    if (price.min !== null && price.min !== '') {
      q.append(formatKey('price_gteq'), String(price.min))
    }

    if (price.max !== null && price.max !== '') {
      q.append(formatKey('price_lteq'), String(price.max))
    }

    return q
  }

  // Resets the current filters back to default
  const clear = (): void => {
    const query = buildQuery()
    cardSearch(query)
    setFilters(defaultFilters)
  }

  // Searches for cards with current filters
  const apply = (): void => {
    const query = buildQuery(filters)
    cardSearch(query)
  }

  /**
   * Updates an array of options, either adding a new item to the array, or removing it.
   *
   * @param {string} name - category of the filter
   * @param {string} value - value to add/remove from filter category
   */
  const updateMultiple = ({ name, value }) => {
    const filter = filters[name]

    if (value === 'all') {
      setFilters({ ...filters, [name]: [] })
    } else if (filter.includes(value)) {
      setFilters({
        ...filters,
        [name]: filter.filter((val) => val !== value),
      })
    } else {
      setFilters({ ...filters, [name]: [...filter, value] })
    }
  }

  /**
   * Updates a single value to the new value
   *
   * @param {string} name - category of the filter
   * @param {string} value - value to add/remove from filter category
   */
  const updateSingle = ({ name, value }) => {
    if (value === 'all') {
      setFilters({ ...filters, [name]: null })
    } else {
      setFilters({ ...filters, [name]: value })
    }
  }

  /**
   * Updates a range of values, these include a min/max value
   *
   * @param {string} name - category of the filter
   * @param {string} value - value to add/remove from filter category
   */
  const updateRange = ({ filterName, name, value }) => {
    setFilters({
      ...filters,
      [filterName]: { ...filters[filterName], [name]: value },
    })
  }

  /**
   * Decides how to update our various filter
   *
   * @param {object} target - value form form element
   */
  const update = ({ target }) => {
    const { name } = target

    if (name === 'color' || name === 'rarity') {
      updateMultiple(target)
    } else if (name === 'type' || name === 'sort') {
      updateSingle(target)
    } else if (name === 'manaValueMin' || name === 'manaValueMax') {
      updateRange({
        filterName: 'manaValue',
        name: name === 'manaValueMin' ? 'min' : 'max',
        value: Number(target.value),
      })
    } else if (name === 'priceMin' || name === 'priceMax') {
      updateRange({
        filterName: 'price',
        name: name === 'priceMin' ? 'min' : 'max',
        value: target.value === '' ? null : Number(target.value),
      })
    }
  }

  return {
    filters,
    clear,
    update,
    apply,
  }
}
