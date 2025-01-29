// File: json/dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    displayAssignments();
    displaySchedule();
  });
  
  document.getElementById('assignment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const assignment = document.getElementById('assignment').value;
    const dueDate = document.getElementById('due-date').value;
    // Simpan PR ke local storage
    let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    assignments.push({ assignment, dueDate });
    localStorage.setItem('assignments', JSON.stringify(assignments));
    displayAssignments();
  });
  
  function displayAssignments() {
    const assignmentList = document.getElementById('assignment-list');
    assignmentList.innerHTML = '';
    let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    const currentDate = new Date().toISOString().split('T')[0];
    assignments = assignments.filter(a => a.dueDate >= currentDate); // Hapus PR yang sudah lewat jatuh tempo
    localStorage.setItem('assignments', JSON.stringify(assignments));
    assignments.forEach((a, index) => {
      const li = document.createElement('li');
      li.textContent = `${a.assignment} (Jatuh Tempo: ${a.dueDate})`;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Hapus';
      deleteButton.onclick = () => {
        deleteAssignment(index);
      };
      li.appendChild(deleteButton);
      assignmentList.appendChild(li);
    });
  }
  
  function deleteAssignment(index) {
    let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
    assignments.splice(index, 1);
    localStorage.setItem('assignments', JSON.stringify(assignments));
    displayAssignments();
  }
  
  function displaySchedule() {
    const scheduleContainer = document.getElementById('schedule');
    scheduleContainer.innerHTML = '<h3>Jadwal Tetap</h3>';
  
    const currentWeekNumber = getCurrentWeekNumber();
    const schedule = currentWeekNumber % 2 === 0 ? weekASchedule : weekBSchedule;
  
    for (const day in schedule) {
      const daySchedule = schedule[day];
      const dayDiv = document.createElement('div');
      dayDiv.innerHTML = `<strong>${day}</strong>: ${daySchedule.join(', ')}`;
      scheduleContainer.appendChild(dayDiv);
    }
  }
  
  function getCurrentWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek) + 1;
  }
  