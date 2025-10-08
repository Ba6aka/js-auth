const { createReadStream } = require('fs')
const { handle404 } = require('./handle404.js')

function serveStatic(request, response) {
  const path = "public/" + (request.url.slice(1) || "index.html")

  createReadStream(path).on('error', handle404(response)).pipe(response)
}

module.exports = { serveStatic }