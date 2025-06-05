import { quizzes } from './data.js';
import { startQuiz } from './quiz.js';
import { showHistory } from './history.js';

const topicsContainer = document.getElementById('topics-container');
const topicSelection = document.getElementById('topic-selection');

const levelSelection = document.createElement('section');
levelSelection.id = 'level-selection';
levelSelection.className = 'card hidden';

const levelTitle = document.createElement('h2');
levelTitle.textContent = 'Оберіть складність';
levelSelection.appendChild(levelTitle);

const levelButtons = document.createElement('div');
levelButtons.className = 'btn-group';
levelButtons.id = 'level-buttons';
levelSelection.appendChild(levelButtons);

document.querySelector('.container').appendChild(levelSelection);

const backToTopicsBtn = document.createElement('button');
backToTopicsBtn.textContent = '← Назад до тем';
backToTopicsBtn.className = 'btn';
backToTopicsBtn.addEventListener('click', () => {
  levelSelection.classList.add('hidden');
  topicSelection.classList.remove('hidden');
});

Object.entries(quizzes).forEach(([category, topics]) => {
  const catTitle = document.createElement('h2');
  catTitle.textContent = category;
  topicsContainer.appendChild(catTitle);

  Object.entries(topics).forEach(([topicKey, levels]) => {
    const btn = document.createElement('button');
    btn.textContent = levels.name || topicKey;
    btn.className = 'btn';
    btn.addEventListener('click', () => showLevels(topicKey, levels));
    topicsContainer.appendChild(btn);
  });
});

function showLevels(topicKey, levels) {
  topicSelection.classList.add('hidden');
  levelSelection.classList.remove('hidden');

  levelButtons.innerHTML = '';

  levelButtons.appendChild(backToTopicsBtn);

  Object.entries(levels).forEach(([levelKey, quiz]) => {
    if (levelKey === 'name') return;
    const btn = document.createElement('button');
    btn.textContent = quiz.title;
    btn.className = 'btn';

    const quizKey = `${topicKey}_${levelKey}`;
    const unlocked = isUnlocked(topicKey, levelKey);

    btn.disabled = !unlocked;
    if (!unlocked) btn.classList.add('locked');

    btn.addEventListener('click', () => {
      if (!unlocked) return;
      levelSelection.classList.add('hidden');
      startQuiz(quizKey, quiz);
    });

    levelButtons.appendChild(btn);

  });
}

function isUnlocked(topicKey, levelKey) {
  if (levelKey === 'easy') return true;

  const history = JSON.parse(localStorage.getItem('quiz_history') || '[]');

  const previousLevel = levelKey === 'medium' ? 'easy' : 'medium';
  const keyToCheck = `${topicKey}_${previousLevel}`;

  const passed = history.find(h =>
    h.key === keyToCheck && (h.score / h.total) >= 0.7
  );

  return !!passed;
}

const historyBtn = document.createElement('button');
historyBtn.textContent = 'Історія результатів';
historyBtn.className = 'btn';
historyBtn.addEventListener('click', showHistory);
document.getElementById('topic-selection').insertBefore(historyBtn, topicsContainer);

const toggleThemeBtn = document.createElement('button');
toggleThemeBtn.textContent = '🌓 Змінити тему';
toggleThemeBtn.className = 'btn';
toggleThemeBtn.style.display = 'block';
toggleThemeBtn.style.margin = '1rem auto';
toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});
document.querySelector('.container').prepend(toggleThemeBtn);

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

const resumeData = JSON.parse(localStorage.getItem('resume_quiz'));
if (resumeData) {
  const resumeBtn = document.createElement('button');
  resumeBtn.textContent = `Продовжити: ${resumeData.title}`;
  resumeBtn.className = 'btn';
  resumeBtn.id = 'resume-btn';
  resumeBtn.style.marginTop = '1rem';

  resumeBtn.addEventListener('click', () => {
    document.getElementById('topic-selection').classList.add('hidden');
    startQuiz(resumeData.key, resumeData.quiz, resumeData.index, resumeData.answers);
  });

  document.getElementById('topic-selection').insertBefore(resumeBtn, topicsContainer);
}
