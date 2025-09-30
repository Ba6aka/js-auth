const { createReadStream, readFileSync, writeFileSync } = require('fs')
const { Server } = require('http')
const { Readable, Stream } = require('stream')
const users = []
const path = 'data/users.json'

loadUsers()
runServer(999, handleRequest)

function runServer(port, handler) {
  const server = new Server()

  server.on('request', handler)
  server.listen(port, () => console.log('http://localhost:' + port))
}

function handleRequest(request, response) {
  if (request.url.startsWith('/api/')) {
    handleAPI(request, response)
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

function checkUser({ login, password }) {
  for (const u of users) {
    if (login == u.login) {
      return password == u.password && u
    }
  }
  return false
}

async function handlePostAPI(request, response, route) {
  if (route == 'user') {
    const newUser = await getBody(request)

    if (isOccupied(newUser.login)) {
      response.end('occupied')
    }
    else {
      users.push(newUser)
      saveUsers()
      response.end('registered')
    }
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