const onClick = (id, callback) =>
  document.getElementById(id).addEventListener('click', callback)
const render = (text) => (document.getElementById('result').innerText = text)

;(async () => {
  onClick('test-api', async () => {
    try {
      const response = await fetch('/api')
      const { text } = await response.json()

      render(text)
    } catch (error) {
      render(error.message)
      // eslint-disable-next-line no-console
      console.error('Something wrong', error)
    }
  })
})()
