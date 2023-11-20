const statuses = {
  denied: 'denied',
  granted: 'granted',
  default: 'default',
}

const onClick = (id, callback) =>
  document.getElementById(id).addEventListener('click', callback)

;(async () => {
  const { permission = statuses.denied } = Notification || {}

  if (permission === statuses.denied) return

  const status =
    permission !== statuses.granted
      ? await Notification.requestPermission()
      : statuses.granted

  if (status !== statuses.granted) return

  const webWorker = new Worker('web-worker.js')

  onClick('start', () => {
    webWorker.postMessage('start')
  })

  onClick('stop', () => {
    webWorker.postMessage('stop')
  })

  let notification

  webWorker.addEventListener('message', (event) => {
    if (event.data.type !== 'message') return

    const {
      data: { payload },
    } = event

    if (notification) {
      notification?.close()
      notification = undefined
    }

    notification = new Notification(payload)

    setTimeout(() => {
      notification?.close()
      notification = undefined
    }, 3000)
  })
})()
