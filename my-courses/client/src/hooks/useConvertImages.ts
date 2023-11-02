import { useEffect, Dispatch, SetStateAction } from 'react'
import { TImagesResult, TImagesResultLoader } from '../../../shared/index.js'
import { ImageListType } from 'react-images-uploading'
import { baseURL } from '../api'

const promise = ({ name, uuidName }: TImagesResult) =>
  new Promise<TImagesResultLoader>((resolve, reject) => {
    fetch(`${baseURL}images/${uuidName}`)
      .then(async (res) => {
        const blob = await res.blob()
        const reader = new FileReader()

        reader.onloadend = () => {
          resolve({
            dataURL: reader.result as string,
            isUploaded: true,
            name,
            uuidName,
          })
        }
        reader.readAsDataURL(blob)
      })
      .catch(reject)
  })

export const useConvertImages = (
  images: TImagesResult[] = [],
  setImages: Dispatch<SetStateAction<ImageListType>>,
) => {
  useEffect(() => {
    const convert = async () => {
      const result = await Promise.all(images.map((image) => promise(image)))

      setImages(result)
    }

    if (images.length) convert()
  }, [])
}
