const [form] = document.forms
const users = []

load()

form.onsubmit = handleSubmit

function handleSubmit() {
  const login = form.login.value
  const password = form.password.value

  for (const user of users) {
    if (login == user.login && password == user.password) {
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