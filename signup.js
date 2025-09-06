// signup.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const msg = document.getElementById('signupMessage');
  const btn = document.querySelector('.btn-login');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('newUsername').value.trim();
    const p = document.getElementById('newPassword').value.trim();
    if (!u || !p) {
      show('Please fill all fields', true);
      return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(x => x.username === u)) {
      show('Username already taken', true);
      return;
    }

    users.push({ username: u, password: p });
    localStorage.setItem('users', JSON.stringify(users));
    btn.classList.add('loading');
    show('Account created. Redirecting...', false);
    setTimeout(()=>{ window.location.href = 'login.html'; }, 1200);
  });

  function show(text, isError){
    msg.textContent = text;
    msg.style.color = isError ? '#d9534f' : 'green';
    msg.style.display = 'block';
  }
});
