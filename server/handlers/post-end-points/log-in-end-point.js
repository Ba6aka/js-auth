const { getBody } = require('../../helpers/get-body.js')
const { generateToken } = require('../../helpers/generete-token.js')
const { checkUser } = require('../../helpers/check-user.js')

async function logInEndPoint(request, response, usersCollection) {
  const credentials = await getBody(request)
  const user = await checkUser(credentials)

  if (user) {
    const token = generateToken()
    user.token = token

    response.end(token)
    usersCollection.updateOne(
      { _id: user._id },
      { $set: user }
    )
  }
  else {
    response.statusCode = 401
    response.end()
  }
}

module.exports = { logInEndPoint }