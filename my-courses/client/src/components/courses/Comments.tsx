import React, { FC, useState, useEffect } from 'react'
import { styled } from '@mui/system'
// @ts-ignore
import sanitize from 'insane/insane.js'
import { useLocation } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import showToast from '../../api/toast'
import useModal from '../../hooks/useModal'
import { TCourse } from '../../../../shared/index.js'
import { useAuthStore, useContentLoader } from '../../store'
import { shallow } from 'zustand/shallow'
import { formatter, scrollTo } from '../../api/helpers'
import api from '../../api/index'
import {
  BlogItem,
  Editor,
  FocusBox,
  Comment,
  CommentTitle,
  CommentBody,
  SimpleLink,
} from '../style'

const Close = styled(IconButton)`
  position: absolute;
  right: 0;
  top: 0;
`

const Comments: FC<{ course: TCourse }> = ({ course }) => {
  const { hash } = useLocation()
  const { isAuth } = useAuthStore(({ token }) => ({ isAuth: !!token }), shallow)
  const [comments, setComments] = useState(course.comments || [])
  const [text, setText] = useState('')
  const [focused, setFocus] = useState(0)
  const disabled = useContentLoader((state) => state.isShow)
  const { WrappedComponent: ConfirmDelete, openModal } = useModal({
    title: 'Внимание',
    text: 'Вы точно хотите удалить комментарий?',
    actions: [
      { text: 'Нет', isCancel: true },
      {
        text: 'Да',
        onClick: async ({ closeModal }, id) => {
          const { ok } = await api.deleteComment(id as string)

          if (ok) {
            setComments((oldComments) =>
              oldComments.filter((comment) => comment.id !== id),
            )

            closeModal()
            showToast.success('Комментарий удален')
          }
        },
      },
    ],
  })

  useEffect(() => {
    scrollTo(hash)
  }, [])

  const submitComment = async () => {
    const data = await api.addComment(course.id as string, text)

    if (data.ok) {
      setComments((oldComments) => [...oldComments, data.comment])

      setText('')
    }
  }

  return (
    <BlogItem elevation={3}>
      {isAuth && (
        <>
          <Box mb={1} position="relative">
            <Editor
              placeholder="Введите комментарий для курса *"
              value={text}
              minHeight={100}
              readOnly={disabled}
              onFocus={() => setFocus(1)}
              onBlur={() => setFocus(0)}
              onChange={setText}
            />
            <FocusBox className={focused === 1 ? 'focused' : ''} />
          </Box>
          <Box mt={1} textAlign="right">
            <Button
              variant="contained"
              disabled={disabled}
              onClick={submitComment}
            >
              Добавить комментарий
            </Button>
          </Box>
        </>
      )}
      {comments.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Комментарии
          </Typography>
          <Divider />
          {comments.map((comment) => (
            <Comment id={`#comment-${comment.id}`} key={comment.id}>
              <CommentTitle>
                <a href={`mailto:${comment.owner.email}`}>
                  {comment.owner.firstName} {comment.owner.lastName}
                </a>
                <SimpleLink href={`#comment-${comment.id}`}>
                  {formatter.format(comment.date)}
                </SimpleLink>
                {comment.owner.is && (
                  <Close size="small" onClick={() => openModal(comment.id)}>
                    <CloseIcon />
                  </Close>
                )}
              </CommentTitle>
              <CommentBody
                dangerouslySetInnerHTML={{ __html: sanitize(comment.text) }}
              />
            </Comment>
          ))}
        </>
      )}
      {comments.length === 0 && (
        <Paper
          elevation={0}
          sx={{ p: 2, bgcolor: 'grey.200', textAlign: 'center', mt: 2 }}
        >
          <Typography variant="h6" gutterBottom>
            Нет ни одного комментария
          </Typography>
          {isAuth && <Typography>Вы можете добавить один!</Typography>}
        </Paper>
      )}
      <ConfirmDelete />
    </BlogItem>
  )
}

export default Comments
