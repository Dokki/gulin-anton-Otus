import React, {
  FC,
  FormEvent,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react'
import { useNavigate, useLoaderData, useParams } from 'react-router-dom'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import Lightbox from 'yet-another-react-lightbox'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import Content from '../elements/Content'
import api from '../../api'
import { useConvertImages } from '../../hooks/useConvertImages'
import showToast from '../../api/toast'
import {
  BlogItem,
  Editor,
  FocusBox,
  Uploader,
  DropArea,
  ImageArea,
  Image,
  UpdateButton,
  DeleteButton,
} from '../style'
import {
  TCourseData,
  TImagesResultLoader,
  TOwner,
} from '../../../../shared/index.js'
import 'react-quill/dist/quill.snow.css'
import 'yet-another-react-lightbox/styles.css'

const maxImages = 5
const isEmptyEditor = (value: string) =>
  !value || value === '<p><br></p>' || value === '<p></p>'

const AddUpdateCourse: FC = () => {
  const params = useParams()
  const navigate = useNavigate()
  const isEdit = !!params.id
  const { accept, ok, course } = useLoaderData() as TCourseData
  const [title, setTitle] = useState(course?.title || '')
  const [introduction, setIntroduction] = useState(course?.introduction || '')
  const [description, setDescription] = useState(course?.description || '')
  const [focused, setFocus] = useState({ i: 0, d: 0 })
  const [errors, setErrors] = useState<string[]>([])
  const [images, setImages] = useState<ImageListType>([])
  const [deletedImages, setDeletedImages] = useState<TImagesResultLoader[]>([])
  const [lightBoxIndex, setLightBoxIndex] = useState(-1)
  const [options, setOptions] = useState<TOwner[]>([])
  const [accessValue, setAccessValue] = useState<Partial<TOwner>[]>(
    course?.access || [],
  )

  useEffect(() => {
    const fn = async () => {
      const users = await api.getUsers()

      setOptions(users)
    }

    fn()
  }, [])

  const disabled = useMemo(() => {
    return !title || isEmptyEditor(introduction) || isEmptyEditor(description)
  }, [title, introduction, description])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      if (disabled) return

      event.preventDefault()

      const data = new FormData(event.currentTarget)

      data.append(
        'access',
        JSON.stringify(
          accessValue.map(({ id, firstName, lastName }) => ({
            id,
            firstName,
            lastName,
          })),
        ),
      )

      images.forEach((image) => {
        if (!image.isUploaded) data.append('images', image.file as Blob)
      })

      data.append(
        'deletedImages',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        JSON.stringify(deletedImages.map(({ dataURL, ...image }) => image)),
      )

      const {
        ok: resOk,
        message,
        images: imgErrors,
        id,
      } = await api.addUpdateCourse(data, params.id)

      if (Array.isArray(imgErrors) && imgErrors.length) {
        showToast.info(
          `Некоторые картинки не загружены: ${imgErrors.join(', ')}`,
        )
      }

      if (resOk) navigate(`/course/${id}`)
      else if (message) setErrors([message])
    },
    [disabled, accessValue, images, deletedImages],
  )
  const onChangeImages = (newImages: ImageListType) => {
    setImages((oldImages) => {
      oldImages.forEach((oImage) => {
        if (oImage.isUploaded) {
          const index = newImages.findIndex(
            (nImage) => oImage.uuidName === nImage.uuidName,
          )

          if (index < 0)
            setDeletedImages((prev) => [...prev, oImage as TImagesResultLoader])
        }
      })

      return newImages
    })
  }
  const onFocus = (state: { i?: number; d?: number }) =>
    setFocus((oldState) => ({
      ...oldState,
      ...state,
    }))
  const goBack = () => {
    if (history.length) history.back()
    else navigate('/courses/my')
  }

  useEffect(() => {
    if (!ok) {
      showToast.warning('Курс не доступен')
      navigate('/')
    }
  }, [])

  useConvertImages(course?.images, setImages)

  return (
    <Content>
      <BlogItem elevation={3}>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h4" component="h1">
            {isEdit ? 'Обновить' : 'Создать'} курс
          </Typography>
          <TextField
            label="Название курса"
            margin="normal"
            name="title"
            value={title}
            required
            fullWidth
            autoFocus
            onChange={(event) => setTitle(event.currentTarget.value)}
          />
          <Box mb={1} position="relative">
            <Editor
              placeholder="Введите короткое описание курса *"
              value={introduction}
              onFocus={() => onFocus({ i: 1 })}
              onBlur={() => onFocus({ i: 0 })}
              onChange={setIntroduction}
            />
            <FocusBox className={focused.i === 1 ? 'focused' : ''} />
            <input name="introduction" type="hidden" value={introduction} />
          </Box>
          <Box mb={1} position="relative">
            <Editor
              placeholder="Введите описание курса *"
              value={description}
              onFocus={() => onFocus({ d: 1 })}
              onBlur={() => onFocus({ d: 0 })}
              onChange={setDescription}
            />
            <FocusBox className={focused.d === 1 ? 'focused' : ''} />
            <input name="description" type="hidden" value={description} />
          </Box>
          <Autocomplete
            sx={{ width: '100%' }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName}`
            }
            options={options}
            value={accessValue}
            onChange={(event, value) => setAccessValue(value)}
            filterSelectedOptions
            multiple
            renderInput={(inputParams) => (
              <TextField
                {...inputParams}
                label="Пользователи которые имеют доступ к курсу"
              />
            )}
          />
          <Box>
            <ImageUploading
              multiple
              value={images}
              maxNumber={maxImages}
              acceptType={accept}
              onChange={onChangeImages}
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
                errors: imgErrors,
              }) => (
                <Box>
                  <Uploader
                    className={isDragging ? 'dragging' : ''}
                    {...dragProps}
                  >
                    {(imageList.length === 0 || isDragging) && (
                      <DropArea>
                        {isDragging && (
                          <Box>
                            <CloudUploadIcon
                              color="primary"
                              sx={{ width: '64px', height: '64px' }}
                            />
                          </Box>
                        )}
                        {imageList.length === 0 && !isDragging && (
                          <Box>Пусто</Box>
                        )}
                        Можете кинуть сюда {maxImages} картинок
                      </DropArea>
                    )}
                    {!isDragging && (
                      <ImageArea>
                        {imageList.map((image, index) => (
                          <Image key={index}>
                            <Box
                              className="img"
                              title={image?.file?.name}
                              sx={{ backgroundImage: `url(${image.dataURL})` }}
                              onClick={() => setLightBoxIndex(index)}
                            />
                            <Box color="tools">
                              <UpdateButton
                                aria-label="update"
                                variant="contained"
                                color="secondary"
                                size="small"
                                startIcon={<FileUploadIcon />}
                                onClick={() => onImageUpdate(index)}
                              >
                                Заменить
                              </UpdateButton>
                              <DeleteButton
                                className="delete"
                                aria-label="delete"
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => onImageRemove(index)}
                              >
                                <DeleteIcon fontSize="small" />
                              </DeleteButton>
                            </Box>
                          </Image>
                        ))}
                      </ImageArea>
                    )}
                    {imageList.length > 0 && (
                      <Lightbox
                        open={lightBoxIndex >= 0}
                        index={lightBoxIndex}
                        close={() => setLightBoxIndex(-1)}
                        slides={imageList.map((image) => ({
                          src: image.dataURL as string,
                          alt: image?.file?.name,
                        }))}
                        styles={{
                          container: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
                        }}
                        controller={{ closeOnBackdropClick: true }}
                      />
                    )}
                  </Uploader>
                  {!!imgErrors && (
                    <Box sx={{ color: 'red', margin: '8px 0' }}>
                      {imgErrors.maxNumber && (
                        <span>
                          Количество выбранных изображений превышает
                          максимальное число
                        </span>
                      )}
                      {imgErrors.acceptType && (
                        <span>Выбранный вами тип файла недопустим</span>
                      )}
                      {imgErrors.maxFileSize && (
                        <span>
                          Размер выбранного файла превышает максимальное число
                        </span>
                      )}
                      {imgErrors.resolution && (
                        <span>
                          Выбранный файл не соответствует желаемому разрешению
                        </span>
                      )}
                    </Box>
                  )}
                  {errors.length > 0 &&
                    errors.map((error) => (
                      <Box key={error} sx={{ color: 'red' }}>
                        {error}
                      </Box>
                    ))}
                  <Box mt={1}>
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      startIcon={<FileUploadIcon />}
                      disabled={imageList.length >= maxImages}
                      onClick={onImageUpload}
                    >
                      Выбрать
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      sx={{ ml: 1 }}
                      disabled={imageList.length === 0}
                      onClick={onImageRemoveAll}
                    >
                      Удалить всё
                    </Button>
                  </Box>
                </Box>
              )}
            </ImageUploading>
          </Box>
          <Box
            sx={{
              mt: '-33px',
              mb: 2,
              display: 'flex',
              justifyContent: 'right',
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              sx={{ marginRight: '8px' }}
              onClick={goBack}
            >
              {isEdit ? 'Отменить' : 'Назад'}
            </Button>
            <Button type="submit" variant="contained" disabled={disabled}>
              {isEdit ? 'Обновить' : 'Создать'}
            </Button>
          </Box>
        </Box>
      </BlogItem>
    </Content>
  )
}

export default AddUpdateCourse
