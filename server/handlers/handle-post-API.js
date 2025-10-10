const { userEndPoint } = require('./post-end-points/user-end-point.js')
const { logInEndPoint } = require('./post-end-points/log-in-end-point.js')
const { authEndPoint } = require('./post-end-points/auth-end-point.js')
const { logOutEndPoint } = require('./post-end-points/log-out-end-point.js')

const handlers = {
  'user': userEndPoint,
  'log-in': logInEndPoint,
  'auth': authEndPoint,
  'log-out': logOutEndPoint
}

async function handlePostAPI(request, response, route, db) {
  usersCollection = db.collection('users')
  handlers[route]?.(request, response, usersCollection)
}

module.exports = { handlePostAPI }