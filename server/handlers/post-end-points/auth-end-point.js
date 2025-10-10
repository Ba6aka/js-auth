const { getBody } = require('../../helpers/get-body.js')
const { recognizeToken } = require('../../helpers/recognize-token.js')

async function authEndPoint(request, response, usersCollection) {
  const token = await getBody(request)

  if (!token) return response.end('')

  const userObject = await recognizeToken(usersCollection, token)

  response.end(userObject?.login || '')
}

module.exports = { authEndPoint }