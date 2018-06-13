import { range, random, pull, forEach } from 'lodash/fp'

const MATCH_CHANCE = 0.25

const SHAPES = [
  'circle',
  'square',
  'star',
  'triangle',
]

export const getRandomFrom = array =>
  array[random(0, array.length - 1)]

export const generateShapes = (n, number, forceFirst) => {
  const shapes = []

  // Force the first shape to match, for example purposes.
  let isForced = false

  forEach(i => {
    if (i < n) {
      shapes.push(getRandomFrom(SHAPES))
      return
    }
    if ((forceFirst && !isForced) || random(1, true) < MATCH_CHANCE) {
      shapes.push(shapes[i - n])
      isForced = true
    } else {
      shapes.push(getRandomFrom(pull(shapes[i - n], SHAPES)))
    }
  }, range(0, number))
  return shapes
}
