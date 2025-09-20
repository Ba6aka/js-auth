const [form] = document.forms
const users = []

load()

form.onsubmit = handleSubmit

function handleSubmit() {
  const login = form.login.value
  const password = form.password.value

  for (const user of users) {
    if (login == user.login && password == user.password) {

      setCurrentUser(login)

      return location.href = 'private.html'
    }
  }

  alert('incorrect login or password, please try again')
}

function load() {
  const json = localStorage.users

  if (!json) return

  const loadedUsers = JSON.parse(json)

  users.push(...loadedUsers)
}

function setCurrentUser(login) {
  localStorage.currentUser = login
}