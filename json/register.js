// File: json/register.js
document.getElementById('register-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const isAdmin = document.getElementById('admin-checkbox').checked; // Tambahkan checkbox admin
  // Simpan akun ke local storage
  let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  if (accounts.some(acc => acc.username === username)) {
    displayNotification('Nama akun sudah digunakan!', 'error');
  } else {
    accounts.push({ username, password, isAdmin });
    localStorage.setItem('accounts', JSON.stringify(accounts));
    displayNotification('Akun berhasil didaftarkan!', 'success');
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
