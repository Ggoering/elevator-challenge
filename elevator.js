import Person from './person'

export default class Elevator {
  constructor() {
    this.currentFloor = 0;
    this.currentQueueUp = []
    this.nextQueueUp = []
    this.currentQueueDown = []
    this.nextQueueDown = []
    this.trips = 0
    this.atCapacity = false
    this.history = []
    this.currentTime = 0
  }

  reset() {
    this.currentFloor = 0;
    this.currentQueueUp = []
    this.nextQueueUp = []
    this.currentQueueDown = []
    this.nextQueueDown = []
    this.atCapacity = false
    this.floorsTraversed = 0
    this.trips = 0
    this.stops = 0
    this.history = []
    this.currentTime = 0
  }

  goToFloor(mockUser) {
    new Promise((resolve, reject) => {
        if (mockUser.dropOffFloor > mockUser.currentFloor) {
          this.atCapacity ? this.nextQueueUp.push(mockUser.currentFloor, mockUser.dropOffFloor) : this.currentQueueUp.push(mockUser.currentFloor, mockUser.dropOffFloor)
        }
        else if (mockUser.dropOffFloor < mockUser.currentFloor) {
          this.atCapacity ? this.nextQueueDown.push(mockUser.currentFloor, mockUser.dropOffFloor) : this.currentQueueDown.push(mockUser.currentFloor, mockUser.dropOffFloor)
        }

        if (this.currentQueueUp.length) this.currentQueueUp = this.removeDuplicatesUp(this.currentQueueUp)
        if (this.currentQueueDown.length) this.currentQueueDown = this.removeDuplicatesDown(this.currentQueueDown)
        resolve()
    })
    .then(() => {
      if(this.currentQueueUp.length || this.currentQueueDown.length) {
      new Promise((resolve, reject) => {
        if (this.determineDirection()) {
            this.move(this.currentQueueUp, this.currentQueueUp[0])
            if (this.currentQueueDown.length) this.move(this.currentQueueDown, this.currentQueueDown[0])
            resolve()
        } else {
            this.move(this.currentQueueDown, this.currentQueueDown[0])
            if (this.currentQueueUp.length) this.move(this.currentQueueUp, this.currentQueueUp[0])
            resolve()
        }
        })
        .then(() => {
          if (this.currentTime > 12) this.currentFloor = 0
        })
      }
    })
  }



  removeDuplicatesUp(queue) {
     return queue.filter(function(element, index, array) {
     return array.indexOf(element) === index;
   })
   .sort((a, b) => a - b)
 }

  removeDuplicatesDown(queue) {
     return queue.filter(function(element, index, array) {
     return array.indexOf(element) === index;
   })
   .sort((a, b) => b - a )
 }

  move(queue, startingAt) {
    const nextFloorDelta = Math.abs(this.currentFloor - startingAt)
    this.floorsTraversed += nextFloorDelta
    this.currentFloor = startingAt
    while(queue.length) {
      this.floorsTraversed += Math.abs(this.currentFloor - queue[0])
      this.currentFloor = queue[0]
      this.stops += 1
      this.history.push(this.currentFloor)
      queue.shift()
    }
    if (nextFloorDelta === 0) this.stops -= 1
  }

  determineDirection() {
    if (this.currentQueueUp.length && this.currentQueueDown.length) {
      const nearestRiderUp = this.currentQueueUp[0]
      const nearestRiderDown = this.currentQueueDown[0]
      if (Math.abs(this.currentFloor - nearestRiderUp) < Math.abs(this.currentFloor - nearestRiderDown)) {
        return true
      } else {
        return false
      }
    } else {
      if (!this.currentQueueUp.length) {
        return false
      } else {
        return true
      }
    }
  }

}
