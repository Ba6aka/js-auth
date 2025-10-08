const { MongoClient } = require('mongodb')
const { Server } = require('http')
const { createReadStream, readFileSync, writeFileSync } = require('fs')
// const users = []
const path = 'data/users.json'
let db, usersCollection, allUsers
const connectionString = 'mongodb+srv://ba6aka:zalupa@cluster0.zkbmsbi.mongodb.net/'
const client = new MongoClient(connectionString)
const dbName = 'registartionAPP'

// loadUsers()

connectDB().then(async () => {
  db = client.db(dbName)
  usersCollection = db.collection('users')
  allUsers = await usersCollection.find().toArray()
  runServer(999, handleRequest)
})

async function connectDB() {
  await client.connect()
  console.log('Connected to MongoDB Atlas')
}

function runServer(port, handler) {
  const server = new Server()

  server.on('request', handler)
  server.listen(port, () => console.log('http://localhost:' + port))
}

function handleRequest(request, response) {

  if (request.url.startsWith('/api/')) {
    handleAPI(request, response, db)
  } else {
    serveStatic(request, response)
  }
}

function serveStatic(request, response) {
  const path = "public/" + (request.url.slice(1) || "index.html")

  createReadStream(path).on('error', handle404(response)).pipe(response)
}

function handleAPI(request, response) {
  const route = request.url.slice(5)

  if (request.method == 'GET') handleGetAPI(request, route, response)
  if (request.method == 'POST') handlePostAPI(request, response, route)
}

function handleGetAPI(request, route, response) {
  if (route == 'users') {
    const usersStream = createReadStream(path)
    usersStream.pipe(response)
  }

  else if (route == 'current-user') {
    createReadStream('data/current-user.json').pipe(response)
  }
}

function handle404(response) {
  return () => response.writeHead('404').end('file not found')
}

async function getBody(stream) {
  let body = ''

  for await (const chunk of stream) body += chunk

  try { body = JSON.parse(body) } catch { }

  return body
}

async function checkUser({ login, password }) {
  const user = await usersCollection.findOne({ login, password })
  return user
}

async function handlePostAPI(request, response, route) {
  if (route == 'user') {
    const newUser = await getBody(request)

    if (await isOccupied(newUser.login)) {
      response.end('occupied')
    }
    else {
      await usersCollection.insertOne(newUser);
      allUsers.push(newUser)
      saveUsers()
      response.end('registered')
    }
  }

  else if (route == 'log-in') {
    const credentials = await getBody(request)
    const user = await checkUser(credentials)

    if (user) {
      const token = generateToken()
      user.token = token

      response.end(token)
      usersCollection.updateOne(
        { _id: user._id },
        { $set: user }
      )
    }
    else {
      response.statusCode = 401
      response.end()
    }
  }

  else if (route == 'auth') {
    const token = await getBody(request)
    const userObject = await recognizeToken(token)

    response.end(userObject?.login || '')
  }

  else if (route == "log-out") {
    const token = await getBody(request)
    const user = await usersCollection.findOne({ token })
    user.token = ''
    usersCollection.updateOne(
      { _id: user._id },
      { $set: user }
    )
  }
}

async function isOccupied(login) {
  return allUsers.some(u => u.login == login)
}

function generateToken() {
  let token = ''
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  for (let i = 0; i < 27; i++) {
    token += chars[Math.floor(Math.random() * 62)]
  }

  return token
}

function recognizeToken(token) {
  return usersCollection.findOne({ token })
}