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

async function handleAPI(request, response) {
  const route = request.url.slice(5)

  if (request.method == 'GET' && route == 'users') {
    const usersStream = createReadStream(path)
    usersStream.pipe(response)
  }

  else if (request.method == 'GET' && route == 'current-user') {
    createReadStream('data/current-user.json').pipe(response)
  }


  handlePostAPI(request, response, route)
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
      return password == u.password
    }
  }
  return false
}

async function handlePostAPI(request, response, route) {
  if (request.method == 'POST' && route == 'user') {
    const newUser = await getBody(request)

    users.push(newUser)
    saveUsers()
  }

  else if (request.method == 'POST' && route == 'log-in') {
    const credentials = await getBody(request)

    Readable.from(checkUser(credentials).toString()).pipe(response)
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