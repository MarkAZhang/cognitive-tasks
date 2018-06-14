import { filter } from 'lodash/fp'

const calculateAccuracyForN = (userAnswers, n) => {
  const recentAnswers = filter(
    answer => answer.n === n,
    userAnswers
  )

  const correctAnswers = filter(
    answer => answer.userAnswer === answer.correctAnswer,
    recentAnswers
  )

  return correctAnswers.length / recentAnswers.length
}

export default calculateAccuracyForN
