export default () => {
  const host = process.env.DOCKER ? 'mongo' : process.env.HOST
  const port = process.env.DOCKER ?  27017 : parseInt(process.env.PORT, 10)
  const table = process.env.DOCKER ? 'nest' : process.env.TABLE

  return {
    host,
    port: port || 27017,
    table,
  }
}
