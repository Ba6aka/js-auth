try { require("./env.js") } catch { }

const { MongoClient } = require('mongodb')
const { runServer } = require('./server/run-server.js')
const { handleRequest } = require('./server/handlers/handle-request.js')

const { DB_USER, DB_PWD, PORT } = process.env
let db, usersCollection, allUsers
const connectionString = `mongodb+srv://${DB_USER}:${DB_PWD}@cluster0.zkbmsbi.mongodb.net/`
const client = new MongoClient(connectionString)
const dbName = 'registartionAPP'

client.connect().then(console.log('Connected to MongoDB Atlas')).then(async () => {
  db = client.db(dbName)
  runServer(PORT || 999, handleRequest(db))
})