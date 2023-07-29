import React, { ReactElement } from 'react'
import styled from 'styled-components'
import {
  Mana0,
  Mana1,
  Mana2,
  Mana2B,
  Mana2G,
  Mana2R,
  Mana2U,
  Mana2W,
  Mana3,
  Mana4,
  Mana5,
  Mana6,
  Mana7,
  Mana8,
  Mana9,
  Mana10,
  Mana11,
  Mana12,
  Mana13,
  Mana14,
  Mana15,
  Mana16,
  Mana17,
  Mana18,
  Mana19,
  Mana20,
  ManaB,
  ManaBG,
  ManaBP,
  ManaBR,
  ManaC,
  ManaG,
  ManaGP,
  ManaGU,
  ManaGW,
  ManaR,
  ManaRG,
  ManaRP,
  ManaRW,
  ManaS,
  ManaT,
  ManaU,
  ManaUB,
  ManaUP,
  ManaUR,
  ManaW,
  ManaWB,
  ManaWP,
  ManaWU,
  ManaX,
} from './mana'

const manaSymbols = {
  '0': Mana0,
  '1': Mana1,
  '2': Mana2,
  '2B': Mana2B,
  '2G': Mana2G,
  '2R': Mana2R,
  '2U': Mana2U,
  '2W': Mana2W,
  '3': Mana3,
  '4': Mana4,
  '5': Mana5,
  '6': Mana6,
  '7': Mana7,
  '8': Mana8,
  '9': Mana9,
  '10': Mana10,
  '11': Mana11,
  '12': Mana12,
  '13': Mana13,
  '14': Mana14,
  '15': Mana15,
  '16': Mana16,
  '17': Mana17,
  '18': Mana18,
  '19': Mana19,
  '20': Mana20,
  B: ManaB,
  BG: ManaBG,
  BP: ManaBP,
  BR: ManaBR,
  C: ManaC,
  G: ManaG,
  GP: ManaGP,
  GU: ManaGU,
  GW: ManaGW,
  R: ManaR,
  RG: ManaRG,
  RP: ManaRP,
  RW: ManaRW,
  S: ManaS,
  T: ManaT,
  U: ManaU,
  UB: ManaUB,
  UP: ManaUP,
  UR: ManaUR,
  W: ManaW,
  WB: ManaWB,
  WP: ManaWP,
  WU: ManaWU,
  X: ManaX,
}

const ManaContainer = styled.div`
  height: ${({ theme, height }): string => theme.spaceScale(height)};
  width: ${({ theme, width }): string => theme.spaceScale(width)};
  margin-right: ${({ theme }): string => theme.spaceScale(1)};
  border: 1px solid black;
  border-radius: 50%;
`

const Img = styled.div`
  width: 100%;

  & svg {
    height: 100%;
    width: 100%;
  }
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

  const Mana = manaSymbols[mana || '0']

  return (
    <ManaContainer {...sizes[size]}>
      <Img>
        <Mana />
      </Img>
    </ManaContainer>
  )
}
