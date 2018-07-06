import { filter } from 'lodash/fp'

const getFirstShapeActions = stage =>
  filter(action => action.type === 'action' && action.metadata.actionType === 'first_shapes' , stage.actions)

const getScorableAnswers = stage =>
  filter(action => action.type === 'answer', stage.actions)

const getWrongAnswers = answers =>
  filter(ans => ans.metadata.userWasCorrect === 'no', answers)

const getCorrectAnswers = answers =>
  filter(ans => ans.metadata.userWasCorrect === 'yes', answers)

const getCorrectPositiveAnswers = answers =>
  filter(ans => ans.metadata.userAnswer === 'yes' && ans.metadata.correctAnswer === 'yes', answers)

export const calculateAnswerAccuracy = (currentStage) => {
  const scorableAnswers = getScorableAnswers(currentStage)

  return getCorrectAnswers(scorableAnswers).length / scorableAnswers.length
}

export const getAnswerBreakdown = (currentStage) => {
  const scorableAnswers = getScorableAnswers(currentStage)

  return {
    scorableAnswers,
    firstShapeActions: getFirstShapeActions(currentStage),
    wrongAnswers: getWrongAnswers(scorableAnswers),
    correctPositiveAnswers: getCorrectPositiveAnswers(scorableAnswers),
  }
}
