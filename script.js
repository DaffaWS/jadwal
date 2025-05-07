const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

const loginSection = document.getElementById('login-section');
const setupJadwalSection = document.getElementById('setup-jadwal-section');
const mainSection = document.getElementById('main-section');
const usernameInput = document.getElementById('username');
const btnLogin = document.getElementById('btn-login');
const loginMsg = document.getElementById('login-msg');
const jadwalTableBody = document.getElementById('jadwal-table-body');
const jadwalForm = document.getElementById('jadwal-form');
const userDisplay = document.getElementById('user-display');
const btnLogout = document.getElementById('btn-logout');
const btnMingguA = document.getElementById('btn-minggu-a');
const btnMingguB = document.getElementById('btn-minggu-b');
const jadwalDisplayBody = document.getElementById('jadwal-display-body');
const prForm = document.getElementById('pr-form');
const prMataPelajaran = document.getElementById('pr-mata-pelajaran');
const prNama = document.getElementById('pr-nama');
const prTanggal = document.getElementById('pr-tanggal');
const prListDiv = document.getElementById('pr-list');
const btnEditJadwal = document.getElementById('btn-edit-jadwal');
const btnResetAkun = document.getElementById('btn-reset-akun');

let currentUser = null;
let jadwalData = null;
let prData = null;
let currentWeek = 'A';

function saveUserData() {
  localStorage.setItem('jadwal_' + currentUser, JSON.stringify(jadwalData));
  localStorage.setItem('pr_' + currentUser, JSON.stringify(prData));
}

function loadUserData() {
  const jadwal = localStorage.getItem('jadwal_' + currentUser);
  const pr = localStorage.getItem('pr_' + currentUser);
  jadwalData = jadwal ? JSON.parse(jadwal) : null;
  prData = pr ? JSON.parse(pr) : [];
}

function login(user) {
  currentUser = user.trim().toLowerCase();
  if (!currentUser) {
    loginMsg.textContent = 'Username tidak boleh kosong.';
    return false;
  }
  loginMsg.textContent = '';
  loadUserData();

  loginSection.classList.add('hidden');

  if (!jadwalData) {
    setupJadwalSection.classList.remove('hidden');
    mainSection.classList.add('hidden');
    generateJadwalForm();
  } else {
    setupJadwalSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
    userDisplay.textContent = currentUser;
    currentWeek = 'A';
    renderWeekToggle();
    renderJadwal();
    renderPRList();
    renderMataPelajaranOptions();
  }
  return true;
}

btnLogin.addEventListener('click', () => {
  const user = usernameInput.value;
  if (login(user)) {
    usernameInput.value = '';
  }
});

btnLogout.addEventListener('click', () => {
  currentUser = null;
  jadwalData = null;
  prData = null;
  loginSection.classList.remove('hidden');
  setupJadwalSection.classList.add('hidden');
  mainSection.classList.add('hidden');
  loginMsg.textContent = '';
});

function generateJadwalForm() {
  jadwalTableBody.innerHTML = '';
  hariList.forEach(hari => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${hari}</td>
      <td>
        <textarea name="mingguA-${hari}" placeholder="Mata pelajaran Minggu A, satu per baris" rows="3" required></textarea>
      </td>
      <td>
        <textarea name="mingguB-${hari}" placeholder="Mata pelajaran Minggu B, satu per baris" rows="3" required></textarea>
      </td>
    `;
    jadwalTableBody.appendChild(tr);
  });
}

function fillJadwalForm() {
  if (!jadwalData) return;
  hariList.forEach(hari => {
    const mingguATextarea = jadwalForm.querySelector(`textarea[name="mingguA-${hari}"]`);
    if (mingguATextarea && jadwalData.mingguA && jadwalData.mingguA[hari]) {
      mingguATextarea.value = jadwalData.mingguA[hari].join('\n');
    }
    const mingguBTextarea = jadwalForm.querySelector(`textarea[name="mingguB-${hari}"]`);
    if (mingguBTextarea && jadwalData.mingguB && jadwalData.mingguB[hari]) {
      mingguBTextarea.value = jadwalData.mingguB[hari].join('\n');
    }
  });
}

jadwalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  jadwalData = { mingguA: {}, mingguB: {} };
  hariList.forEach(hari => {
    const pelajaranAText = jadwalForm.querySelector(`textarea[name="mingguA-${hari}"]`).value.trim();
    const pelajaranBText = jadwalForm.querySelector(`textarea[name="mingguB-${hari}"]`).value.trim();

    const pelajaranA = pelajaranAText.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    const pelajaranB = pelajaranBText.split('\n').map(s => s.trim()).filter(s => s.length > 0);

    jadwalData.mingguA[hari] = pelajaranA;
    jadwalData.mingguB[hari] = pelajaranB;
  });
  saveUserData();

  setupJadwalSection.classList.add('hidden');
  mainSection.classList.remove('hidden');
  userDisplay.textContent = currentUser;
  currentWeek = 'A';
  renderWeekToggle();
  renderJadwal();
  renderPRList();
  renderMataPelajaranOptions();
});

btnEditJadwal.addEventListener('click', () => {
  setupJadwalSection.classList.remove('hidden');
  mainSection.classList.add('hidden');
  generateJadwalForm();
  fillJadwalForm();
});

btnResetAkun.addEventListener('click', () => {
  const konfirmasi = confirm('Apakah kamu yakin ingin mereset akun? Semua data jadwal dan PR akan dihapus.');
  if (!konfirmasi) return;

  localStorage.removeItem('jadwal_' + currentUser);
  localStorage.removeItem('pr_' + currentUser);

  jadwalData = null;
  prData = [];

  setupJadwalSection.classList.remove('hidden');
  mainSection.classList.add('hidden');
  generateJadwalForm();
});

function renderWeekToggle() {
  if (currentWeek === 'A') {
    btnMingguA.classList.add('active');
    btnMingguB.classList.remove('active');
  } else {
    btnMingguB.classList.add('active');
    btnMingguA.classList.remove('active');
  }
}

btnMingguA.addEventListener('click', () => {
  currentWeek = 'A';
  renderWeekToggle();
  renderJadwal();
  renderPRList();
  renderMataPelajaranOptions();
});
btnMingguB.addEventListener('click', () => {
  currentWeek = 'B';
  renderWeekToggle();
  renderJadwal();
  renderPRList();
  renderMataPelajaranOptions();
});

function renderJadwal() {
  jadwalDisplayBody.innerHTML = '';
  if (!jadwalData) return;

  const mingguKey = currentWeek === 'A' ? 'mingguA' : 'mingguB';

  hariList.forEach(hari => {
    const pelajaranArr = jadwalData[mingguKey][hari] || [];

    let pelajaranHtml = '';
    pelajaranArr.forEach(pelajaran => {
      const prForPelajaran = prData.filter(pr => pr.mataPelajaran.toLowerCase() === pelajaran.toLowerCase());
      const prHtml = prForPelajaran.length > 0
        ? prForPelajaran.map(pr => {
            const styleSelesai = pr.selesai ? 'text-decoration: line-through; color: gray;' : '';
            return `<div style="font-size:0.9em; color:#27ae60; ${styleSelesai}">- ${pr.namaPR} ${pr.tanggal ? `(Pengingat: ${pr.tanggal})` : ''}</div>`;
          }).join('')
        : '';
      pelajaranHtml += `<div><strong>${pelajaran}</strong>${prHtml}</div>`;
    });

    if (pelajaranArr.length === 0) pelajaranHtml = '-';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${hari}</td>
      <td>${pelajaranHtml}</td>
    `;
    jadwalDisplayBody.appendChild(tr);
  });
}

function renderMataPelajaranOptions() {
  prMataPelajaran.innerHTML = '<option value="">-- Pilih Mata Pelajaran --</option>';
  if (!jadwalData) return;
  const mingguKey = currentWeek === 'A' ? 'mingguA' : 'mingguB';
  const pelajaranSet = new Set();

  hariList.forEach(hari => {
    const pelajaranArr = jadwalData[mingguKey][hari];
    if (pelajaranArr && pelajaranArr.length) {
      pelajaranArr.forEach(p => pelajaranSet.add(p));
    }
  });

  pelajaranSet.forEach(pelajaran => {
    const option = document.createElement('option');
    option.value = pelajaran;
    option.textContent = pelajaran;
    prMataPelajaran.appendChild(option);
  });
}

prForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const mataPelajaran = prMataPelajaran.value;
  const namaPR = prNama.value.trim();
  const tanggal = prTanggal.value;

  if (!mataPelajaran || !namaPR) {
    alert('Harap isi semua kolom wajib.');
    return;
  }

  prData.push({ mataPelajaran, namaPR, tanggal, selesai: false });
  saveUserData();
  prForm.reset();
  renderPRList();
  renderJadwal();
});

function renderPRList() {
  if (!prData || prData.length === 0) {
    prListDiv.innerHTML = '<p>Tidak ada PR / tugas.</p>';
    return;
  }

  prListDiv.innerHTML = '';
  prData.forEach((pr, idx) => {
    const checked = pr.selesai ? 'checked' : '';
    const styleSelesai = pr.selesai ? 'text-decoration: line-through; color: gray;' : '';
    const div = document.createElement('div');
    div.className = 'pr-item';
    div.innerHTML = `
      <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
        <input type="checkbox" data-index="${idx}" class="pr-checkbox" ${checked} />
        <span style="${styleSelesai}">
          <strong>${pr.namaPR}</strong> - ${pr.mataPelajaran} 
          ${pr.tanggal ? `(Pengingat: ${pr.tanggal})` : ''}
        </span>
      </label>
      <button data-index="${idx}" class="hapus-pr-btn" style="margin-left: 10px;">Hapus</button>
    `;
    prListDiv.appendChild(div);
  });

  document.querySelectorAll('.pr-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const idx = e.target.getAttribute('data-index');
      prData[idx].selesai = e.target.checked;
      saveUserData();
      renderJadwal();
      renderPRList();
    });
  });

  document.querySelectorAll('.hapus-pr-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.getAttribute('data-index');
      prData.splice(idx, 1);
      saveUserData();
      renderPRList();
      renderJadwal();
    });
  });
}
