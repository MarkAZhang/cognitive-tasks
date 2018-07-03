import { range, random } from 'lodash/fp'

export const generateDigits = (n) =>
  range(0, n).map(() => random(0, 9))

