let currentQuiz, currentIndex;
let userAnswers;
let quizTimerInterval, totalTimeLeft;
let incorrectQuestions = [];

const quizSection       = document.getElementById('quiz-section');
const quizTitle         = document.getElementById('quiz-title');
const progressDiv       = document.getElementById('progress');
const questionNav       = document.getElementById('question-nav');
const questionContainer = document.getElementById('question-container');

const finishSection = document.getElementById('finish-section');
const scoreText     = document.getElementById('score-text');
const restartBtn    = document.getElementById('restart-btn');

restartBtn.addEventListener('click', () => {
  clearInterval(quizTimerInterval);
  finishSection.classList.add('hidden');
  document.getElementById('topic-selection').classList.remove('hidden');
});

export function startQuiz(key, quiz) {
  currentQuiz   = quiz;
  currentIndex  = 0;
  userAnswers   = new Array(quiz.questions.length).fill(null);

  const timeMinutes = quiz.timeLimit || 5;
  const fullTime = timeMinutes * 60;
  const timerBar = document.getElementById('timer-bar');
  timerBar.style.width = '100%';

  quizTitle.textContent     = quiz.title;
  finishSection.classList.add('hidden');
  quizSection.classList.remove('hidden');

  buildNav();
  renderQuestion();

  clearInterval(quizTimerInterval);
  totalTimeLeft = fullTime;

  let globalTimerEl = document.getElementById('global-timer');
  if (!globalTimerEl) {
    globalTimerEl = document.createElement('div');
    globalTimerEl.id = 'global-timer';
    quizTitle.after(globalTimerEl);
  }
  updateGlobalTimer(globalTimerEl);
  quizTimerInterval = setInterval(() => {
    totalTimeLeft--;
    updateGlobalTimer(globalTimerEl);
    const percent = (totalTimeLeft / fullTime) * 100;
    timerBar.style.width = `${percent}%`;
    if (totalTimeLeft <= 0) {
      clearInterval(quizTimerInterval);
      finishQuiz();
    }
  }, 1000);
}


function updateGlobalTimer(el) {
  const min = Math.floor(totalTimeLeft / 60).toString().padStart(2, '0');
  const sec = (totalTimeLeft % 60).toString().padStart(2, '0');
  el.textContent = `🕒 Залишилось: ${min}:${sec}`;
}

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

function renderQuestion() {
  const total = currentQuiz.questions.length;
  progressDiv.textContent = `Питання ${currentIndex + 1} з ${total}`;

  Array.from(questionNav.children).forEach((el, idx) => {
    el.classList.toggle('active', idx === currentIndex);
  });

  const q = currentQuiz.questions[currentIndex];
  questionContainer.innerHTML = `<p class="question-text">${q.text}</p>`;

  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.disabled = false;

    if (userAnswers[currentIndex] === opt) {
      btn.classList.add(opt === q.answer ? 'correct' : 'wrong');
    }

    btn.addEventListener('click', () => selectAnswer(btn, opt));
    questionContainer.appendChild(btn);
  });
}

function selectAnswer(button, opt) {
  const q       = currentQuiz.questions[currentIndex];
  const correct = q.answer;
  userAnswers[currentIndex] = opt;

  questionContainer.querySelectorAll('button').forEach(b => b.disabled = true);

  const navItem = questionNav.children[currentIndex];
  if (opt === correct) {
    navItem.classList.add('correct');
    button.classList.add('correct');
    setTimeout(moveNext, 500);
  } else {
    navItem.classList.add('wrong');
    button.classList.add('wrong');
    Array.from(questionContainer.querySelectorAll('button'))
      .find(b => b.textContent === correct)
      .classList.add('correct');
    setTimeout(moveNext, 1500);
  }
}

function moveNext() {
  const last = currentQuiz.questions.length - 1;
  if (currentIndex < last) {
    currentIndex++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

export function finishQuiz() {
  clearInterval(quizTimerInterval);
  quizSection.classList.add('hidden');
  const correctCount = currentQuiz.questions
    .filter((q, i) => userAnswers[i] === q.answer)
    .length;
  scoreText.textContent = `Правильно ${correctCount} із ${currentQuiz.questions.length}.`;
  incorrectQuestions = currentQuiz.questions.filter((q, i) => userAnswers[i] !== q.answer);

  if (incorrectQuestions.length > 0) {
    const existingRepeat = document.querySelector('#repeat-btn');
    if (existingRepeat) existingRepeat.remove();
  
    const repeatBtn = document.createElement('button');
    repeatBtn.textContent = `Повторити неправильні (${incorrectQuestions.length})`;
    repeatBtn.className = 'btn';
    repeatBtn.id = 'repeat-btn';
    repeatBtn.addEventListener('click', () => {
      finishSection.classList.add('hidden');
      startQuiz('repeat', {
        key: 'repeat',
        title: `Повторення помилок: ${currentQuiz.title}`,
        timeLimit: 3,
        questions: incorrectQuestions
      });
    });
    finishSection.appendChild(repeatBtn);
  } else {
    // Якщо була кнопка з попереднього проходження — прибираємо
    const existingRepeat = document.querySelector('#repeat-btn');
    if (existingRepeat) existingRepeat.remove();
  }
  
  

  finishSection.classList.remove('hidden');

  const history = JSON.parse(localStorage.getItem('quiz_history') || '[]');
  history.unshift({
    date: new Date().toLocaleString(),
    topic: currentQuiz.title,
    score: correctCount,
    total: currentQuiz.questions.length
  });
  localStorage.setItem('quiz_history', JSON.stringify(history));
}
