async function authorizeByToken(token) {
  const init = {
    method: "POST",
    body: token,
    headers: { 'Content-Type': 'text/plain' }
  }
  const response = await fetch('/api/auth', init)

  return response.text()
}

async function handleVisitor(private = false) {
  const token = localStorage.currentUserToken
  const login = await authorizeByToken(token)

  if (private) {
    if (!login) return location.href = '.'
    else output.value = login
  }
  else {
    if (login) return location.href = 'private.html'
  }

  document.body.hidden = false
}