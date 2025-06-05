import { quizzes } from './data.js';

export function showStats() {
  const history = JSON.parse(localStorage.getItem('quiz_history') || '[]');

  const statsByTopic = {};

  function getTopicDisplayName(topicKey) {
    for (const group of Object.values(quizzes)) {
      if (group[topicKey]) return group[topicKey].name;
    }
    return topicKey;
  }

  const levelNames = {
    easy: 'Легкий',
    medium: 'Середній',
    hard: 'Складний'
  };

  for (const entry of history) {
    if (!entry?.key || !entry.key.includes('_')) continue;

    const [topicKey, levelKey] = entry.key.split('_');
    const baseKey = topicKey;

    if (!statsByTopic[baseKey]) {
      statsByTopic[baseKey] = {
        totalAttempts: 0,
        totalScore: 0,
        totalQuestions: 0,
        bestByLevel: {}
      };
    }

    const stats = statsByTopic[baseKey];
    stats.totalAttempts++;
    stats.totalScore += entry.score;
    stats.totalQuestions += entry.total;

    if (!stats.bestByLevel[levelKey] || entry.score > stats.bestByLevel[levelKey].score) {
      stats.bestByLevel[levelKey] = {
        score: entry.score,
        total: entry.total
      };
    }
  }

  const container = document.createElement('section');
  container.className = 'card';

  const title = document.createElement('h1');
  title.textContent = '📊 Статистика користувача';
  container.appendChild(title);

  Object.entries(statsByTopic).forEach(([topicKey, stat]) => {
    const avg = (stat.totalScore / stat.totalQuestions * 100).toFixed(1);

    const block = document.createElement('div');
    block.className = 'stats-block';
    block.innerHTML = `
      <h2>${getTopicDisplayName(topicKey)}</h2>
      <p>Середній бал: ${avg}%</p>
      <p>Кількість проходжень: ${stat.totalAttempts}</p>
    `;

    Object.entries(stat.bestByLevel).forEach(([level, res]) => {
      const percent = ((res.score / res.total) * 100).toFixed(1);
      const p = document.createElement('p');
      p.className = `stats-level ${level}`;
      p.textContent = `${levelNames[level] || level}: ${res.score}/${res.total} (${percent}%)`;
      block.appendChild(p);
    });

    container.appendChild(block);
  });

  const backBtn = document.createElement('button');
  backBtn.textContent = '← Назад';
  backBtn.className = 'btn';
  backBtn.addEventListener('click', () => {
    container.remove();
    document.getElementById('topic-selection').classList.remove('hidden');
  });
  container.appendChild(backBtn);

  document.querySelector('.container').appendChild(container);
  document.getElementById('topic-selection').classList.add('hidden');
}
