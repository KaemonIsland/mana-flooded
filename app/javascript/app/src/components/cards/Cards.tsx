import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { Filter } from '../filter'
import { ImageOnly } from './card'
import { Pagination } from '../page'
import { useFilter, useCards } from '../../../hooks'

const CardsContainer = styled.section(({ theme, showFilter }) => ({
  display: 'grid',
  gridTemplateColumns: !showFilter ? `1fr` : `${theme.spaceScale(12)} 1fr`,
  gridTemplateRows: 'auto',
  gridGap: '1rem',
}))

const StyledGrid = styled.div(({ theme }) => ({
  position: 'relative',
  display: 'grid',
  gridGap: theme.spaceScale(3),
  gridTemplateColumns: `repeat(auto-fill, minmax(16rem, 1fr))`,
  gridAutoRows: '26rem',
  justifyItems: 'center',
  alignItems: 'start',
}))

const LoadingState = styled.div(({ theme }) => ({
  minHeight: '18rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid black',
  borderRadius: theme.spaceScale(2),
  backgroundColor: theme.color.purple[1],
  boxShadow: theme.boxShadow.single[1],
}))

const LoadingOverlay = styled.div(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255,255,255,0.78)',
  borderRadius: theme.spaceScale(2),
  zIndex: 2,
}))

const LoadingPill = styled.div(({ theme }) => ({
  padding: `${theme.spaceScale(2)} ${theme.spaceScale(3)}`,
  borderRadius: theme.spaceScale(4),
  border: '1px solid black',
  backgroundColor: 'white',
  boxShadow: theme.boxShadow.single[2],
  fontWeight: 600,
}))

interface Options {
  setId?: number
  setType?: string
  deckId?: number
  query?: URLSearchParams
}

interface Props {
  options?: Options
  showScope?: boolean
  showFilter?: boolean
  imageOnly?: boolean
  showPagination?: boolean
}

export const Cards = ({
  options,
  showFilter = true,
  imageOnly = false,
  showPagination = true,
}: Props): ReactElement => {
  const { getCards, cards, pagination, stats, isLoading } = useCards(options)
  const filter = useFilter(getCards)
  const hasCards = cards.length > 0
  const isUpdating = isLoading && hasCards

  const results = `Showing ${30 * (pagination.page - 1) + 1} - 
  ${30 * pagination.page > pagination.total ? pagination.total : 30 * pagination.page} 
  of ${pagination.total} unique cards`

  return (
    <>
      <CardsContainer showFilter={showFilter}>
        {showPagination && <div>{results}</div>}
        {showPagination && <Pagination {...pagination} />}
        {showFilter && <Filter stats={stats} {...filter} />}
        <StyledGrid>
          {isLoading && !hasCards ? (
            <LoadingState>
              <LoadingPill>Loading cards...</LoadingPill>
            </LoadingState>
          ) : (
            cards.map((card) => <ImageOnly key={card.id} card={card} options={options} />)
          )}
          {isUpdating ? (
            <LoadingOverlay>
              <LoadingPill>Updating results...</LoadingPill>
            </LoadingOverlay>
          ) : null}
        </StyledGrid>
        <div />
        {showPagination && <Pagination {...pagination} />}
      </CardsContainer>
    </>
  )
}
