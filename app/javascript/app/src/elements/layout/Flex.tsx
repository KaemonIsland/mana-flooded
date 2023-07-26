import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

// prettier-ignore
const StyledFlex = styled.div(({
  isColumn,
  justifyContent,
  alignItems,
  flexWrap,
  alignContent,
}) => ({
  display: 'flex',
  maxWidth: '100%',
  flexDirection: isColumn ? 'column' : 'row',
  justifyContent,
  alignItems,
  flexWrap,
  alignContent,
}))

export class Flex extends React.Component {
  render() {
    const { isColumn, justifyContent, alignItems, flexWrap, alignContent, children } = this.props

    const flexStyles = {
      isColumn,
      justifyContent,
      alignItems,
      flexWrap,
      alignContent,
    }
    return <StyledFlex {...flexStyles}>{children}</StyledFlex>
  }
}

Flex.propTypes = {
  children: PropTypes.node,
  isColumn: PropTypes.bool,
  justifyContent: PropTypes.string,
  alignItems: PropTypes.string,
  flexWrap: PropTypes.string,
  alignContent: PropTypes.string,
}

Flex.defaultProps = {
  isColumn: false,
  justifyContent: 'start',
  alignItems: 'start',
  flexWrap: 'nowrap',
  alignContent: '',
}

// prettier-ignore
const StyledFlexItem = styled.div(({
  order,
  grow,
  shrink,
  basis,
  flex,
  alignSelf,
}) => ({
  order,
  grow,
  shrink,
  basis,
  flex,
  alignSelf,
}))

const Item = ({ order, grow = 0, shrink = 0, basis, alignSelf, children }) => {
  const flexItemStyles = {
    order,
    grow,
    shrink,
    basis,
    alignSelf,
  }
  return <StyledFlexItem {...flexItemStyles}>{children}</StyledFlexItem>
}

Flex.Item = Item

Item.propTypes = {
  children: PropTypes.node,
  order: PropTypes.string,
  grow: PropTypes.number,
  shrink: PropTypes.number,
  basis: PropTypes.string,
  alignSelf: PropTypes.string,
}
