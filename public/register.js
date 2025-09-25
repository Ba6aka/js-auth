const [form] = document.forms

handleVisitor()

form.onsubmit = handleSubmit

function handleSubmit() {
  const login = form.login.value.toLowerCase()
  const password = form.password.value
  const user = { login, password }

  if (form.password2.value != password) {
    return alert('password missmatch')
  }

  //if (!isOccupied(login)) {
  registerUser(user)
  alert('Registered successfully. Please log in now')


  //else alert('this login already registered')
}

function registerUser(user) {
  const init = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(user)
  }
  fetch('/api/user', init)
}

function isOccupied(login) {
  if (localStorage.users) {
    const users = JSON.parse(localStorage.users)

    return users.some(u => u.login === login)
  }
}

function handleVisitor() {
  const login = localStorage.currentUser

  if (login) location.href = 'private.html'

  document.body.hidden = false
}

