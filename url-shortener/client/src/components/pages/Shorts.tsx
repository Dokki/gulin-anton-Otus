import React, { FC, useCallback, useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Pagination from '@mui/material/Pagination'
import Content from '../elements/Content'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

import { TShortsData } from '../../../../shared'
import { useContextStore, setPage } from 'store'
import Short from '../elements/Short'
import { ShortItem } from '../style'
import api from 'api'

const Shorts: FC = () => {
  const currentMenu = useContextStore((store) => store.menu)
  const currentPage = useContextStore((store) => store.page)
  const [loading, setLoading] = useState<boolean>(false)
  const [{ shorts = [], total, page }, setContext] = useState<TShortsData>({
    shorts: [],
    total: 0,
    page: currentPage || 1,
  })
  const loadShorts = (pageLocal: number) => {
    setLoading(true)
    api
      .getShorts(pageLocal)
      .then((context: TShortsData) => {
        setContext(context)
      })
      .finally(() => setLoading(false))
  }

  const onPagination = useCallback(
    (event: unknown, pageLocal: number) => {
      window.scrollTo(0, 0)

      loadShorts(pageLocal > 1 ? pageLocal : 0)

      setPage(currentMenu, pageLocal > 1 ? pageLocal : 1)
    },
    [total, page],
  )

  const onDelete = useCallback(() => {
    if (shorts.length - 1 === 0 && currentPage > 1) {
      onPagination({}, currentPage - 1)
    } else onPagination({}, currentPage)
  }, [shorts, currentPage])

  useEffect(() => {
    onPagination({}, currentPage)
  }, [currentPage])

  if (!shorts.length) {
    return (
      <Content>
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.200' }}>
          <Typography variant="h6" gutterBottom>
            Тут пусто
          </Typography>
          <Typography>Вы можете создать укороченные ссылки.</Typography>
        </Paper>
      </Content>
    )
  }

  return (
    <Content>
      {shorts.map((short) => (
        <ShortItem key={short.id} elevation={3}>
          <Short short={short} isView onDelete={onDelete} />
        </ShortItem>
      ))}
      {total && total > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={total}
            page={page}
            disabled={loading}
            variant="outlined"
            shape="rounded"
            size="large"
            showFirstButton
            showLastButton
            onChange={onPagination}
          />
        </Box>
      )}
    </Content>
  )
}

export default Shorts
