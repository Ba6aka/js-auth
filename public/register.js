const [form] = document.forms

handleVisitor()

form.button.onclick = trimValues
form.onsubmit = handleSubmit

async function handleSubmit() {
  const login = form.login.value.toLowerCase()
  const password = form.password.value
  const user = { login, password }

  if (form.password2.value != password) return alert('password missmatch')

  const result = await registerUser(user)

  if (result == 'registered') alert('Registered successfully. Please log in now')
  else if (result == 'occupied') alert('this login already registered')
}

async function registerUser(user) {
  const init = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(user)
  }
  const response = await fetch('/api/user', init)

  return response.text()
}

function isOccupied(login) {
  if (localStorage.users) {
    const users = JSON.parse(localStorage.users)

    return users.some(u => u.login === login)
  }
}

function trimValues() {
  form.login.value = form.login.value.trim()
  form.login.value = form.login.value.trim()
}