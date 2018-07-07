import { filter } from 'lodash/fp'

const getScorableAnswers = stage =>
  filter(action => action.type === 'answer', stage.actions)

const getWrongAnswers = answers =>
  filter(ans => ans.metadata.userWasCorrect === 'no', answers)

export const wasAnswerCorrect = currentStage => {
  const scorableAnswers = getScorableAnswers(currentStage)
  return getWrongAnswers(scorableAnswers).length === 0
}
