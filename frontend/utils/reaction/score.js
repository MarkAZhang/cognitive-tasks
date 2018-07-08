import { filter, sum, map } from 'lodash/fp'

const getScorableAnswers = stage =>
  filter(action => action.type === 'answer', stage.actions)

export const getAvgTime = currentStage => {
  const scorableAnswers = getScorableAnswers(currentStage)

  const avgTime = sum(map('ms', scorableAnswers)) / scorableAnswers.length

  return avgTime
}
