import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { spaceScale } from '../../../theme/spacing'

const StyledGridItem = styled.div(({ column, row, area, justifySelf, alignSelf, theme }) => ({
  gridArea: area,
  gridColumn: column,
  gridRow: row,
  justifySelf,
  alignSelf,
}))

const GridItem = ({ column, row, area, children, ...rest }) => (
  <StyledGridItem column={column} row={row} area={area} {...rest}>
    {children}
  </StyledGridItem>
)

GridItem.propTypes = {
  children: PropTypes.node,
  column: PropTypes.string,
  row: PropTypes.string,
  area: PropTypes.string,
}

const StyledGrid = styled.div(
  ({
    isInline,
    templateRows,
    templateColumns,
    autoRows,
    autoColumns,
    autoFlow,
    templateAreas,
    columnGap,
    rowGap,
    gap,
    justifyItems,
    alignItems,
    justifyContent,
    alignContent,
    theme,
  }) => ({
    display: isInline ? 'inline-grid' : 'grid',
    width: '100%',
    gridTemplateColumns: templateColumns,
    gridTemplateRows: templateRows,
    gridAutoRows: autoRows,
    gridAutoColumns: autoColumns,
    gridAutoFlow: autoFlow,
    gridTemplateAreas: `"${templateAreas.join('" "')}"`,
    gridGap: theme.spaceScale(gap),
    gridColumnGap: theme.spaceScale(columnGap),
    gridRowGap: theme.spaceScale(rowGap),
    justifyItems,
    alignItems,
    justifyContent,
    alignContent,
  }),
)

export const Grid = ({
  isInline = false,
  templateRows,
  templateColumns,
  autoRows,
  autoColumns,
  autoFlow,
  templateAreas,
  columnGap,
  rowGap,
  gap,
  justifyItems,
  alignItems,
  justifyContent,
  alignContent,
  children,
  ...rest
}) => {
  const gridStyles = {
    isInline,
    templateRows,
    templateColumns,
    autoRows,
    autoColumns,
    autoFlow,
    templateAreas,
    columnGap,
    rowGap,
    gap,
    justifyItems,
    alignItems,
    justifyContent,
    alignContent,
    ...rest,
  }
  return <StyledGrid {...gridStyles}>{children}</StyledGrid>
}

Grid.propTypes = {
  children: PropTypes.node,
  isInline: PropTypes.bool,
  templateRows: PropTypes.string,
  templateColumns: PropTypes.string,
  autoRows: PropTypes.string,
  autoColumns: PropTypes.string,
  autoFlow: PropTypes.string,
  templateAreas: PropTypes.string,
  columnGap: PropTypes.number,
  rowGap: PropTypes.number,
  gap: PropTypes.number,
  justifyItems: PropTypes.string,
  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,
  alignContent: PropTypes.string,
}

Grid.Item = GridItem

/**
 * returns rem size from theme scale
 * @param {number} scale - the number from the scale, 1 - 16
 *
 * @returns the scale with 'rem' appended to it
 */
Grid.space = (scale) => spaceScale(scale)

/**
 * returns number in fr. Should be used when defining columns and rows
 *
 * @param {number} fr - the fraction of space the item should take
 *
 * @returns formatted string combined with 'fr'
 */
Grid.fr = (fr) => `${fr}fr`

/**
 * returns a repeat string used for defining columns and rows
 *
 * @param {number} amount - The amount of times repeated
 * @param {string | number} value - The value repeated
 */
Grid.repeat = (amount, value) => `repeat(${amount}, ${value})`

/**
 * returns a string formatted for minmax in grid row/columns
 *
 * @param {string | number} min - minimum value
 * @param {string | number} max - maximum value
 */
Grid.minMax = (min, max) => `minmax(${min}, ${max})`

Grid.minContent = 'min-content'
Grid.maxContent = 'max-content'
Grid.autoFill = 'auto-fill'
