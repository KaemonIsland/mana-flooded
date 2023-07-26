import React, { ReactElement } from 'react'
import styled from 'styled-components'

const Mana = styled.div`
  height: ${({ theme, height }): string => theme.spaceScale(height)};
  width: ${({ theme, width }): string => theme.spaceScale(width)};
  margin-right: ${({ theme }): string => theme.spaceScale(1)};
  border: 1px solid black;
  border-radius: 50%;
`

const Img = styled.img`
  width: 100%;
  height: auto;
  max-width: 100%;
`

interface ManaSymbolProps {
  mana: string
  size: string
}

export const ManaSymbol = ({ mana, size }: ManaSymbolProps): ReactElement => {
  const sizes = {
    tiny: { width: 4, height: 4 },
    small: { width: 5, height: 5 },
    medium: { width: 6, height: 6 },
    large: { width: 7, height: 7 },
    xLarge: { width: 8, height: 8 },
  }

  try {
    return (
      <Mana {...sizes[size]}>
        <Img src={`../../../svgs/${mana}.svg`} alt={`${mana} symbol`} />
      </Mana>
    )
  } catch (error) {
    return null
  }
}
