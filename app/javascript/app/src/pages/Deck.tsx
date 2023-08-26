import React, { ReactElement } from 'react'
import { Deck as DeckContainer } from '../components'
import { useLoaderData } from 'react-router'

export const Deck = (): ReactElement => {
  const { id: deckId } = useLoaderData()

  return <DeckContainer deckId={deckId} />
}
