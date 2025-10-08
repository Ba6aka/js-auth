const { createReadStream } = require('fs')


function handleGetAPI(request, route, response) {
  if (route == 'users') {
    const usersStream = createReadStream(path)
    usersStream.pipe(response)
  }

  else if (route == 'current-user') {
    createReadStream('data/current-user.json').pipe(response)
  }
}

module.exports = { handleGetAPI }