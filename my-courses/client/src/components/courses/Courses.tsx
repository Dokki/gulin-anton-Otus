import React, { FC, ChangeEvent, useCallback } from 'react'
// @ts-ignore
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Pagination from '@mui/material/Pagination'
import {
  useLoaderData,
  useNavigation,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import CourseView from './CourseView'
import Content from '../elements/Content'
import { BlogItem } from '../style'
import { TCoursesData } from '../../../../shared/index.js'

const Courses: FC = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const navigation = useNavigation()
  const { courses = [], total, page } = useLoaderData() as TCoursesData
  const onPagination = useCallback(
    (event: ChangeEvent<unknown>, pageLocal: number) => {
      let search = ''

      if (pageLocal > 1) search += `?page=${pageLocal}`

      window.scrollTo(0, 0)

      navigate({
        pathname,
        search,
      })
    },
    [total, page],
  )

  if (!courses.length) {
    return (
      <Content>
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.200' }}>
          <Typography variant="h6" gutterBottom>
            Тут пусто
          </Typography>
          <Typography>Вы можете создать курс.</Typography>
        </Paper>
      </Content>
    )
  }

  return (
    <Content>
      {courses.map((course, index) => (
        <BlogItem key={index} elevation={3}>
          <CourseView course={course} asPreview={true} />
        </BlogItem>
      ))}
      {total && total > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={total}
            page={page}
            disabled={navigation.state === 'loading'}
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

export default Courses
