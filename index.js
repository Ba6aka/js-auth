const { createReadStream, createWriteStream } = require('fs')
const { Server } = require('http')
const {Readable, Stream} = require('stream')

const users = {'Ba6aka': '123', 'user':'password'}
runServer(999, handleRequest)

function runServer(port, handler) {
  const server = new Server() 

  server.on('request', handler)
  server.listen(port, () => console.log('http://localhost:' + port))
}

function handleRequest(request, response) {
  const path = "public/" + (request.url.slice(1) || "index.html")

  createReadStream(path).on('error', handle404(response)).pipe(response)

  // if (request.method == 'GET' && request.url == '/users'){
  //   Readable.from(JSON.stringify(users)).pipe(response)
  // }

  if (request.method == 'POST' && request.url == '/user'){
    const path = 'server/users.json'
    request.pipe(createWriteStream(path))
  }

}

function handle404(response) {
  return () => response.writeHead('404').end('file not found')
}