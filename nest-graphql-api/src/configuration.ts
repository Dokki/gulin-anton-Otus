export default () => {
  const host = process.env.HOST
  const port = parseInt(process.env.PORT, 10)
  const table = process.env.TABLE

  return {
    host,
    port: port || 27017,
    table,
  }
}
