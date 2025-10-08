async function isOccupied(usersCollection, login) {
  return !! await usersCollection.findOne({ login })
}

module.exports = { isOccupied }