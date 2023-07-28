import React from 'react'
import { Collection } from './Collection'
import { Decks } from './Decks'
import { Page } from '../components'

export const Home = () => {
  return (
    <Page>
      <Collection />
      <hr />
      <Decks />
    </Page>
  )
}
