const { serveStatic } = require('./serve-static.js')
const { handleAPI } = require('./handle-API.js')

function handleRequest(db) {
  return function (request, response) {

    if (request.url.startsWith('/api/')) {
      handleAPI(request, response, db)
    } else {
      serveStatic(request, response)
    }
  }
}

module.exports = { handleRequest }