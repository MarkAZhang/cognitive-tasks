class ActionManager {
  constructor() {
    this.lastTime = new Date()
  }

  reset = () => {
    this.lastTime = new Date()
  }

  getActionEntry = (type, params = {}) => {
    const newTime = new Date()

    const newActionEntry = {
      type,
      timestamp: newTime,
      ms: newTime.getTime() - this.lastTime.getTime(),
      ...params,
    }

    this.lastTime = newTime

    return newActionEntry
  }
}

const ACTION_MANAGER = new ActionManager()

export default ACTION_MANAGER
