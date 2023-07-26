import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import { ToastProvider } from '../../../providers'
import { Navbar } from '../navigation/Navbar'

const PageContainer = styled.div(() => ({
  width: '100%',
  position: 'relative',
}))

const StyledPage = styled.div(({ theme, isMobile }) => ({
  width: '100%',
  margin: ' auto',
  maxWidth: '1400px',
  padding: isMobile ? `0 ${theme.spaceScale(2)}` : `0 ${theme.spaceScale(4)}`,
}))
interface PageProps {
  children: Array<ReactElement> | ReactElement
}

export const Page = ({ children }: PageProps): ReactElement => {
  const isMobile = useMediaQuery({ maxWidth: 650 })
  return (
    <ToastProvider>
      <PageContainer>
        <Navbar />
        <StyledPage isMobile={isMobile}>{children}</StyledPage>
      </PageContainer>
    </ToastProvider>
  )
}
