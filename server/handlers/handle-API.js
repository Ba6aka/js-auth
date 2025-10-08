const { handleGetAPI } = require('./handle-get-API.js')
const { handlePostAPI } = require('./handle-post-API.js')

function handleAPI(request, response, db) {
  const route = request.url.slice(5)

  if (request.method == 'GET') handleGetAPI(request, route, response, db)
  if (request.method == 'POST') handlePostAPI(request, response, route, db)
}

module.exports = { handleAPI }