// File: json/account-list.js
document.addEventListener('DOMContentLoaded', function () {
  const accountList = document.getElementById('account-list');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || !currentUser.isAdmin) {
    alert('Anda tidak memiliki akses ke halaman ini!');
    window.location.href = 'index.html'; // Arahkan ke halaman login jika bukan admin
  } else {
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    accounts.forEach(account => {
      const li = document.createElement('li');
      li.textContent = account.username;
      accountList.appendChild(li);
    });
  }
});
