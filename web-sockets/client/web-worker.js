const sockets = (() => {
  let socket

  return {
    start: () => {
      socket = new WebSocket('ws://localhost:4000')

      socket.addEventListener('message', (event) => {
        postMessage({ type: 'message', payload: event.data })
      })
    },
    stop: () => {
      socket?.close()
      socket = undefined
    },
  }
})()

addEventListener('message', (event) => {
  if (event.data === 'start') sockets.start()
  else if (event.data === 'stop') sockets.stop()
})
