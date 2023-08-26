import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { Filter } from '../filter'
import { Minimal, ImageOnly } from './card'
import { Pagination } from '../page'
import { useFilter, useCards } from '../../../hooks'

const CardsContainer = styled.section(({ theme, showFilter }) => ({
  display: 'grid',
  gridTemplateColumns: !showFilter ? `1fr` : `${theme.spaceScale(12)} 1fr`,
  gridTemplateRows: 'auto',
  gridGap: '1rem',
}))

const StyledGrid = styled.div(({ theme }) => ({
  display: 'grid',
  gridGap: theme.spaceScale(3),
  gridTemplateColumns: `repeat(auto-fill, minmax(16rem, 1fr))`,
  gridAutoRows: '26rem',
  justifyItems: 'center',
  alignItems: 'start',
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
          {isLoading ? (
            <h1>...Loading!</h1>
          ) : (
            cards.map((card) => <ImageOnly key={card.id} card={card} options={options} />)
          )}
        </StyledGrid>
        <div />
        {showPagination && <Pagination {...pagination} />}
      </CardsContainer>
    </>
  )
}
