const [form] = document.forms
const users = []
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