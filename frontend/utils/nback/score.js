import { filter } from 'lodash/fp'

const getCurrentNAnswers = (actions, n) =>
  filter(o => o.type === 'answer' && o.n === n, actions)

const getScorableAnswers = answers =>
  filter(o => o.index >= o.n, answers)

const getWrongAnswers = answers =>
  filter(o => o.userAnswer !== o.correctAnswer, answers)

const getCorrectAnswers = answers =>
  filter(o => o.userAnswer === o.correctAnswer, answers)

const getCorrectPositiveAnswers = answers =>
  filter(o => o.userAnswer === 'yes' && o.correctAnswer === 'yes', answers)

export const calculateAccuracyForN = (userAnswers, n) => {
  const currentNAnswers = getCurrentNAnswers(userAnswers, n)
  const scorableAnswers = getScorableAnswers(currentNAnswers)

  return getCorrectAnswers(scorableAnswers).length / scorableAnswers.length
}

export const getCurrentNBreakdown = (userAnswers, n) => {
  const currentNAnswers = getCurrentNAnswers(userAnswers, n)

  const scorableAnswers = getScorableAnswers(currentNAnswers)

  return {
    currentNAnswers,
    scorableAnswers,
    wrongAnswers: getWrongAnswers(scorableAnswers),
    correctPositiveAnswers: getCorrectPositiveAnswers(scorableAnswers),
  }
}
