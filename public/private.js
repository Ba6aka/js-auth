const [logoutBtn] = document.getElementsByTagName('button')
const [output] = document.getElementsByTagName('output')

handleVisitor(true)

logoutBtn.onclick = handleLogout

function handleLogout() {
  localStorage.removeItem('currentUser')
  location.href = 'index.html'
}

