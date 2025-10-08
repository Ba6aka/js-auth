function recognizeToken(usersCollection, token) {
  return usersCollection.findOne({ token })
}

module.exports = { recognizeToken }