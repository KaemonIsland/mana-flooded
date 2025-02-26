import React, { ReactElement, useEffect, useState } from 'react'
import { ManaFloodedThemeProvider } from '../theme/ManaFloodedThemeProvider'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { getUser } from '../utils'
import { deckLoader, setLoader } from '../loaders'
import { Home, Deck as DeckPage, Set as SetPage } from './pages'
import { Page } from './components'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Page>
        <Home />
      </Page>
    ),
  },
  {
    path: '/deck/:deckId',
    element: (
      <Page>
        <DeckPage />
      </Page>
    ),
    loader: deckLoader,
  },
  {
    path: '/set/:setId',
    element: (
      <Page>
        <SetPage />
      </Page>
    ),
    loader: setLoader,
  },
  {
    path: '/collection/set/:setId',
    element: (
      <Page>
        <SetPage />
      </Page>
    ),
    loader: setLoader,
  },
])

export default (): ReactElement => {
  const [isInitialized, setIsInitialized] = useState(false)
  const [user, setUser] = useState(null)

  // Get the current user to determine if they are logged in
  const initialize = async () => {
    const { user } = await getUser()

    setUser(user)
  }

  // Initialize the application on the first render
  useEffect(() => {
    if (!isInitialized) {
      initialize()
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Redirect to the login page if the user is not logged in and the app is initialized
  if (isInitialized && user === false) {
    // Turbolinks.visit('/login')
    console.log('User is not logged in, please visit /login')
  }

  return (
    <>
      <ManaFloodedThemeProvider>
        <RouterProvider router={router} />
      </ManaFloodedThemeProvider>
    </>
  )
}
