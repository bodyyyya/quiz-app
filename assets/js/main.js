import { quizzes } from './data.js';
import { startQuiz } from './quiz.js';
import { showHistory } from './history.js';

const topicsContainer = document.getElementById('topics-container');
const topicSelection = document.getElementById('topic-selection');
const historyBtn = document.createElement('button');
historyBtn.textContent = 'Історія результатів';
historyBtn.className = 'btn';
historyBtn.addEventListener('click', showHistory);
document.getElementById('topics-container').appendChild(historyBtn);

Object.entries(quizzes).forEach(([category, tests]) => {
  const catTitle = document.createElement('h2');
  catTitle.textContent = category;
  topicsContainer.appendChild(catTitle);

  tests.forEach(quiz => {
    const btn = document.createElement('button');
    btn.textContent = quiz.title;
    btn.addEventListener('click', () => {
      topicSelection.classList.add('hidden');
      startQuiz(quiz.key, quiz);
    });
    topicsContainer.appendChild(btn);
  });
});