import React from 'react'
import Routes from '../../routes'
import { ManaFloodedThemeProvider } from '../theme/ManaFloodedThemeProvider'

export default (props) => (
  <>
    <ManaFloodedThemeProvider>{Routes}</ManaFloodedThemeProvider>
  </>
)
