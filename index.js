const { MongoClient } = require('mongodb')
const { Server } = require('http')
const { createReadStream, readFileSync, writeFileSync } = require('fs')
const { Readable, Stream } = require('stream')
const users = []
const path = 'data/users.json'

// Your Atlas connection string
const connectionString = 'mongodb+srv://ba6aka:zalupa@cluster0.zkbmsbi.mongodb.net/'

// Create client
const client = new MongoClient(connectionString)
const dbName = 'registartionAPP'
async function connectDB() {
  await client.connect()
  console.log('Connected to MongoDB Atlas')
  return client.db(dbName)
}

(async () => {
  loadUsers()
  const db = await connectDB()
  runServer(999, (req, res) => handleRequest(req, res, db))
})()

function runServer(port, handler) {
  const server = new Server()

  server.on('request', handler)
  server.listen(port, () => console.log('http://localhost:' + port))
}

function handleRequest(request, response, db) {

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

function handleAPI(request, response, db) {
  const route = request.url.slice(5)
  const users = db.collection('users')

  if (request.method == 'GET') handleGetAPI(request, route, response, users)
  if (request.method == 'POST') handlePostAPI(request, response, route, users)
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

function checkUser({ login, password }) {
  for (const u of users) {
    if (login == u.login) {
      return password == u.password && u
    }
  }
  return false
}

async function handlePostAPI(request, response, route, users) {
  // if (route == 'user') {
  //   const newUser = await getBody(request)

  //   if (isOccupied(newUser.login)) {
  //     response.end('occupied')
  //   }
  //   else {
  //     users.push(newUser)
  //     saveUsers()
  //     response.end('registered')
  //   }
  // }

  if (route == 'user') {
    const newUser = await getBody(request)
    const word = await users.insertOne(newUser);
    newUser._id = word.insertedId;
    const fil = JSON.stringify(newUser);

    // response.end(fil);
    response.end('registered')

  }
  else if (route == 'log-in') {
    const credentials = await getBody(request)
    const user = checkUser(credentials)

    if (user) {
      const token = generateToken()

      response.end(token)
      user.token = token
      saveUsers()
    }
    else {
      response.statusCode = 401
      response.end()
    }
  }

  else if (route == 'auth') {
    const token = await getBody(request)
    const login = recognizeToken(token)

    response.end(login || '')
  }



}

function loadUsers() {
  const loadedUsers = JSON.parse(readFileSync(path, 'utf8'))

  users.push(...loadedUsers)
}

function saveUsers() {
  const json = JSON.stringify(users)

  writeFileSync(path, json)
}

function isOccupied(login) {
  return users.some(u => u.login == login)
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
  return users.find((user) => user.token == token)?.login
}