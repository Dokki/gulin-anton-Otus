import React, { FC, PropsWithChildren } from 'react'
import Container from '@mui/material/Container'

const Content: FC<PropsWithChildren> = ({ children }) => (
  <Container maxWidth="lg">{children}</Container>
)

export default Content
