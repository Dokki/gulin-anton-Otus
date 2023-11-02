import React, { FC, useState } from 'react'
// @ts-ignore
import sanitize from 'insane/insane.js'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import CommentIcon from '@mui/icons-material/Comment'
import Settings from '@mui/icons-material/Settings'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import { TCourseData } from '../../../../shared/index.js'
import api from '../../api'
import { formatter } from '../../api/helpers'
import showToast from '../../api/toast'
import useModal from '../../hooks/useModal'
import { SimpleLink } from '../style'
import { goTo } from '../../App'

type TCourseView = {
  course: TCourseData['course']
  isOwner?: boolean
  asPreview?: boolean
}

const Course: FC<TCourseView> = ({
  course,
  isOwner = false,
  asPreview = false,
}) => {
  const navigate = useNavigate()
  const { id, owner, date, commentsCount } = course
  const isShowManage = isOwner && !asPreview
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { WrappedComponent: ConfirmDelete, openModal } = useModal({
    title: 'Внимание',
    text: 'Вы точно хотите удалить курс?',
    actions: [
      { text: 'Нет', isCancel: true },
      {
        text: 'Да',
        onClick: async ({ closeModal }) => {
          const { ok, message } = await api.deleteCourse(id as string)

          if (ok) {
            navigate('/courses/my')
            showToast.success('Курс удален')
          } else {
            closeModal()
            showToast.error(message)
          }
        },
      },
    ],
  })
  const setMenu = (target: null | HTMLElement = null) => setAnchorEl(target)
  const onEdit = () => {
    setMenu(null)

    navigate(`/course/edit/${id}`)
  }
  const onDelete = async () => {
    setMenu(null)
    openModal()
  }

  const created = formatter.format(date)

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {asPreview ? (
          <SimpleLink href={`/course/${id}`} onClick={goTo(`/course/${id}`)}>
            {course.title}
          </SimpleLink>
        ) : (
          course.title
        )}
      </Typography>
      <Typography fontStyle="italic" color="grey" fontSize={12} gutterBottom>
        {isShowManage && (
          <Box ml="auto">
            <IconButton
              size="small"
              sx={{ float: 'right' }}
              onClick={(event) => setMenu(event.currentTarget)}
            >
              <Settings fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setMenu(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={onEdit}>Редактировать</MenuItem>
              <MenuItem onClick={onDelete}>Удалить</MenuItem>
            </Menu>
            <ConfirmDelete />
          </Box>
        )}
        {created},{' '}
        <a href={`mailto:${owner?.email}`}>
          {owner?.lastName} {owner?.firstName}
        </a>
      </Typography>
      <div
        dangerouslySetInnerHTML={{ __html: sanitize(course.introduction) }}
      />
      {asPreview && (
        <Box sx={{ display: 'flex' }}>
          <CommentIcon color="primary" sx={{ marginRight: 1 }} />{' '}
          {commentsCount}
          <SimpleLink
            href={`/course/${id}`}
            onClick={goTo(`/course/${id}`)}
            sx={{ marginLeft: 'auto' }}
          >
            Читать далее
          </SimpleLink>
        </Box>
      )}
    </Box>
  )
}

export default Course
