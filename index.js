const { createReadStream, createWriteStream, readFileSync } = require('fs')
const { Server } = require('http')
const { Readable, Stream } = require('stream')

const path = 'data/users.json'

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

  else if (request.method == 'POST' && route == 'users') {
    request.pipe(createWriteStream(path))
  }

  else if (request.method == 'POST' && route == 'log-in') {
    const json = JSON.parse(readFileSync(path, 'utf8'))
    request.body = await getBody(request)
    let answer = 'false'
    if (checkUser(json, request.body)) {
      answer = 'true'
    }

    Readable.from(answer).pipe(response)
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


function checkUser(json, user) {
for (const {login,password} of json) {
  if (login == user.login && password == user.password) return true
}
return false
}