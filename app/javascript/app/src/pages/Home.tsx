import React from 'react'
import { Collection } from './Collection'
import { Sets } from './Sets'
import { Decks } from './Decks'
import { Page } from '../components'

export const Home = () => {
  return (
    <>
      <Collection />
      <hr />
      <Sets />
      <hr />
      <Decks />
    </>
  )
}
