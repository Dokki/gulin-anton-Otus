const onSubmitTodo = (e) => {
  const data = new FormData(e.target)
  const title = data.get('title')

  if (!title) {
    e.preventDefault()
    return false
  }
}