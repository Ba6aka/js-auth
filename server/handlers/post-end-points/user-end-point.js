const { isOccupied } = require('../../helpers/is-occupied.js')
const { hashPassword } = require('../../helpers/hash-password.js')
const { getBody } = require('../../helpers/get-body.js')

async function userEndPoint(request,response,usersCollection) {
  const { login, password } = await getBody(request)
  const hash = await hashPassword(password)

  if (await isOccupied(usersCollection, login)) {
    response.end('occupied')
  }
  else {
    const newUser = { login, hash }

    await usersCollection.insertOne(newUser);
    response.end('registered')
  }
}

module.exports = { userEndPoint }