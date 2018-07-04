const getAnimationClassNames = (name, cs) => ({
  appear: cs[`${name}Appear`],
  appearActive: cs[`${name}AppearActive`],
  enter: cs[`${name}Enter`],
  enterActive: cs[`${name}EnterActive`],
  enterDone: cs[`${name}EnterDone`],
  exit: cs[`${name}Exit`],
  exitActive: cs[`${name}ExitActive`],
  exitDone: cs[`${name}ExitDone`],
})

export default getAnimationClassNames
