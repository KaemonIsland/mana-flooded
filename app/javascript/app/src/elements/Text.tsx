import React from 'react'
import styled from 'styled-components'

const TextContainer = styled.div<{
  $size?: number
  $isBold?: boolean
  $isItalics?: boolean
  $align?: string
  $isUpcase?: boolean
  $ellipse?: boolean
  $display?: string
  $color?: string
  $shade?: number
  $family?: string
  $weight?: string | number
  $lineHeight?: number
  $spacing?: number
}>`
  font-family: ${({ $family }) => $family}, sans-serif;
  line-height: ${({ $lineHeight }) => $lineHeight};
  letter-spacing: ${({ $spacing }) => $spacing};
  font-size: ${({ theme, $size }) => theme.fontSizes[$size || 4]}rem;
  font-weight: ${({ $isBold, $weight }) => ($isBold ? 'bold' : $weight)};
  font-style: ${({ $isItalics }) => ($isItalics ? 'italic' : 'normal')};
  text-align: ${({ $align }) => $align};
  text-transform: ${({ $isUpcase }) => $isUpcase && 'uppercase'};
  display: ${({ $display }) => $display};
  color: ${({ $color, $shade, theme }) =>
    $color !== 'black' ? theme.color[$color || 'blue'][$shade || 5] : 'black'};
  width: 100%;
  text-overflow: ${({ $ellipse }) => $ellipse && 'ellipsis'};
  overflow: ${({ $ellipse }) => $ellipse && 'hidden'};
  white-space: ${({ $ellipse }) => $ellipse && 'nowrap'};
`

type TextProps = {
  size?: number
  isBold?: boolean
  isItalics?: boolean
  align?: string
  isUpcase?: boolean
  ellipse?: boolean
  display?: string
  color?: string
  shade?: number
  family?: string
  weight?: string | number
  lineHeight?: number
  spacing?: number
  children?: React.ReactNode
}

export const Text = ({
  size = 3,
  isBold = false,
  isItalics = false,
  align = 'left',
  isUpcase = false,
  display = 'block',
  color = 'black',
  shade = 1,
  family = 'Roboto',
  weight = 400,
  lineHeight = 1,
  spacing = 1,
  children,
  ellipse = false,
}: TextProps) => {
  return (
    <TextContainer
      $size={size}
      $isBold={isBold}
      $isItalics={isItalics}
      $align={align}
      $isUpcase={isUpcase}
      $ellipse={ellipse}
      $display={display}
      $color={color}
      $shade={shade}
      $family={family}
      $weight={weight}
      $lineHeight={lineHeight}
      $spacing={spacing}
    >
      {children}
    </TextContainer>
  )
}
