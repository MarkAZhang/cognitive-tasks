const {has} = require('lodash/fp')

const DIRECTIONS = {
  down: 'column',
  right: 'row',
}

const ALIGNS = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  stretch: 'stretch',
  baseline: 'baseline',
}

const JUSTIFIES = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  spaceBetween: 'space-between',
  spaceAround: 'space-around',
}

const flex = (rule, direction, align = 'stretch', justify = 'start') => {
  if (!has(direction, DIRECTIONS)) throw rule.error(`Invalid direction: ${direction}.`)
  if (!has(align, ALIGNS)) throw rule.error(`Invalid alignment: ${align}.`)
  if (!has(justify, JUSTIFIES)) throw rule.error(`Invalid justification: ${justify}.`)
  return {
    display: 'flex',
    flexDirection: DIRECTIONS[direction],
    alignItems: ALIGNS[align],
    justifyContent: JUSTIFIES[justify],
  }
}

module.exports = flex
