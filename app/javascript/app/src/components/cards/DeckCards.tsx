import React, { ReactElement, useEffect } from 'react'
import styled from 'styled-components'
import { ImageOnly } from './card'
import { Deck } from '../../../interface/Deck'
import { Card } from '../../../interface/Card'

const StyledGrid = styled.div<{ $imageOnly?: boolean }>`
  display: grid;
  grid-column-gap: ${({ theme }) => theme.spaceScale(2)};
  grid-row-gap: ${({ theme }) => theme.spaceScale(3)};
  grid-template-columns: repeat(
    auto-fill,
    minmax(${({ $imageOnly }) => ($imageOnly ? '15rem' : '22rem')}, 1fr)
  );
  grid-auto-rows: ${({ $imageOnly }) => ($imageOnly ? '23.5rem' : '7rem')};
  justify-items: center;
  align-tems: start;
`

interface Props {
  deck: Deck
  updateDeck: () => {}
}

type cardCategory = {
  [key: string]: Array<Card>
}

export const DeckCards = ({ deck, updateDeck }: Props): ReactElement => {
  const [cards, setCards] = React.useState<cardCategory>({})

  // Converts cards to on object with the key being the category
  const sortByCategory = (deckCards: Array<Card>) => {
    return deckCards.reduce((categories: any, card: Card) => {
      const category: string = card.categories[0]

      if (categories[category]) {
        categories[category].push(card)
      } else {
        categories[category] = [card]
      }

      return categories
    }, {})
  }

  const alphabatizeCategories = (cardsByCategory: any) => {
    const cardCategories = Object.keys(cardsByCategory)
    const sortedCards: any = {}

    cardCategories.sort().forEach((category: string) => {
      const alphaCards: Array<Card> = cardsByCategory[category].sort((a: Card, b: Card) => {
        if (a.name < b.name) {
          return -1
        } else if (a.name > b.name) {
          return 1
        }
        return 0
      })

      sortedCards[category] = alphaCards
    })

    return sortedCards
  }

  useEffect(() => {
    if (deck && deck.cards && deck.cards.length) {
      const cardsByCategory = sortByCategory(deck.cards)

      const sortedCards = alphabatizeCategories(cardsByCategory)

      setCards(sortedCards)
    }
  }, [deck])

  return (
    <>
      {Object.entries(cards).map(([category, cardsInCategory]) => {
        return (
          <>
            <br />
            <h6>
              {category.toUpperCase()} ({`${cardsInCategory.length}`})
            </h6>
            <hr />
            <StyledGrid $imageOnly>
              {cardsInCategory.map((card: Card) => (
                <ImageOnly
                  key={card.id}
                  card={card}
                  options={{
                    name: deck.name,
                    deckId: deck.id,
                    updateDeck,
                  }}
                />
              ))}
            </StyledGrid>
          </>
        )
      })}
    </>
  )
}
