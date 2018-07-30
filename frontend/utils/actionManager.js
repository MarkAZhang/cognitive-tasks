import { getDateString } from '~/utils/time'

class ActionManager {
  constructor() {
    this.lastTime = new Date()
  }

  reset = () => {
    this.lastTime = new Date()
  }

  getActionEntry = (type, metadata = {}, msAdj = 0) => {
    const newTime = new Date()

    const newActionEntry = {
      type,
      timestamp: getDateString(newTime),
      ms: newTime.getTime() - this.lastTime.getTime() - msAdj,
      metadata,
    }

    this.lastTime = newTime

    return newActionEntry
  }
}

const ACTION_MANAGER = new ActionManager()

export default ACTION_MANAGER
