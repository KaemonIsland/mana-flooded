import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

document.addEventListener('turbo:load', () => {
  console.log('I was called!')
  const root = createRoot(document.body.appendChild(document.createElement('div')))
  root.render(<App />)
})
