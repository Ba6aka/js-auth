const [logoutBtn] = document.getElementsByTagName('button')
const [output] = document.getElementsByTagName('output')

handleVisitor()

logoutBtn.onclick = handleLogout

function handleVisitor() {
  const login = localStorage.currentUser

  if (!login) location.href = 'index.html'

  output.value = login
  document.body.hidden = false
}

function handleLogout() {
  localStorage.removeItem('currentUser')
  location.href = 'index.html'
}
