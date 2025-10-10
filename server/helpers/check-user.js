const { verifyPassword } = require("./hash-password")

async function checkUser({ login, password }) {
  const user = await usersCollection.findOne({ login })
  if (await verifyPassword(password, user.hash)) return user
}

module.exports = { checkUser }