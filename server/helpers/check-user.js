async function checkUser({ login, password }) {
  const user = await usersCollection.findOne({ login, password })
  return user
}

module.exports = { checkUser }