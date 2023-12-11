import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { styled, keyframes } from '@mui/system'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

export const copiedTime = 2000

const spacing = new Array(5).fill('').reduce((acc, cur, index) => {
  const i = index + 1

  return { ...acc, [i]: `${i * 8}px` }
}, {})
const copiedKeyframes = keyframes`
  0% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  100% {
    opacity: 0;
    transform: translate3d(10px, 0, 0);
  }
`

export const NotFoundContainer = styled(Container)`
  font-weight: 700;
  text-align: center;
  padding: 50px 0;

  div {
    font-size: 32px;
    padding-bottom: 15px;
  }
`
export const ShortFormWrapper = styled(Box)`
  margin: 10px 0;
  padding: 30px 40px;
  background: #ffffff;
  border-radius: 16px;
  border: 3px #e8e9eb solid;
`
export const SloganTop = styled(Typography)`
  font-weight: 700;
  text-align: center;
  padding: 20px 0 20px 0;
`
export const SloganBottom = styled(Typography)`
  color: #56575b;
  text-align: center;
  padding: 0 0 40px 0;
`
export const FormTitle = styled(Typography)`
  font-weight: 700;
  padding: 0 0 5px 0;
`
export const ShortWrapper = styled(Box)`
  padding: 15px;
`
export const ShortViewWrapper = styled(Box)`
  display: flex;
`
export const ShortInfo = styled(Box)`
  padding-top: 3px;
  line-height: 26px;
  padding-left: 28px;
  font-size: 14px;

  span {
    font-weight: bold;
  }
`
export const CopiedText = styled(Box)`
  display: inline-block;
  font-size: 14px;
  color: grey;
  opacity: 0;

  &.copied {
    animation: ${copiedKeyframes} ${copiedTime / 1000}s
      cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`
export const ShortItem = styled(Paper)`
  padding: 10px;
  margin-bottom: ${spacing[2]};
`
