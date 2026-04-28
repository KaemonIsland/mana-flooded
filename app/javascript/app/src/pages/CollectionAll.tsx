import React, { ReactElement } from 'react'
import { Text } from '../elements'
import { Cards } from '../components'

export const CollectionAll = (): ReactElement => {
  const query = new URLSearchParams({ 'q[collection_only]': 'true' })

  return (
    <>
      <Text size={10}>All Collection Cards</Text>
      <hr />
      <Cards options={{ query }} />
    </>
  )
}
