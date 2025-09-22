const [form] = document.forms
const users = []

handleVisitor()
load()

form.onsubmit = handleSubmit

function handleSubmit() {
  const login = form.login.value.toLowerCase()
  const password = form.password.value
  const user = { login, password }

  if (form.password2.value != password) {
    return alert('password missmatch')
  }

  //if (!isOccupied(login)) {
    users.push(user)
    save()
    alert('Registered successfully. Please log in now')
  

  //else alert('this login already registered')
}

function save() {
  const init = {method:'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(users)}
  fetch('/user',init)
}

function load() {
  const json = localStorage.users

  if (!json) return

  const loadedUsers = JSON.parse(json)

  users.push(...loadedUsers)
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