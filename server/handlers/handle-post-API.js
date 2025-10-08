const { getBody } = require('../helpers/get-body.js')
const { isOccupied } = require('../helpers/is-occupied.js')
const { checkUser } = require('../helpers/check-user.js')
const { generateToken } = require('../helpers/generete-token.js')
const { recognizeToken } = require('../helpers/recognize-token.js')

async function handlePostAPI(request, response, route, db) {
  usersCollection = db.collection('users')

  if (route == 'user') {
    const newUser = await getBody(request)

    if (await isOccupied(usersCollection, newUser.login)) {
      response.end('occupied')
    }
    else {
      await usersCollection.insertOne(newUser);
      response.end('registered')
    }
  }

  else if (route == 'log-in') {
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

  else if (route == 'auth') {
    const token = await getBody(request)

    if (!token) return response.end('')

    const userObject = await recognizeToken(usersCollection, token)

    response.end(userObject?.login || '')
  }

  else if (route == "log-out") {
    const token = await getBody(request)
    const user = await usersCollection.findOne({ token })
    user.token = ''
    usersCollection.updateOne(
      { _id: user._id },
      { $set: user }
    )
  }
}

module.exports = { handlePostAPI }