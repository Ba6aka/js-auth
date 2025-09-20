handleVisitor()

function handleVisitor() {
  const login = localStorage.currentUser

  if (login) location.href = 'private.html'

  document.body.hidden = false
}