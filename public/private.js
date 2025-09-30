const [logoutBtn] = document.getElementsByTagName('button')
const [output] = document.getElementsByTagName('output')

handleVisitor()

logoutBtn.onclick = handleLogout

async function handleVisitor() {
  const token = localStorage.currentUserToken
  const login = await authorizeByToken(token)

  if (!login) location.href = '.'

  output.value = login
  document.body.hidden = false
}

function handleLogout() {
  localStorage.removeItem('currentUser')
  location.href = 'index.html'
}

async function authorizeByToken(token) {
  const init = {
    method: "POST",
    body: token,
    headers: { 'Content-Type': 'text/plain' }
  }
  const response = await fetch('/api/auth', init)

  return response.text()
}