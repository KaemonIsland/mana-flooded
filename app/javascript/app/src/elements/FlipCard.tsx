import React, { useState, Children, cloneElement } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Container } from './layout'

const StyledFlipCard = styled.div(({ flipped, flipDirection }) => {
  // prettier-ignore
  const frontFlip = flipDirection === 'horizontal' ? 'rotateY(-180deg)' : 'rotateX(-180deg)'

  // prettier-ignore
  const backFlip = flipDirection === 'horizontal' ? 'rotateY(0deg)' : 'rotateX(0deg)'

  return {
    perspective: '1000px',
    height: '100%',
    width: '100%',
    position: 'relative',
    '& div:first-child': {
      transform: flipped && frontFlip,
    },
    '& div:last-child': {
      transform: flipped && backFlip,
    },
  }
})

export const FlipCard = ({ flipDirection = 'horizontal', children }) => {
  const [flipped, setFlipped] = useState(false)

  const handleFlip = (side) => {
    setFlipped(side === 'front')
  }

  // prettier-ignore
  return (
    <StyledFlipCard
      flipDirection={flipDirection}
      flipped={flipped}
    >
      {
        Children.map(children, child => cloneElement(child, { flipDirection, flip: handleFlip }))
      }
    </StyledFlipCard>
  )
}

FlipCard.propTypes = {
  children: PropTypes.node.isRequired,
  flipDirection: PropTypes.oneOf(['horizontal', 'vertical']),
}

// prettier-ignore
const StyledCardSide = styled('div')(
  ({
    side,
    theme,
    isPaddingless,
    flipDirection
  }) => {
    const front = flipDirection === 'horizontal'
      ? 'rotateY(0deg)'
      : 'rotateX(0deg)'

    const back = flipDirection === 'horizontal'
      ? 'rotateY(180deg)'
      : 'rotateX(180deg)'

    return {
      backgroundColor: '#fff',
      transform: side === 'front' ? front : back,
      padding: isPaddingless ? 'auto' : '0.5rem',
      boxShadow: theme.boxShadow.single[2],
      position: 'absolute',
      transformStyle: 'preserve-3d',
      transition: 'all 400ms ease',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      '-webkit-backface-visibility': 'hidden',
      backfaceVisibility: 'hidden',
      border: '2px solid transparent',
      borderRadius: '0.5rem',
      '&:hover, &:focus': {
        border: '2px solid black',
      }
    }
  },
)

export const CardSide = ({
  side,
  isPaddingless = false,
  flipDirection = 'horizontal',
  flip,
  children,
  containerProps = {},
  ...rest
}) => {
  const cardStyles = {
    isPaddingless,
    side,
    flipDirection,
    ...rest,
  }

  const handleKeyDown = (event) => {
    if (event.keyCode === 32) {
      event.preventDefault()
      flip(side)
    }
  }

  return (
    <StyledCardSide
      tabIndex="0"
      onKeyDown={handleKeyDown}
      onClick={() => flip(side)}
      {...cardStyles}
    >
      <Container display="inline" {...containerProps}>
        {children}
      </Container>
    </StyledCardSide>
  )
}

CardSide.propTypes = {
  children: PropTypes.node.isRequired,
  side: PropTypes.oneOf(['front', 'back']),
  backgroundColor: PropTypes.string,
  isPaddingless: PropTypes.bool,
  flipDirection: PropTypes.oneOf(['horizontal', 'vertical']),
}

FlipCard.Front = ({ children, ...props }) => {
  return (
    <CardSide side="front" {...props}>
      {children}
    </CardSide>
  )
}

FlipCard.Back = ({ children, ...props }) => {
  return (
    <CardSide side="back" {...props}>
      {children}
    </CardSide>
  )
}
