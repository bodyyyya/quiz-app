import { quizzes } from './data.js';

export function showStats() {
  document.getElementById('topic-selection').classList.add('hidden');
  document.getElementById('quiz-section')?.classList.add('hidden');
  document.getElementById('finish-section')?.classList.add('hidden');
  document.getElementById('history-section')?.classList?.add('hidden');
  document.getElementById('stats-section')?.remove();

  const history = JSON.parse(localStorage.getItem('quiz_history') || '[]');

  const container = document.createElement('section');
  container.className = 'card';
  container.id = 'stats-section';

  const statsByTopic = {};

  function getTopicDisplayName(topicKey) {
    for (const group of Object.values(quizzes)) {
      if (group[topicKey]) return group[topicKey].name;
    }
    return topicKey;
  }

  function getRank(avgPoints) {
    if (avgPoints >= 320) return '🧠 Мастер';
    if (avgPoints >= 150) return '🔥 Знавак';
    return '✨ Новачок';
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
    stats.totalScore += entry.points || 0;
    stats.totalQuestions += entry.total;
    stats.maxStreak = Math.max(stats.maxStreak || 0, entry.streakMax || 0);

    if (!stats.bestByLevel[levelKey] || entry.score > stats.bestByLevel[levelKey].score) {
      stats.bestByLevel[levelKey] = {
        score: entry.score,
        total: entry.total
      };
    }
  }

  const title = document.createElement('h1');
  title.textContent = '📊 Статистика користувача';
  container.appendChild(title);

  Object.entries(statsByTopic).forEach(([topicKey, stat]) => {
    const avgPoints = stat.totalAttempts > 0
    ? (stat.totalScore / stat.totalAttempts).toFixed(1)
    : '0.0';
    
    const rank = stat.totalAttempts > 0 ? getRank(avgPoints) : '—';

    const block = document.createElement('div');
    block.className = 'stats-block';
    block.innerHTML = `
      <h2>${getTopicDisplayName(topicKey)}</h2>
      <p>Середній рахунок: ${avgPoints} балів</p>
      <p>Спроб: ${stat.totalAttempts}</p>
      <p>🔥 Максимальний стрік: ${stat.maxStreak || 0}</p>
      <p>🏅 Рівень: ${rank}</p>
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
