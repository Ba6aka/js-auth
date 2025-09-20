const [form] = document.forms
const users = []

load()

form.onsubmit = handleSubmit

function handleSubmit() {
  const login = form.login.value
  const password = form.password.value
  const user = { login, password }

  if (form.password2.value != password) {
    return alert('password missmatch')
  }

  users.push(user)

  save()

  alert('Registered successfully. Please log in now')
}

function save() {
  const json = JSON.stringify(users)

  localStorage.users = json
}

function load() {
  const json = localStorage.users

  if (!json) return

  const loadedUsers = JSON.parse(json)

  users.push(...loadedUsers)
}