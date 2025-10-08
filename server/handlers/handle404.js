function handle404(response) {
  return () => response.writeHead('404').end('file not found')
}

module.exports = { handle404 }