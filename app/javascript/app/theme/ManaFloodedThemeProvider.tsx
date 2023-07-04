import React from 'react'
import { GlobalStyles } from './GlobalStyles'
import { ThemeProvider } from 'styled-components'
import { theme } from './theme'

console.log(theme)

export const ManaFloodedThemeProvider = ({ children }) => (
  <ThemeProvider theme={{}}>
    <GlobalStyles />
    {children}
  </ThemeProvider>
)
