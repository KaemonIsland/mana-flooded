import React, { useState, FormEvent, ReactElement, useEffect } from 'react'
import { Button, Flex, Container, Form, Input, Checkbox, CheckboxConfirm } from '../../elements'
import { Collapse } from '..'
import { useSearchParams } from 'react-router-dom'

interface Callback {
  (query: URLSearchParams): void
}

interface SearchProps {
  callback: Callback
}

const formatKey = (key): string => `q[${key}]`

const searchSettings = {
  cardName: 'name_cont_any',
  cardText: 'text_cont_any',
  cardType: 'card_type_cont',
  manaCost: 'mana_cost_cont',
  artist: 'artist_cont',
  flavorText: 'flavor_text_cont',
  rarity: 'rarity_in',
  collectionOnly: 'collection_only',
}

const defaultForm = {
  colors: null,
  rarity: null,
  cardName: null,
  cardText: null,
  cardType: null,
  manaCost: null,
  flavorText: null,
  artist: null,
  collectionOnly: false,
}

export const Search = ({ callback }: SearchProps): ReactElement => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [resetForm, setResetForm] = useState(true)
  const [query, setQuery] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const buildQuery = () => {
    const query = new URLSearchParams()

    Object.entries(form).forEach(([key, value]) => {
      if (!value) {
        // Do nothing for null values
      } else if (key === 'colors') {
        query.append('colors', String(form.colors))
      } else if (key === 'rarity') {
        form.rarity.forEach((rareVal) => {
          query.append(`${formatKey('rarity_in')}[]`, String(rareVal))
        })
      } else {
        query.append(formatKey(searchSettings[key]), String(value))
      }
    })

    return query
  }

  const submitForm = (e: FormEvent): void => {
    e.preventDefault()

    const query = buildQuery()

    setQuery(query)
    setSearchParams(query)

    callback(query)

    if (resetForm) {
      setForm({ ...defaultForm, collectionOnly: form.collectionOnly })
    }
  }

  const handleTextChange = (e) => {
    const { name, value } = e.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target

    let updatedValue = form[name] || []

    if (checked) {
      updatedValue.push(value)
    } else {
      updatedValue = updatedValue.filter((elem) => elem !== value)
    }

    setForm((currentForm) => ({
      ...currentForm,
      [name]: updatedValue,
    }))
  }

  const handleCheckboxConfirmChange = (confirmName: string): void => {
    setForm((currentForm) => ({
      ...currentForm,
      [confirmName]: !currentForm?.collectionOnly,
    }))
  }

  const handleFocus = (e) => {
    e.currentTarget.select()
  }

  // useEffect(() => {
  //   if (query.null && searchParams.size) {
  //     callback(searchParams)
  //   }
  // }, [searchParams, query])

  return (
    <Form onSubmit={submitForm}>
      <Input
        label="Card Name"
        name="cardName"
        type="text"
        placeholder="name doesn't have to be exact"
        onChange={handleTextChange}
        value={form?.cardName || ''}
        onFocus={handleFocus}
      />
      <Collapse isOpen={showAdvanced}>
        <Collapse.Content>
          <>
            <br />
            <Input
              label="Text"
              name="cardText"
              type="text"
              placeholder="Text can match anything"
              onChange={handleTextChange}
              value={form?.cardText || ''}
            />
            <br />
            <Input
              label="Type Line"
              name="cardType"
              type="text"
              placeholder="Text can match anything"
              hint="Sorcery, Instant, Creature"
              onChange={handleTextChange}
              value={form?.cardType || ''}
            />
            <br />
            <Checkbox
              label="Colors"
              onChange={handleCheckboxChange}
              hint="Selecting Multi will return cards that only contain selected colors"
              name="colors"
              value={form?.colors || []}
              options={[
                { label: 'White', value: 'W' },
                { label: 'Blue', value: 'U' },
                { label: 'Black', value: 'B' },
                { label: 'Red', value: 'R' },
                { label: 'Green', value: 'G' },
                { label: 'Multi', value: 'M' },
                { label: 'Colorless', value: 'C' },
              ]}
            />
            <br />
            <Input
              label="Mana Cost"
              name="manaCost"
              type="text"
              placeholder="Wrap colors within curly brackets {}"
              hint="Wrap colors within curly brackets. EX {1}{U/B}{W}"
              onChange={handleTextChange}
              value={form?.manaCost || ''}
            />
            <br />
            <Checkbox
              label="Rarity"
              onChange={handleCheckboxChange}
              name="rarity"
              value={form?.rarity || []}
              options={[
                { value: 'common' },
                { value: 'uncommon' },
                { value: 'rare' },
                { value: 'mythic' },
              ]}
            />
            <br />
            <Input
              label="Artist"
              name="artist"
              type="text"
              placeholder="Text can match anything"
              onChange={handleTextChange}
              value={form?.artist || ''}
            />
            <br />
            <Input
              label="Flavor Text"
              name="flavorText"
              type="text"
              placeholder="Text can match anything"
              onChange={handleTextChange}
              value={form?.flavorText || ''}
            />
            <br />
          </>
        </Collapse.Content>
      </Collapse>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" justifyContent="flex-start">
          <Container marginRight={4}>
            <CheckboxConfirm
              label="Reset Form?"
              onChange={() => {
                setResetForm(!resetForm)
              }}
              value={resetForm}
            />
          </Container>
          <Container marginRight={4}>
            <CheckboxConfirm
              label="Collection Only"
              onChange={() => handleCheckboxConfirmChange('collectionOnly')}
              value={form?.collectionOnly}
            />
          </Container>
        </Flex>
        <Flex alignItems="center" justiyfContent="flex-end">
          <Container marginRight={4}>
            <Button
              color="grey"
              shade={9}
              variant="text"
              size="large"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              Advanced
            </Button>
          </Container>
          <Container marginRight={4}>
            <Button
              color="red"
              shade={6}
              variant="text"
              size="large"
              onClick={() => {
                setSearchParams(new URLSearchParams())
                setForm(defaultForm)
              }}
            >
              Clear
            </Button>
          </Container>
          <Button color="purple" size="large" shade={4} type="submit">
            Search
          </Button>
        </Flex>
      </Flex>
    </Form>
  )
}
