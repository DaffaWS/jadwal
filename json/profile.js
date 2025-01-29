// File: js/profile.js
document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profile-form');
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const logoutButton = document.getElementById('logout-button');
  
    // Ambil data akun dari local storage
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    let currentUser = localStorage.getItem('currentUser');
  
    if (currentUser) {
      const user = accounts.find(acc => acc.username === currentUser);
      if (user) {
        usernameField.value = user.username;
        passwordField.value = user.password;
      }
    }
  
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const newPassword = passwordField.value;
      // Perbarui password di local storage
      accounts = accounts.map(acc => {
        if (acc.username === currentUser) {
          return { ...acc, password: newPassword };
        }
        return acc;
      });
      localStorage.setItem('accounts', JSON.stringify(accounts));
      displayNotification('Profil berhasil diperbarui!', 'success');
    });
  
    logoutButton.addEventListener('click', function() {
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
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
  });
  