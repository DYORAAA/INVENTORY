// login.js
document.addEventListener('DOMContentLoaded', () => {
  const loginContainer = document.getElementById('loginContainer');
  const closedIcon = document.getElementById('closedIcon');
  const btn = document.getElementById('btnLogin');
  const userInput = document.getElementById('user');
  const passInput = document.getElementById('pass');

  // buka form saat ikon diklik, fokus ke username
  closedIcon?.addEventListener('click', (e) => {
    e.stopPropagation();
    loginContainer?.classList.add('open');
    setTimeout(() => userInput?.focus(), 180);
  });

  // tutup saat klik di luar form
  document.addEventListener('click', (e) => {
    if (!loginContainer) return;
    if (!loginContainer.classList.contains('open')) return;
    if (!loginContainer.contains(e.target)) loginContainer.classList.remove('open');
  });

  // submit on Enter
  [userInput, passInput].forEach(input => {
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        btn?.click();
      }
    });
  });

  // validasi contoh (ganti sesuai backend)
  btn?.addEventListener('click', () => {
    const u = userInput?.value.trim() || '';
    const p = passInput?.value.trim() || '';
    if (u === 'admin' && p === 'tkj123') {
      localStorage.setItem('login', 'true');
      window.location.href = 'dashboard.html';
    } else {
      // efek shake singkat
      loginContainer?.classList.remove('shake');
      void loginContainer?.offsetWidth;
      loginContainer?.classList.add('shake');
      setTimeout(() => loginContainer?.classList.remove('shake'), 600);
      alert('Username atau password salah!');
    }
  });
});

