export const quizzes = {
  'Шкільні предмети': [
    {
      key: 'math',
      title: 'Математика',
      timeLimit: 5,
      questions: [
        { text: '2 + 2 = ?', options: ['3', '4', '5', '6'], answer: '4' },
        { text: '5 · 3 = ?', options: ['15', '10', '8', '12'], answer: '15' }
      ]
    },
    {
      key: 'biology',
      title: 'Біологія',
      timeLimit: 5,
      questions: [
        { text: 'Найменша одиниця життя?', options: ['Тканина', 'Клітина', 'Орган', 'Система'], answer: 'Клітина' },
        { text: 'Орган, що фільтрує кров?', options: ['Печінка', 'Нирки', 'Серце', 'Легені'], answer: 'Нирки' }
      ]
    }
  ],
  'Загальні знання': [
    {
      key: 'geography',
      title: 'Географія',
      timeLimit: 5,
      questions: [
        { text: 'Яка столиця Франції?', options: ['Париж', 'Ліон', 'Берлін', 'Рим'], answer: 'Париж' }
      ]
    }
  ]
};
