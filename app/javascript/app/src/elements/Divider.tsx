import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledDivider = styled.div(({ padding }) => ({
  margin: '0 auto',
  paddingTop: padding,
  paddingBottom: padding,
  width: '50%',
}))

const DividerLine = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.color.gray[8]};
`

export const Divider = ({ withLine = false, padding = '1rem' }) => (
  <StyledDivider withLine={withLine} padding={padding}>
    {withLine && <DividerLine />}
  </StyledDivider>
)

Divider.propTypes = {
  padding: PropTypes.string,
  withLine: PropTypes.bool,
}
