import { quizzes } from './data.js';
import { startQuiz } from './quiz.js';

const topicsContainer = document.getElementById('topics-container');
const topicSelection = document.getElementById('topic-selection');

Object.entries(quizzes).forEach(([key, quiz]) => {
  const btn = document.createElement('button');
  btn.textContent = quiz.title;
  btn.addEventListener('click', () => {
    topicSelection.classList.add('hidden');
    startQuiz(key, quiz);
  });
  topicsContainer.appendChild(btn);
});
