import React from 'react'
import styled, { keyframes, css, withTheme } from 'styled-components'
import PropTypes from 'prop-types'

const topBubbles = keyframes`
  0%{
    background-position: 10% 90%, 20% 90%, 30% 90%, 40% 90%, 50% 90%, 60% 90%, 70% 90%, 80% 90%, 90% 90%;
  }
  50% {
    background-position: 0% 40%, 10% 20%, 20% 40%, 30% 0%, 50% 30%, 70% 50%, 80% 50%, 90% 20%, 100% 30%;
  }
  100% {
    background-position: -10% 70%, 0% 10%, 30% 30%, 40% -10%, 50% 20%, 70% 40%, 80% 40%, 90% 10%, 100% 30%;
    background-size: 0% 0%, 0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%;
  }
`
const bottomBubbles = keyframes`
  0% {
    background-position: 10% 10%, 20% 10%, 30% 10%, 40% 10%, 50% 10%, 60% 10%, 70% 10%, 80% 10%, 90% 10%;
  }
  50% {
    background-position: 0% 80%, 10% 80%, 20% 60%, 30% 100%, 50% 70%, 70% 60%, 80% 70%, 90% 50%, 100% 40%;
  }
  100% {
    background-position: 0% 90%, 10% 90%, 20% 70%, 30% 110%, 50% 80%, 70% 70%, 80% 75%, 90% 90%, 100% 60%;
    background-size: 0% 0%, 0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%,  0% 0%;
  }
`

const topAnimation = css`
  ${topBubbles} ease-in-out .75s forwards
`

const bottomAnimation = css`
  ${bottomBubbles} ease-in-out .75s forwards;
`

const StyledButton = styled.button`
  border-radius: ${({ borderRadius }) => borderRadius};
  border: ${({ border }) => (border ? border : 'none')};
  color: ${({ color }) => (color ? color : 'black')};
  background-color: ${({ backgroundColor }) => backgroundColor};
  position: relative;
  font-family: roboto, sans-serif;
  line-height: ${({ theme }) => theme.spaceScale(5)};
  font-weight: 500;
  font-size: ${({ theme }) => theme.fontScale(2)};
  text-transform: uppercase;
  padding: ${({ paddingSize }) => paddingSize};
  transition: all 200ms;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
  outline: none;

  &:hover, &:focus {
    background-color: ${({ focusBackground }) => focusBackground};
    transform: ${({ isDisabled, hover }) => (!isDisabled && hover ? 'translateY(-0.3rem)' : '')};
    box-shadow: ${({ theme, hover }) => hover && theme.boxShadow.single[2]};
  }

  &:active {
    transform: ${({ isDisabled, hover }) => (!isDisabled && hover ? 'translateY(-0.1rem)' : '')};
    box-shadow: ${({ theme, hover }) => hover && theme.boxShadow.single[1]};
  }

  &:before, &:after {
    position: absolute;
    content: '';
    display: block;
    width: 140%;
    height: 100%;
    left: -20%;
    z-index: -1000;
    transition: all ease-out .75s;
    background-repeat: no-repeat;
  }
  &:before {
    animation: ${({ animate }) => (animate ? topAnimation : '')};
    display: ${({ animate }) => (animate ? 'block' : 'none')};
    top: -75%;
    background-image: 
      radial-gradient(circle, ${({ bubbleColor }) => bubbleColor} 20%, transparent 20%),
      radial-gradient(circle,  transparent 20%, ${({ bubbleColor }) =>
        bubbleColor} 20%, transparent 30%),
      radial-gradient(circle, ${({ bubbleColor }) => bubbleColor} 20%, transparent 20%),
      radial-gradient(circle, ${({ bubbleColor }) => bubbleColor} 20%, transparent 20%),
      radial-gradient(circle,  transparent 10%, ${({ bubbleColor }) =>
        bubbleColor} 15%, transparent 20%),
      radial-gradient(circle, ${({ bubbleColor }) => bubbleColor} 20%, transparent 20%),
      radial-gradient(circle, ${({ bubbleColor }) => bubbleColor} 20%, transparent 20%),
      radial-gradient(circle, ${({ bubbleColor }) => bubbleColor} 20%, transparent 20%),
      radial-gradient(circle, transparent 10%, ${({ bubbleColor }) =>
        bubbleColor} 20%, transparent 20%);
    background-size: 20% 20%, 25% 25%, 20% 20%, 25% 25%, 30% 30%, 25% 25%, 30% 30%, 15% 15%, 25% 25%;
  }
  &:after {
    animation: ${({ animate }) => (animate ? bottomAnimation : '')};
    display: ${({ animate }) => (animate ? 'block' : 'none')};
    bottom: -75%;
    background-image: 
      radial-gradient(circle, ${({ bubbleColor }) => bubbleColor} 20%, transparent 20%),
      radial-gradient(circle,  transparent 20%, ${({ bubbleColor }) =>
        bubbleColor} 20%, transparent 30%),
      radial-gradient(circle, ${({ bubbleColor }) => bubbleColor} 20%, transparent 20%),
      radial-gradient(circle, ${({ bubbleColor }) => bubbleColor} 20%, transparent 20%),
      radial-gradient(circle,  transparent 10%, ${({ bubbleColor }) =>
        bubbleColor} 15%, transparent 20%),
      radial-gradient(circle, ${({ bubbleColor }) => bubbleColor} 20%, transparent 20%),
      radial-gradient(circle, ${({ bubbleColor }) => bubbleColor} 20%, transparent 20%),
      radial-gradient(circle, ${({ bubbleColor }) => bubbleColor} 20%, transparent 20%),
      radial-gradient(circle, transparent 10%, ${({ bubbleColor }) =>
        bubbleColor} 20%, transparent 20%);
      background-size: 20% 20%, 25% 25%, 20% 20%, 25% 25%, 30% 30%, 25% 25%, 30% 30%, 15% 15%, 25% 25%;
  }
}
`

export const Button = withTheme(
  ({
    color,
    shade = 4,
    type = 'button',
    rounded = 'small',
    size = 'small',
    variant = 'filled',
    hover = false,
    isDisabled = false,
    onClick = () => {},
    theme,
    bubble = true,
    children,
    ...rest
  }) => {
    const [animate, setAnimate] = React.useState(false)

    let borderRadius
    switch (rounded) {
      case 'small':
        borderRadius = theme.spaceScale(1)
        break
      case 'medium':
        borderRadius = theme.spaceScale(2)
        break
      case 'large':
        borderRadius = theme.spaceScale(4)
        break
      case 'full':
        borderRadius = theme.spaceScale(16)
        break
      default:
        borderRadius = '0rem'
    }

    let paddingSize
    switch (size) {
      case 'small':
        paddingSize = `${theme.spaceScale(1)} ${theme.spaceScale(2)}`
        break
      case 'medium':
        paddingSize = `${theme.spaceScale(2)} ${theme.spaceScale(3)}`
        break
      case 'large':
        paddingSize = `${theme.spaceScale(2)} ${theme.spaceScale(4)}`
        break
      default:
        paddingSize = `${theme.spaceScale(2)} ${theme.spaceScale(3)}`
    }

    // The default variant is filled. Thus we do not change anything for filled switch case
    const variants = {
      main: {
        border: 'none',
        backgroundColor: color ? theme.color[color][shade || 1] : 'white',
        color: theme.textContrast(color ? theme.color[color][shade] : 'hsl(0, 100%, 100%)'),
      },
      focus: {
        backgroundColor: color ? theme.color[color][shade + 1 || 2] : theme.color.grey[1],
      },
    }

    let { main, focus } = variants

    switch (variant) {
      case 'outline':
        main.border = `1px solid ${theme.color[color][shade || 1]}`
        main.color = color ? theme.color[color][shade || 4] : 'black'
        main.backgroundColor = 'transparent'
        focus.backgroundColor = color ? theme.color[color][1] : theme.color.grey[1]
        break
      case 'text':
        main.color = color ? theme.color[color][shade || 4] : 'black'
        main.backgroundColor = 'transparent'
        focus.backgroundColor = color ? theme.color[color][1] : theme.color.grey[1]
        break
      case 'filled':
        break
      default:
        break
    }

    if (isDisabled) {
      main.color = theme.color.grey[6]
      main.border = '1px solid transparent'
      main.backgroundColor = theme.color.grey[1]
      focus.backgroundColor = theme.color.grey[1]
    }

    const buttonStyles = {
      type,
      hover: !isDisabled && hover,
      isDisabled,
      borderRadius,
      paddingSize,
      border: main.border,
      color: main.color,
      backgroundColor: main.backgroundColor,
      focusBackground: focus.backgroundColor,
      ...rest,
    }

    if (bubble && !isDisabled) {
      buttonStyles.bubbleColor = variant === 'filled' ? main.backgroundColor : main.color
    }

    React.useEffect(() => {
      if (animate) {
        setTimeout(() => {
          setAnimate(false)
        }, [750])
      }
    }, [animate])
    return (
      <StyledButton
        animate={animate}
        onClick={(e) => {
          if (!isDisabled) {
            setAnimate(true)
            onClick(e)
          }
        }}
        {...buttonStyles}
      >
        {children}
      </StyledButton>
    )
  },
)

Button.propTypes = {
  type: PropTypes.string,
  color: PropTypes.string,
  shade: PropTypes.number,
  rounded: PropTypes.string,
  size: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.string,
  hover: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  bubble: PropTypes.bool,
}
