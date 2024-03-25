import React, { ReactElement, useState, useEffect } from 'react'
import { Text } from '../../elements'
import { Cards } from '../cards'
import { Page } from '../page'
import { setActions } from '../../../utils'
import { CardSet } from '../../../interface/CardSet'

interface SetProps {
  setId: number
}

export const Set = ({ setId }: SetProps): ReactElement => {
  const [cardSet, setCardSet] = useState<CardSet>({})
  const [isInitialized, setIsInitialized] = useState(false)

  const getCardSet = async () => {
    const set: CardSet = await setActions.set(setId)

    setCardSet(set)
  }

  useEffect(() => {
    if (!isInitialized) {
      getCardSet()
      setIsInitialized(true)
    }
  }, [isInitialized, cardSet])

  return (
    <>
      <Text
        size={10}
        style={{
          textTransform: 'uppercase',
        }}
      >
        {cardSet.name || ''}
      </Text>
      <hr />
      <Cards options={{ setId }} />
    </>
  )
}
