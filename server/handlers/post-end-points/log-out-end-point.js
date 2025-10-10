const { getBody } = require("../../helpers/get-body")

async function logOutEndPoint(request, response, usersCollection) {
  const token = await getBody(request)
  const user = await usersCollection.findOne({ token })
  user.token = ''
  usersCollection.updateOne(
    { _id: user._id },
    { $set: user }
  )
}

module.exports = { logOutEndPoint }