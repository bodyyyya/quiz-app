export const quizzes = {
  'Шкільні предмети': {
    math: {
      name: 'Математика',
      easy: {
        title: 'Математика (Легкий)',
        timeLimit: 3,
        questions: [
          { text: '2 + 2 = ?', options: ['3', '4', '5', '6'], answer: '4' },
          { text: '5 - 2 = ?', options: ['2', '3', '4', '5'], answer: '3' }
        ]
      },
      medium: {
        title: 'Математика (Середній)',
        timeLimit: 5,
        questions: [
          { text: '5 · 3 = ?', options: ['15', '10', '8', '12'], answer: '15' },
          { text: '12 / 4 = ?', options: ['2', '3', '4', '6'], answer: '3' }
        ]
      },
      hard: {
        title: 'Математика (Складний)',
        timeLimit: 7,
        questions: [
          { text: 'Корінь з 81?', options: ['9', '8', '7', '6'], answer: '9' },
          { text: '16 · 2 = ?', options: ['32', '30', '36', '28'], answer: '32' }
        ]
      }
    },
    biology: {
      name: 'Біологія',
      easy: {
        title: 'Біологія (Легкий)',
        timeLimit: 3,
        questions: [
          { text: 'Найменша одиниця життя?', options: ['Тканина', 'Клітина', 'Орган', 'Система'], answer: 'Клітина' },
          { text: 'Орган, що фільтрує кров?', options: ['Печінка', 'Нирки', 'Серце', 'Легені'], answer: 'Нирки' }
        ]
      },
      medium: {
        title: 'Біологія (Середній)',
        timeLimit: 5,
        questions: [
          { text: 'Система, відповідальна за дихання?', options: ['Кровоносна', 'Дихальна', 'Травна', 'Нервова'], answer: 'Дихальна' },
          { text: 'Орган, який виробляє інсулін?', options: ['Печінка', 'Підшлункова', 'Шлунок', 'Селезінка'], answer: 'Підшлункова' }
        ]
      },
      hard: {
        title: 'Біологія (Складний)',
        timeLimit: 7,
        questions: [
          { text: 'Кількість хромосом у людини?', options: ['46', '44', '48', '42'], answer: '46' },
          { text: 'Який вітамін синтезується в шкірі під дією сонця?', options: ['A', 'C', 'D', 'B12'], answer: 'D' }
        ]
      }
    }
  },
  'Загальні знання': {
    geography: {
      name: 'Географія',
      easy: {
        title: 'Географія (Легкий)',
        timeLimit: 3,
        questions: [
          { text: 'Яка столиця Франції?', options: ['Париж', 'Ліон', 'Берлін', 'Рим'], answer: 'Париж' }
        ]
      },
      medium: {
        title: 'Географія (Середній)',
        timeLimit: 5,
        questions: [
          { text: 'Найвища гора у світі?', options: ['Еверест', 'Кіліманджаро', 'Аконкагуа', 'Альпи'], answer: 'Еверест' }
        ]
      },
      hard: {
        title: 'Географія (Складний)',
        timeLimit: 7,
        questions: [
          { text: 'Яка річка найдовша у світі?', options: ['Амазонка', 'Ніл', 'Янцзи', 'Міссісіпі'], answer: 'Ніл' }
        ]
      }
    }
  }
};
