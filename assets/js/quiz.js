// assets/js/quiz.js
let currentQuiz, currentIndex;
let userAnswers;

const quizSection       = document.getElementById('quiz-section');
const quizTitle         = document.getElementById('quiz-title');
const progressDiv       = document.getElementById('progress');
const questionNav       = document.getElementById('question-nav');
const questionContainer = document.getElementById('question-container');

const finishSection = document.getElementById('finish-section');
const scoreText     = document.getElementById('score-text');
const restartBtn    = document.getElementById('restart-btn');

restartBtn.addEventListener('click', () => {
  finishSection.classList.add('hidden');
  document.getElementById('topic-selection').classList.remove('hidden');
});

// Старт тесту
export function startQuiz(key, quiz) {
  currentQuiz   = quiz;
  currentIndex  = 0;
  userAnswers   = new Array(quiz.questions.length).fill(null);

  quizTitle.textContent     = quiz.title;
  finishSection.classList.add('hidden');
  quizSection.classList.remove('hidden');

  buildNav();
  renderQuestion();
}

// Створюємо клікабельні номери питань
function buildNav() {
  questionNav.innerHTML = '';
  currentQuiz.questions.forEach((_, idx) => {
    const item = document.createElement('div');
    item.className = 'nav-item';
    item.textContent = idx + 1;
    item.addEventListener('click', () => {
      currentIndex = idx;
      renderQuestion();
    });
    questionNav.appendChild(item);
  });
}

// Рендер питання + оновлення навігації
function renderQuestion() {
  const total = currentQuiz.questions.length;
  progressDiv.textContent = `Питання ${currentIndex + 1} з ${total}`;

  // підсвіт Active
  Array.from(questionNav.children).forEach((el, idx) => {
    el.classList.toggle('active', idx === currentIndex);
  });

  const q = currentQuiz.questions[currentIndex];
  questionContainer.innerHTML = `<p class="question-text">${q.text}</p>`;

  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.disabled = false;

    // Якщо вже відповідав — підсвітимо в опціях
    if (userAnswers[currentIndex] === opt) {
      btn.classList.add(opt === q.answer ? 'correct' : 'wrong');
    }

    btn.addEventListener('click', () => selectAnswer(btn, opt));
    questionContainer.appendChild(btn);
  });
}

// Обробка відповіді
function selectAnswer(button, opt) {
  const q       = currentQuiz.questions[currentIndex];
  const correct = q.answer;

  userAnswers[currentIndex] = opt;

  // Блокуємо всі кнопки варіантів
  questionContainer
    .querySelectorAll('button')
    .forEach(b => b.disabled = true);

  // Підсвічуємо кружечок навігації:
  const navItem = questionNav.children[currentIndex];
  if (opt === correct) {
    // зелена підсвітка
    navItem.classList.add('correct');
    button.classList.add('correct');
    // переходимо далі
    setTimeout(moveNext, 500);
  } else {
    // червона підсвітка та показ правильного
    navItem.classList.add('wrong');
    button.classList.add('wrong');
    Array.from(questionContainer.querySelectorAll('button'))
      .find(b => b.textContent === correct)
      .classList.add('correct');
    setTimeout(moveNext, 1500);
  }
}

// Переходить до наступного або фіналу
function moveNext() {
  const last = currentQuiz.questions.length - 1;
  if (currentIndex < last) {
    currentIndex++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

// Завершення тесту
export function finishQuiz() {
  quizSection.classList.add('hidden');
  const correctCount = currentQuiz.questions
    .filter((q, i) => userAnswers[i] === q.answer)
    .length;
  scoreText.textContent = `Правильно ${correctCount} із ${currentQuiz.questions.length}.`;
  finishSection.classList.remove('hidden');
}
