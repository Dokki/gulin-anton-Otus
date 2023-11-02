import ReactQuill from 'react-quill'
import { styled } from '@mui/system'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

const spacing = new Array(5).fill('').reduce((acc, cur, index) => {
  const i = index + 1

  return { ...acc, [i]: `${i * 8}px` }
}, {})

export const Editor = styled(ReactQuill)((props: { minHeight?: number }) => ({
  position: 'relative',

  '& .ql-toolbar': {
    borderRadius: '4px 4px 0 0',
  },

  '& .ql-container': {
    borderRadius: '0 0 4px 4px',
    minHeight: `${props.minHeight || 200}px`,
  },
}))
export const FocusBox = styled(Box)`
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border-radius: 4px;
  pointer-events: none;

  &.focused {
    outline: 2px solid #556cd6;
  }
`
export const Uploader = styled(Box)`
  position: relative;
  outline: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  margin-top: 8px;
  min-height: 100px;
  display: flex;

  &.dragging {
    outline: 2px dashed #556cd6;
    position: fixed;
    left: 10px;
    top: 0;
    right: 10px;
    bottom: 10px;
    z-index: 10;

    * {
      pointer-events: none;
    }
  }
`
export const DropArea = styled(Box)`
  color: #8f8f8f;
  text-align: center;
  pointer-events: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    45deg,
    rgb(255 255 255 / 7%) 25%,
    rgb(23 61 237 / 7%) 25%,
    rgb(23 61 237 / 7%) 50%,
    rgb(255 255 255 / 7%) 25% 50%,
    rgb(255 255 255 / 7%) 25% 75%,
    rgb(23 61 237 / 7%) 75%
  );
  background-size: 50px 50px;
`
export const ImageArea = styled(Box)`
  display: flex;
  flex-wrap: wrap;
`
export const Image = styled(Box)`
  border-radius: 4px;
  outline: 1px solid #ccc;
  width: 130px;
  height: 160px;
  margin-right: 7.5px;
  overflow: hidden;

  &.view {
    height: 130px;
  }

  &:hover {
    outline-color: #556cd6;
  }

  .img {
    display: block;
    height: 130px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    cursor: pointer;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }

  .tools {
    height: 30px;
    display: flex;
  }
`
export const UpdateButton = styled(Button)`
  border-radius: 0;
  width: 100px;
  height: 30px;
  font-size: 12px;
  line-height: 30px;
`
export const DeleteButton = styled(Button)`
  border-radius: 0;
  width: 30px;
  height: 30px;
  font-size: 12px;
  line-height: 30px;
  min-width: auto;
  max-width: 30px;
`
export const BlogItem = styled(Paper)`
  padding: 10px;
  margin-bottom: ${spacing[2]};
`
export const SimpleLink = styled('a')`
  color: rgba(0, 0, 0, 0.87);
  text-decoration: none;

  &:hover {
    color: rgba(0, 0, 0, 0.8);
    text-decoration: underline;
  }

  &:active {
    color: rgba(0, 0, 0, 1);
    position: relative;
    top: 1px;
  }
`
export const Comment = styled(Box)`
  margin: 10px auto;
  border: 1px solid #f5f5f5;
  border-radius: 4px;
`
export const CommentTitle = styled(Box)`
  font-style: italic;
  color: grey;
  padding: 8px;
  font-size: 13px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  position: relative;

  & a {
    margin-right: 8px;
  }
`
export const CommentBody = styled('div')`
  padding: 8px;

  & > :first-of-type {
    margin-top: 0;
  }

  & > :last-of-type {
    margin-bottom: 0;
  }
`
export const CourseButtonStart = styled(Box)`
  display: flex;
  padding: 20px;
  margin: 10px 0;
  border-radius: 4px;
  background: #ebffe7;
  flex-direction: column;
  border: 3px solid #ceffcb;
  font-size: 18px;
  align-items: center;

  button {
    font-size: 18px;
    margin-top: 10px;
    width: 100%;
  }
`
