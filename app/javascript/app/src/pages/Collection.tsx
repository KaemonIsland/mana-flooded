import React, { useState, useEffect, ReactElement } from 'react'
import { Text } from '../elements/Text'
import styled from 'styled-components'
import { collectionCardActions } from '../../utils'
import { Page, SetGroups, ImportExport } from '../components'
import { CardSet } from '../../interface/CardSet'

const SetContainer = styled.a`
  display: block;
  margin-bottom: ${({ theme }) => theme.spaceScale(3)};
  text-decoration: none;
  color: black;
  text-transform: uppercase;
  padding: ${({ theme }) => theme.spaceScale(2)};
  border: 1px solid ${({ theme }) => theme.color.purple[8]};
  text-align: center;
  box-shadow: ${({ theme }) => theme.boxShadow.single[1]};
  background-color: white;
  border-radius: ${({ theme }) => theme.spaceScale(2)};
  transition: all 200ms ease-in-out;
  &: hover;
  &:focus: {
    background-color: ${({ theme }) => theme.color.purple[2]};
    transform: translateY(-4px);
    boxshadow: ${({ theme }) => theme.boxShadow.single[2]};
  }
  &:active: {
    background-color: ${({ theme }) => theme.color.purple[2]};
    transform: translateY(-2px);
    boxshadow: ${({ theme }) => theme.boxShadow.single[1]};
  }
`

export const Collection = (): ReactElement => {
  const [cardSets, setCardSets] = useState<CardSet[]>([])

  const getCollectionSets = async (): Promise<void> => {
    const sets = await collectionCardActions.sets()

    setCardSets(sets)
  }

  useEffect(() => {
    getCollectionSets()
  }, [])

  return (
    <Page>
      <Text size={10}>Collection</Text>
      <ImportExport />
      <hr />
      <SetContainer href="/collection/all">
        <Text size={4} weight={500} align="center">
          All Cards
        </Text>
      </SetContainer>
      <SetGroups sets={cardSets} setsOptions={{ link: '/collection/set', showAddInfo: true }} />
    </Page>
  )
}
