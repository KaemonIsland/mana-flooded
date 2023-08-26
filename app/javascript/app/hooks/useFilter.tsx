import { useState } from 'react'

const defaultFilters = {
  color: [],
  rarity: [],
  type: null,
  manaValue: {
    min: 0,
    max: 20,
  },
}

export const useFilter = (cardSearch) => {
  const [filters, setFilters] = useState(defaultFilters)

  console.log(filters)

  const formatKey = (key): string => `q[${key}]`

  const buildQuery = (queryFilters = defaultFilters) => {
    const {
      color = [],
      rarity = [],
      type = '',
      manaValue = { min: null, max: null },
    } = queryFilters
    const q = new URLSearchParams()

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
    console.log('Update Single: ', name, value)
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
  const updateRange = ({ name, value }) => {
    setFilters({
      ...filters,
      manaValue: { ...filters.manaValue, [name]: value },
    })
  }

  /**
   * Decides how to update our various filter
   *
   * @param {object} target - value form form element
   */
  const update = ({ target }) => {
    const { name } = target

    console.log('Update: ', name)

    if (name === 'color' || name === 'rarity') {
      updateMultiple(target)
    } else if (name === 'type') {
      updateSingle(target)
    } else if (name === 'min' || name === 'max') {
      updateRange(target)
    }
  }

  return {
    filters,
    clear,
    update,
    apply,
  }
}
