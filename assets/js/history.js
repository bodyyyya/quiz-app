const historySection = document.getElementById('history-section');
const tableBody = document.querySelector('#history-table tbody');
const backBtn = document.getElementById('back-btn');

export function showHistory() {
  document.getElementById('topic-selection').classList.add('hidden');
  document.getElementById('quiz-section').classList.add('hidden');
  document.getElementById('finish-section').classList.add('hidden');
  historySection.classList.remove('hidden');

  const history = JSON.parse(localStorage.getItem('quiz_history') || '[]');
  tableBody.innerHTML = '';
  history.forEach(({ date, topic, score, total }) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${date}</td><td>${topic}</td><td>${score} / ${total}</td>`;
    tableBody.appendChild(row);
  });
}

backBtn.addEventListener('click', () => {
  historySection.classList.add('hidden');
  document.getElementById('topic-selection').classList.remove('hidden');
});
