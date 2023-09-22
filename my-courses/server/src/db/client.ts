import { MongoClient, Db } from 'mongodb'

const host = process.env.DOCKER ? 'mongo' : '127.0.0.1'
const url = `mongodb://${host}:27017`
const dbName = 'myCourses'

export class MongoDB {
  connected = false
  client: MongoClient
  db: Db

  constructor() {
    this.client = new MongoClient(url)
    this.client.on('open', () => (this.connected = true))
    this.client.on('topologyClosed', () => (this.connected = false))
    this.client.connect().catch((err) => {
      throw new Error(err)
    })
    this.db = this.client.db(dbName)
  }

  async connect() {
    if (this.connected) return

    try {
      await this.client.connect()
      this.db = this.client.db(dbName)
    } catch (err) {
      throw new Error(err as string)
    }
  }

  async admin() {
    await this.connect()

    return this.client.db().admin()
  }

  async getDb() {
    await this.connect()

    return this.db
  }

  async close() {
    if (!this.connected) return

    try {
      await this.client.close()
    } catch (err) {
      throw new Error(err as string)
    }
  }
}

export default {
  MongoDB,
  dbName,
}
