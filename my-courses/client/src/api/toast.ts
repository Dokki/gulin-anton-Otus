import { toast, ToastOptions } from 'react-toastify'

const defOptions = {
  position: toast.POSITION.TOP_CENTER,
  autoClose: 5e3,
}

const toasts = {
  error: (text: string, options?: ToastOptions) =>
    toast.error(text, { ...defOptions, ...options }),
  success: (text: string, options?: ToastOptions) =>
    toast.success(text, { ...defOptions, ...options }),
  warning: (text: string, options?: ToastOptions) =>
    toast.warn(text, { ...defOptions, ...options }),
  info: (text: string, options?: ToastOptions) =>
    toast.info(text, { ...defOptions, ...options }),
}

export default toasts
