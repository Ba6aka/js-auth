function generateToken() {
  let token = ''
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  for (let i = 0; i < 27; i++) {
    token += chars[Math.floor(Math.random() * 62)]
  }

  return token
}

module.exports = { generateToken }