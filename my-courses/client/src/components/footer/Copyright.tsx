import * as React from 'react'
import Typography from '@mui/material/Typography'
import Content from '../elements/Content'

const Copyright = () => {
  return (
    <Content>
      <Typography
        variant="body2"
        color="text.secondary"
        minHeight="100px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {'Copyright © iDokki '} {new Date().getFullYear()}.
      </Typography>
    </Content>
  )
}

export default Copyright
