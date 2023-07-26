import React from 'react'
import { GlobalStyles } from './GlobalStyles'
import { ThemeProvider } from 'styled-components'
import { theme } from './theme'

export const ManaFloodedThemeProvider = ({ children }) => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    {children}
  </ThemeProvider>
)
