import React, { ReactElement } from 'react'
import { Set as SetContainer } from '../components'
import { useLoaderData } from 'react-router'

export const Set = (): ReactElement => {
  const { id: setId } = useLoaderData()

  return <SetContainer setId={setId} />
}
