const { createReadStream, createWriteStream } = require('fs')
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

function handleAPI(request, response) {
  const route = request.url.slice(5)
  
  if (request.method == 'GET' && route == 'users') {
    const usersStream = createReadStream(path)
    usersStream.pipe(response)
  }

  if (request.method == 'POST' && route == 'users') {
    request.pipe(createWriteStream(path))
  }
}

function handle404(response) {
  return () => response.writeHead('404').end('file not found')
}