import React, { ReactElement, useEffect } from 'react'
import { Flex, Text } from '../elements'
import { CardSet } from '../../interface/CardSet'
import { SetGroups, Page } from '../components'
import { setActions } from '../../utils'

/**
 * Groups sets together by set type
 */
export const Sets = (): ReactElement => {
  const [cardSets, setCardSets] = React.useState<CardSet[]>([])
  const [isInitialized, setIsInitialized] = React.useState(false)

  const getCardSets = async () => {
    const sets: CardSet[] = await setActions.sets()

    setCardSets(sets)
  }

  useEffect(() => {
    if (!isInitialized) {
      getCardSets()
      setIsInitialized(true)
    }
  }, [isInitialized, cardSets])
  return (
    <>
      <Flex justifyContent="start" alignItems="center">
        <Text size={10}>Sets</Text>
      </Flex>
      <hr />
      <SetGroups sets={cardSets} setsOptions={{ link: '/sets' }} />
    </>
  )
}
