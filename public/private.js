const [logoutBtn] = document.getElementsByTagName('button')
const [output] = document.getElementsByTagName('output')

handleVisitor(true)

logoutBtn.onclick = handleLogout

function handleLogout() {


  const init = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: localStorage.getItem('currentUserToken')
  }

  fetch('/api/log-out', init)

  localStorage.removeItem('currentUserToken')
  location.href = 'index.html'
}

