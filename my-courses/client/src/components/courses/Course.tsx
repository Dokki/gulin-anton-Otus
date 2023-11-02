import React, { FC, useState } from 'react'
// @ts-ignore
import sanitize from 'insane/insane.js'
import { useLoaderData } from 'react-router-dom'
import Lightbox from 'yet-another-react-lightbox'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Content from '../elements/Content'
import { TCourseData } from '../../../../shared/index.js'
import { baseURL } from '../../api'
import CourseView from './CourseView'
import Comments from './Comments'
import { Image, ImageArea, BlogItem, CourseButtonStart } from '../style'
import { useAuthStore } from '../../store'
import { shallow } from 'zustand/shallow'
import 'yet-another-react-lightbox/styles.css'

const Course: FC = () => {
  const { id } = useAuthStore((store) => ({ id: store.id }), shallow)
  const [lightBoxIndex, setLightBoxIndex] = useState(-1)
  const { ok, message, course, isOwner } = useLoaderData() as TCourseData
  const isAccessed = course.access.some((user) => user.id === id)

  if (!ok) {
    return (
      <Content>
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.200' }}>
          <Typography variant="h6" gutterBottom>
            {message}
          </Typography>
          <Typography>Возможно курс был удален.</Typography>
        </Paper>
      </Content>
    )
  }

  return (
    <Content>
      <BlogItem elevation={3}>
        <CourseView course={course} isOwner={isOwner} />
        <div
          dangerouslySetInnerHTML={{ __html: sanitize(course.description) }}
        />
        {(isOwner || isAccessed) && (
          <CourseButtonStart>
            Вам доступен этот курс!
            <Button
              variant="contained"
              color="success"
              onClick={() => alert('И тут начинается курс!')}
            >
              Начать!
            </Button>
          </CourseButtonStart>
        )}
        {course.images.length > 0 && (
          <>
            <Typography
              color="grey"
              gutterBottom
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              Медия
            </Typography>
            <ImageArea>
              {course.images.map(({ name, uuidName }, index) => (
                <Image className="view" key={index}>
                  <img
                    className="img"
                    src={`${baseURL}images/${uuidName}`}
                    alt={name}
                    title={name}
                    onClick={() => setLightBoxIndex(index)}
                  />
                </Image>
              ))}
            </ImageArea>
          </>
        )}
        {course.images.length > 0 && (
          <Lightbox
            open={lightBoxIndex >= 0}
            index={lightBoxIndex}
            close={() => setLightBoxIndex(-1)}
            slides={course.images.map(({ name, uuidName }) => ({
              src: `${baseURL}images/${uuidName}`,
              alt: name,
            }))}
            styles={{ container: { backgroundColor: 'rgba(0, 0, 0, 0.8)' } }}
            controller={{ closeOnBackdropClick: true }}
          />
        )}
      </BlogItem>
      <Comments course={course} />
    </Content>
  )
}

export default Course
