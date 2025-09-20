const { createReadStream } = require('fs')
const { createServer } = require('http')

runServer(999, handleRequest)

function runServer(port, handler) {
  const server = createServer()

  server.on('request', handler)
  server.listen(port, () => console.log('http://localhost:' + port))
}

function handleRequest(request, response) {
  const path = "public/" + (request.url.slice(1) || "index.html")

  createReadStream(path).on('error', handle404(response)).pipe(response)
}

function handle404(response) {
  return  () => response.writeHead('404').end('file not found')
}