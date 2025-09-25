const [form] = document.forms
const users = []

handleVisitor()

form.onsubmit = handleSubmit

async function handleSubmit() {
  const login = form.login.value
  const password = form.password.value

  const accessGranted = await logIn(login, password)
  if (accessGranted == 'true') {

    setCurrentUser(login)

    return location.href = 'private.html'
  }

  alert('incorrect login or password, please try again')
}

function setCurrentUser(login) {
  localStorage.currentUser =login
}

async function handleVisitor() {
  const login = localStorage.currentUser

  if (login) location.href = 'private.html'

  document.body.hidden = false
}

async function logIn(login, password) {
  const user = { login, password }
  const init = { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(user) }
  const res = await fetch('/api/log-in', init)

  return res.text()
}