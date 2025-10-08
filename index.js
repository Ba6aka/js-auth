const { MongoClient } = require('mongodb')
const { runServer } = require('./server/run-server.js')
const { handleRequest } = require('./server/handlers/handle-request.js')

let db, usersCollection, allUsers
const connectionString = 'mongodb+srv://ba6aka:zalupa@cluster0.zkbmsbi.mongodb.net/'
const client = new MongoClient(connectionString)
const dbName = 'registartionAPP'

client.connect().then(console.log('Connected to MongoDB Atlas')).then(async () => {
  db = client.db(dbName)
  runServer(999, handleRequest(db))
})