import React, { FC } from 'react'
import Box from '@mui/material/Box'

const Index: FC = () => {
  return (
    <Box>
      <Box
        sx={{
          background:
            'linear-gradient(90deg, rgb(166, 79, 197), rgb(79, 84, 230))',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '330px',
            padding: '15px 0px',
            textAlign: 'center',
          }}
        >
          <Box
            component="h2"
            sx={{
              color: 'rgb(255, 255, 255)',
              fontSize: '50px',
              lineHeight: '60px',
              fontWeight: '300',
              textShadow: 'rgba(5, 5, 5, 0.28) 1px 1px 0px',
            }}
          >
            Авторские онлайн‑курсы для профессионалов
          </Box>
          <Box
            sx={{
              color: 'rgb(255, 255, 255)',
              paddingTop: '25px',
              fontSize: '22px',
              lineHeight: '24px',
              display: 'block',
            }}
          >
            Цифровые навыки от ведущих экспертов
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Index
