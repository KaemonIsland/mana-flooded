import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { Flex, Button, Container, Text } from '../../elements'
import { CardStats } from '../../../interface/CardStats'
import { Filter as CardFilter } from '../../../interface/Filter'

const StyledLabel = styled.label(({ disabled }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  opacity: disabled && 0.5,
}))

const Count = styled.span(({ theme }) => ({
  color: theme.color.grey[6],
}))

const FilterContainer = styled.div(({ theme }) => ({
  backgroundColor: 'white',
  border: '1px solid black',
  borderRadius: theme.spaceScale(1),
  boxShadow: theme.boxShadow.single[1],
}))

const FilterBox = styled.div(({ theme }) => ({
  padding: theme.spaceScale(2),
  marginBottom: '1rem',
  lineHeight: 1.5,
}))

interface Update {
  (e: any): void
}
interface Clear {
  (): void
}

interface ManaValue {
  min: number
  max: number
}

interface FilterContentProps {
  color: Array<string>
  rarity: Array<string>
  type: string
  manaValue: ManaValue
  stats: CardStats
  update: Update
  clear: Clear
  apply: Clear
}

const FilterContent = ({
  color,
  type,
  rarity,
  manaValue,
  stats,
  update,
  clear,
  apply,
}: FilterContentProps): ReactElement => {
  const isDisabled = !(
    color.length ||
    rarity.length ||
    type ||
    manaValue.min ||
    manaValue.max !== 20
  )
  return (
    <FilterContainer>
      <FilterBox>
        {
          <Flex alignItems="center" justifyContent="space-between">
            <Button color="red" isDisabled={isDisabled} shade={2} onClick={clear}>
              Clear
            </Button>
            <Button color="purple" isDisabled={isDisabled} shade={3} onClick={apply}>
              Apply
            </Button>
          </Flex>
        }
      </FilterBox>
      <FilterBox>
        <Flex alignItems="center" justifyContent="space-between">
          <Text family="roboto">COLOR</Text>
        </Flex>
        <hr />
        <Flex isColumn alignItems="start" justifyContent="start">
          <Container width="100%">
            <StyledLabel>
              <span>
                <input
                  type="checkbox"
                  name="color"
                  value="all"
                  onChange={update}
                  checked={color.length === 0}
                />
                All
              </span>
            </StyledLabel>
          </Container>
          {[
            { label: 'white', value: 'W' },
            { label: 'blue', value: 'U' },
            { label: 'black', value: 'B' },
            { label: 'red', value: 'R' },
            { label: 'green', value: 'G' },
            { label: 'multi', value: 'M' },
            { label: 'colorless', value: 'C' },
          ].map(({ label, value }) => (
            <Container width="100%" key={label}>
              <StyledLabel disabled={!stats.colors[value]}>
                <span>
                  <input
                    type="checkbox"
                    name="color"
                    value={value}
                    onChange={update}
                    checked={color.includes(value)}
                    disabled={!stats.colors[value]}
                  />
                  {label}
                </span>
                <Count>({stats.colors[value]})</Count>
              </StyledLabel>
            </Container>
          ))}
        </Flex>
      </FilterBox>
      <FilterBox>
        <Flex alignItems="center" justifyContent="space-between">
          <Text family="roboto">TYPE</Text>
        </Flex>
        <hr />
        <Flex isColumn alignItems="start" justifyContent="start">
          <Container width="100%">
            <StyledLabel>
              <span>
                <input type="radio" name="type" value="all" onChange={update} checked={!type} />
                All
              </span>
            </StyledLabel>
          </Container>
          {[
            'creature',
            'sorcery',
            'instant',
            'enchantment',
            'artifact',
            'planeswalker',
            'land',
          ].map((type) => (
            <Container width="100%" key={type}>
              <StyledLabel disabled={!stats.types[type].count}>
                <span>
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    onChange={update}
                    disabled={!stats.types[type].count}
                  />
                  {type}
                </span>
                <Count>({stats.types[type].count})</Count>
              </StyledLabel>
            </Container>
          ))}
        </Flex>
      </FilterBox>
      <FilterBox>
        <Flex alignItems="center" justifyContent="space-between">
          <Text family="roboto">RARITY</Text>
        </Flex>
        <hr />
        <Flex isColumn alignItems="start" justifyContent="start">
          <Container width="100%">
            <StyledLabel>
              <span>
                <input
                  type="checkbox"
                  name="rarity"
                  value="all"
                  onChange={update}
                  checked={rarity.length === 0}
                />
                All
              </span>
            </StyledLabel>
          </Container>
          {['common', 'uncommon', 'rare', 'mythic'].map((cardRarity) => (
            <Container width="100%" key={cardRarity}>
              <StyledLabel disabled={!stats.rarity[cardRarity]}>
                <span>
                  <input
                    type="checkbox"
                    name="rarity"
                    value={cardRarity}
                    onChange={update}
                    checked={rarity.includes(cardRarity)}
                    disabled={!stats.rarity[cardRarity]}
                  />

                  {cardRarity}
                </span>
                <Count>({stats.rarity[cardRarity]})</Count>
              </StyledLabel>
            </Container>
          ))}
        </Flex>
      </FilterBox>
      <FilterBox>
        <Flex alignItems="center" justifyContent="space-between">
          <Text family="roboto">Mana Value</Text>
        </Flex>
        <hr />
        <Flex isColumn alignItems="start" justifyContent="start">
          <Container width="100%">
            <StyledLabel htmlFor="min">
              <span>Min: {manaValue.min}</span>
            </StyledLabel>
            <input
              type="range"
              name="min"
              min={0}
              max={manaValue.max}
              id="min"
              value={manaValue.min}
              onChange={update}
            />
          </Container>
          <Container width="100%">
            <StyledLabel htmlFor="max">
              <span>Max: {manaValue.max}</span>
            </StyledLabel>
            <input
              type="range"
              name="max"
              min={manaValue.min}
              max={20}
              id="max"
              value={manaValue.max}
              onChange={update}
            />
          </Container>
        </Flex>
      </FilterBox>
    </FilterContainer>
  )
}

interface FilterProps {
  stats: CardStats
  update: Update
  filters: CardFilter
  clear: Clear
  apply: Clear
}

export const Filter = ({ stats, update, filters, clear, apply }: FilterProps): ReactElement => {
  const filterParams = {
    ...filters,
    stats,
    update,
    clear,
    apply,
  }

  return (
    <div style={{ position: 'relative' }}>
      <FilterContent {...filterParams} />
    </div>
  )
}
