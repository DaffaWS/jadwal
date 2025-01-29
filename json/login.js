// File: json/login.js
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  // Cek akun di local storage
  let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  const user = accounts.find(acc => acc.username === username && acc.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user)); // Simpan pengguna saat ini
    displayNotification('Login berhasil!', 'success');
    window.location.href = 'dashboard.html'; // Arahkan ke halaman dasbor
  } else {
    displayNotification('Nama atau password salah!', 'error');
  }
});

function displayNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 3000); // Notifikasi akan hilang setelah 3 detik
}
