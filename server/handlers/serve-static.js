const { createReadStream } = require('fs')
const { handle404 } = require('./handle404.js')

function serveStatic(request, response) {
  const path = "public/" + (request.url.slice(1) || "index.html")

  if (request.url.endsWith(".css")) {
    response.setHeader('content-type', 'text/css')
  }

  createReadStream(path).on('error', handle404(response)).pipe(response)
}

module.exports = { serveStatic }