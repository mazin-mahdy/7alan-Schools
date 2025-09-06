// login.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const err = document.getElementById('errorMessage');
  const btn = document.querySelector('.btn-login');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();

    // load users from localStorage or defaults
    let users = JSON.parse(localStorage.getItem('users')) || [
      { username: 'mazin', password: 'admin1252' },
      { username: 'youssef', password: 'admin1232' },
      { username: 'zain', password: 'admin1232' }
    ];

    const ok = users.some(user => user.username === u && user.password === p);

    if (!ok) {
      err.style.display = 'block';
      setTimeout(()=> err.style.display='none', 3000);
      return;
    }

    // success
    btn.classList.add('loading');
    setTimeout(()=>{
      localStorage.setItem('authenticated','true');
      window.location.href = 'index.html';
    }, 900);
  });
});
