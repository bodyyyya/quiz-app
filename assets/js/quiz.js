let currentQuiz, currentIndex;
let userAnswers;
let quizTimerInterval, totalTimeLeft;
let incorrectQuestions = [];
let score = 0;
let streak = 0;

const correctSound = new Audio('assets/sounds/correct.mp3');
const wrongSound = new Audio('assets/sounds/wrong.mp3');

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

export function startQuiz(key, quiz, index = 0, answers = []) {
  currentQuiz = { ...quiz, key };
  currentIndex = index;
  userAnswers = answers.length ? answers : new Array(quiz.questions.length).fill(null);
  score = typeof quiz.score === 'number' ? quiz.score : 0;
  streak = typeof quiz.streak === 'number' ? quiz.streak : 0;
  const timeMinutes = quiz.timeLimit || 5;
  const fullTime = timeMinutes * 60;
  const timerBar = document.getElementById('timer-bar');
  timerBar.style.width = '100%';
  document.getElementById('score-counter').textContent = `Бали: ${score}`;
  quizTitle.textContent = quiz.title;
  finishSection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });


  buildNav();
  renderQuestion();

  clearInterval(quizTimerInterval);
  totalTimeLeft = typeof quiz.remainingTime === 'number' ? quiz.remainingTime : fullTime;

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

    localStorage.setItem('resume_quiz', JSON.stringify({
      key,
      quiz,
      index: currentIndex,
      answers: userAnswers,
      title: quiz.title,
      score,
      streak,
      remainingTime: totalTimeLeft
    }));    

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
  currentQuiz.questions.forEach((q, idx) => {
    const item = document.createElement('div');
    item.className = 'nav-item';
    item.textContent = idx + 1;

    const answer = userAnswers[idx];
    if (answer !== null && answer !== undefined) {
      if (answer === q.answer) {
        item.classList.add('correct');
      } else {
        item.classList.add('wrong');
      }
    }

    item.addEventListener('click', () => {
      currentIndex = idx;
      renderQuestion();
    });

    questionNav.appendChild(item);
  });

  Array.from(questionNav.children).forEach((el, idx) => {
    el.classList.toggle('active', idx === currentIndex);
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

  if (q.type === 'boolean') {
    ['Правда', 'Неправда'].forEach(label => {
      const val = label === 'Правда';
      const btn = document.createElement('button');
      btn.textContent = label;

      if (userAnswers[currentIndex] !== null && userAnswers[currentIndex] !== undefined) {
        btn.disabled = true;

        if (val === userAnswers[currentIndex]) {
          btn.classList.add(val === q.answer ? 'correct' : 'wrong');
        }

        if (val === q.answer && userAnswers[currentIndex] !== q.answer) {
          btn.classList.add('correct');
        }
      }

      btn.addEventListener('click', () => selectAnswer(btn, val));
      questionContainer.appendChild(btn);
    });
  } else {
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt;

      if (userAnswers[currentIndex] !== null && userAnswers[currentIndex] !== undefined) {
        btn.disabled = true;

        if (opt === userAnswers[currentIndex]) {
          btn.classList.add(opt === q.answer ? 'correct' : 'wrong');
        }

        if (opt === q.answer && userAnswers[currentIndex] !== q.answer) {
          btn.classList.add('correct');
        }
      }

      btn.addEventListener('click', () => selectAnswer(btn, opt));
      questionContainer.appendChild(btn);
    });
  }
}

function selectAnswer(button, opt) {
  const q = currentQuiz.questions[currentIndex];
  const correct = q.answer;
  userAnswers[currentIndex] = opt;

  questionContainer.querySelectorAll('button').forEach(b => b.disabled = true);

  const navItem = questionNav.children[currentIndex];

  const streakEl = document.getElementById('streak-indicator');
  if (streakEl) {
    streakEl.classList.add('hidden');
    streakEl.textContent = '';
  }
  if (opt === correct) {
    correctSound.play();

    streak++;
    let gained = 10;

    if (streak > 1) {
      const bonus = 5 * (streak - 1);
      gained += bonus;
    }

    score += gained;
    showScorePopup(gained);
    document.getElementById('score-counter').textContent = `Очки: ${score}`;
    navItem.classList.add('correct');
    button.classList.add('correct');

    if (streak >= 2) {
      streakEl.textContent = `🔥 Серія правильних відповідей: ${streak}`;
      streakEl.classList.remove('hidden');
      streakEl.style.animation = 'none';
      streakEl.offsetHeight;
      streakEl.style.animation = '';
    } else {
      streakEl.classList.add('hidden');
    }

    setTimeout(moveNext, 500);
  } else {
    wrongSound.play();

    streak = 0;
    streakEl.classList.add('hidden');

    navItem.classList.add('wrong');
    button.classList.add('wrong');

    const correctBtn = Array.from(questionContainer.querySelectorAll('button')).find(b => {
      if (q.type === 'boolean') {
        return (b.textContent === 'Правда' && q.answer === true) ||
               (b.textContent === 'Неправда' && q.answer === false);
      } else {
        return b.textContent === q.answer;
      }
    });
    if (correctBtn) correctBtn.classList.add('correct');    

    setTimeout(moveNext, 1500);
  }
}


function showScorePopup(points = 10) {
  const popup = document.getElementById('score-popup');
  popup.textContent = `+${points}`;
  popup.classList.remove('hidden');

  popup.style.animation = 'none';
  popup.offsetHeight;
  popup.style.animation = '';
  popup.classList.add('score-popup');

  setTimeout(() => popup.classList.add('hidden'), 1000);
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

function getStreaks(answers, questions) {
  let streak = 0;
  let streaks = [];

  for (let i = 0; i < answers.length; i++) {
    if (answers[i] === questions[i].answer) {
      streak++;
    } else {
      if (streak > 0) streaks.push(streak);
      streak = 0;
    }
  }

  if (streak > 0) streaks.push(streak);
  return streaks;
}


export function finishQuiz() {
  clearInterval(quizTimerInterval);
  quizSection.classList.add('hidden');

  localStorage.removeItem('resume_quiz');

  const resumeBtn = document.querySelector('#resume-btn');
  if (resumeBtn) resumeBtn.remove();


  const correctCount = currentQuiz.questions
    .filter((q, i) => userAnswers[i] === q.answer)
    .length;

  scoreText.textContent = `Правильно ${correctCount} із ${currentQuiz.questions.length}. Загальний рахунок: ${score} балів.`;
  incorrectQuestions = currentQuiz.questions.filter((q, i) => userAnswers[i] !== q.answer);

  const existingRepeat = document.querySelector('#repeat-btn');
  if (existingRepeat) existingRepeat.remove();

  if (incorrectQuestions.length > 0) {
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
  }

  finishSection.classList.remove('hidden');
  document.getElementById('score-counter').textContent = '';
  const history = JSON.parse(localStorage.getItem('quiz_history') || '[]');
  history.unshift({
    date: new Date().toLocaleString(),
    key: currentQuiz.key,
    topic: currentQuiz.title,
    score: correctCount,
    total: currentQuiz.questions.length,
    points: score,
    streakMax: Math.max(...getStreaks(userAnswers, currentQuiz.questions))
  });  
  localStorage.setItem('quiz_history', JSON.stringify(history));
}