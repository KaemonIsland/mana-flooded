import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { gutter } from './ToastElement'

// Placements
//
//   'top-left': { top: 0, left: 0 }
//   'top-center': { top: 0, left: '50%', transform: 'translateX(-50%)' }
//   'top-right': { top: 0, right: 0 }
//   'bottom-left': { bottom: 0, left: 0 }
//   'bottom-center': { bottom: 0, left: '50%', transform: 'translateX(-50%)' }
//   'bottom-right': { bottom: 0, right: 0 }

const StyledContainer = styled.div(({ theme, hasToasts }) => ({
  maxHeight: '100%',
  overflow: 'hidden',
  padding: gutter,
  pointerEvents: hasToasts ? null : 'none',
  position: 'fixed',
  zIndex: 100000000000000,
  top: theme.spaceScale(8),
  right: 0,
}))

interface ToastContainerProps {
  hasToasts: boolean
  children: ReactElement
}

export const ToastContainer = ({
  hasToasts,
  children,
  ...props
}: ToastContainerProps): ReactElement => (
  <StyledContainer hasToasts={hasToasts} {...props}>
    {children}
  </StyledContainer>
)
