const { userEndPoint } = require('./post-end-points/user-end-point.js')
const { logInEndPoint } = require('./post-end-points/log-in-end-point.js')
const { authEndPoint } = require('./post-end-points/auth-end-point.js')
const { logOutEndPoint } = require('./post-end-points/log-out-end-point.js')

async function handlePostAPI(request, response, route, db) {
  usersCollection = db.collection('users')

  if (route == 'user') userEndPoint(request, response, usersCollection)
  else if (route == 'log-in') logInEndPoint(request, response, usersCollection)
  else if (route == 'auth') authEndPoint(request, response, usersCollection)
  else if (route == "log-out") logOutEndPoint(request, response, usersCollection)
}

module.exports = { handlePostAPI }