require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/
});

const assert = require('chai').assert;
const Elevator = require('../elevator').default;

describe('Elevator', function() {
  let elevator = new Elevator();

  beforeEach(function() {
    elevator.reset();
  });

  it('should bring a rider to a floor above their current floor', (done) => {
    let mockUser = { name: "Brittany", currentFloor: 2, dropOffFloor: 5 };
      elevator.goToFloor(mockUser);
      new Promise((resolve, reject ) => {
        assert.equal(elevator.stops, 0)
        assert.equal(elevator.floorsTraversed, 0)
        assert.equal(elevator.currentFloor, 0)
        assert.deepEqual(elevator.history, [])
        assert.deepEqual(elevator.currentQueueUp, [2, 5])
        assert.deepEqual(elevator.currentQueueDown, [])
      resolve()
    })
    .then(() => {
      assert.equal(elevator.stops, 2)
      assert.equal(elevator.floorsTraversed, 5)
      assert.equal(elevator.currentFloor, 5);
      assert.deepEqual(elevator.history, [2, 5])
      done()
    })
  });

  it('should bring a rider to a floor below their current floor', (done) => {
    let mockUser = { name: "Brittany", currentFloor: 8, dropOffFloor: 3 };
      elevator.goToFloor(mockUser);
      new Promise((resolve, reject ) => {
        assert.equal(elevator.stops, 0)
        assert.equal(elevator.floorsTraversed, 0)
        assert.equal(elevator.currentFloor, 0)
        assert.deepEqual(elevator.history, [])
        assert.deepEqual(elevator.currentQueueUp, [])
        assert.deepEqual(elevator.currentQueueDown, [8, 3])
      resolve()
    })
    .then(() => {
      assert.equal(elevator.stops, 2)
      assert.equal(elevator.floorsTraversed, 13)
      assert.equal(elevator.currentFloor, 3);
      assert.deepEqual(elevator.history, [8, 3])
      done()
    })
  });

  it('should handle lots of simultaneous requests, and execute them from up to down', (done) => {
    let mockUserA = { name: "Bob", currentFloor: 3, dropOffFloor: 9 };
    let mockUserB = { name: "Sue", currentFloor: 6, dropOffFloor: 2 };
    elevator.goToFloor(mockUserA);
    elevator.goToFloor(mockUserB);
    new Promise((resolve, reject) => {
      assert.equal(elevator.stops, 0)
      assert.equal(elevator.floorsTraversed, 0)
      assert.equal(elevator.currentFloor, 0)
      assert.deepEqual(elevator.history, [])
      assert.deepEqual(elevator.currentQueueUp, [3, 9])
      assert.deepEqual(elevator.currentQueueDown, [6, 2])
      resolve();
    })
    .then(() => {
      assert.equal(elevator.stops, 4)
      assert.equal(elevator.floorsTraversed, 16)
      assert.equal(elevator.currentFloor, 2);
      assert.deepEqual(elevator.history, [3, 9, 6, 2])
      done()
    })
  });

  it('should handle multiple simultaneous requests, and execute them from down to up', (done) => {
    let mockUserA = { name: "Bob", currentFloor: 3, dropOffFloor: 9 };
    let mockUserB = { name: "Sue", currentFloor: 6, dropOffFloor: 2 };
    elevator.currentFloor = 29
    elevator.goToFloor(mockUserA);
    elevator.goToFloor(mockUserB);
    new Promise((resolve, reject) => {
      assert.equal(elevator.stops, 0)
      assert.equal(elevator.floorsTraversed, 0)
      assert.equal(elevator.currentFloor, 29)
      assert.deepEqual(elevator.history, [])
      assert.deepEqual(elevator.currentQueueUp, [3, 9])
      assert.deepEqual(elevator.currentQueueDown, [6, 2])
      resolve();
    })
    .then(() => {
      assert.equal(elevator.stops, 4)
      assert.equal(elevator.floorsTraversed, 34)
      assert.equal(elevator.currentFloor, 9);
      assert.deepEqual(elevator.history, [6, 2, 3, 9])
      done()
    })
  });


  it('should make make 1 stop for identical pick ups or drop offs', (done) => {
    let mockUserA = { name: "Luna", currentFloor: 3, dropOffFloor: 9 };
    let mockUserB = { name: "The", currentFloor: 3, dropOffFloor: 9 };
    let mockUserC = { name: "Perfect", currentFloor: 3, dropOffFloor: 9 };
    let mockUserD = { name: "Angel", currentFloor: 9, dropOffFloor: 8 };

    elevator.goToFloor(mockUserA);
    elevator.goToFloor(mockUserB);
    elevator.goToFloor(mockUserC);
    elevator.goToFloor(mockUserD);
    new Promise((resolve, reject) => {
      assert.equal(elevator.stops, 0)
      assert.equal(elevator.floorsTraversed, 0)
      assert.equal(elevator.currentFloor, 0)
      assert.deepEqual(elevator.history, [])
      assert.deepEqual(elevator.currentQueueUp, [3, 9])
      assert.deepEqual(elevator.currentQueueDown, [9, 8])
      resolve();
    })
    .then(() => {
      assert.equal(elevator.stops, 3)
      assert.equal(elevator.floorsTraversed, 10)
      assert.equal(elevator.currentFloor, 8);
      assert.deepEqual(elevator.history, [3, 9, 9, 8])
      done()
    })
  });

  it('current position of elevator determines who gets picked up first, not who calls it first', (done) => {
    let mockUserA = { name: "Snake", currentFloor: 1, dropOffFloor: 9 };
    let mockUserB = { name: "Eyez", currentFloor: 11, dropOffFloor: 5 };
    elevator.currentFloor = 10
    elevator.goToFloor(mockUserA);
    elevator.goToFloor(mockUserB);
    new Promise((resolve, reject) => {
      assert.equal(elevator.stops, 0)
      assert.equal(elevator.floorsTraversed, 0)
      assert.equal(elevator.currentFloor, 10)
      assert.deepEqual(elevator.history, [])
      assert.deepEqual(elevator.currentQueueUp, [1, 9])
      assert.deepEqual(elevator.currentQueueDown, [11, 5])
      resolve();
    })
    .then(() => {
      assert.equal(elevator.stops, 4)
      assert.equal(elevator.floorsTraversed, 19)
      assert.equal(elevator.currentFloor, 9);
      assert.deepEqual(elevator.history, [11, 5, 1, 9])
      done()
    })
  });

  it('current position of elevator determines who gets picked up first, rather than who calls it first', (done) => {
    let mockUserA = { name: "Daigo", currentFloor: 1, dropOffFloor: 9 };
    let mockUserB = { name: "Umehara", currentFloor: 11, dropOffFloor: 5 };
    elevator.currentFloor = 10
    elevator.goToFloor(mockUserB);
    elevator.goToFloor(mockUserA);
    new Promise((resolve, reject) => {
      assert.equal(elevator.stops, 0)
      assert.equal(elevator.floorsTraversed, 0)
      assert.equal(elevator.currentFloor, 10)
      assert.deepEqual(elevator.history, [])
      assert.deepEqual(elevator.currentQueueUp, [1, 9])
      assert.deepEqual(elevator.currentQueueDown, [11, 5])
      resolve();
    })
    .then(() => {
      assert.equal(elevator.stops, 4)
      assert.equal(elevator.floorsTraversed, 19)
      assert.equal(elevator.currentFloor, 9);
      assert.deepEqual(elevator.history, [11, 5, 1, 9])
      done()
    })
  });

  it('Picks up users based on the furthest user in either queue being closest to the currentFloor', (done) => {
    let mockUserA = { name: "Justin", currentFloor: 1, dropOffFloor: 4 };
    let mockUserB = { name: "Wong", currentFloor: 3, dropOffFloor: 4 };
    elevator.currentFloor = 4
    elevator.goToFloor(mockUserB);
    elevator.goToFloor(mockUserA);
    new Promise((resolve, reject) => {
      assert.equal(elevator.stops, 0)
      assert.equal(elevator.floorsTraversed, 0)
      assert.equal(elevator.currentFloor, 4)
      assert.deepEqual(elevator.history, [])
      assert.deepEqual(elevator.currentQueueUp, [1, 3, 4])
      assert.deepEqual(elevator.currentQueueDown, [])
      resolve();
    })
    .then(() => {
      assert.equal(elevator.stops, 3)
      assert.equal(elevator.floorsTraversed, 6)
      assert.equal(elevator.currentFloor, 4);
      assert.deepEqual(elevator.history, [1, 3, 4])
      done()
    })
  });

  it('Picks up users based on the furthest user in either queue being closest to the currentFloor', (done) => {
    let mockUserA = { name: "Doop", currentFloor: 18, dropOffFloor: 8 };
    let mockUserB = { name: "Derp", currentFloor: 9, dropOffFloor: 1 };
    elevator.currentFloor = 10
    elevator.goToFloor(mockUserB);
    elevator.goToFloor(mockUserA);
    new Promise((resolve, reject) => {
      assert.equal(elevator.stops, 0)
      assert.equal(elevator.floorsTraversed, 0)
      assert.equal(elevator.currentFloor, 10)
      assert.deepEqual(elevator.history, [])
      assert.deepEqual(elevator.currentQueueUp, [])
      assert.deepEqual(elevator.currentQueueDown, [18, 9, 8, 1])
      resolve();
    })
    .then(() => {
      assert.equal(elevator.stops, 4)
      assert.equal(elevator.floorsTraversed, 25)
      assert.equal(elevator.currentFloor, 1);
      assert.deepEqual(elevator.history, [18, 9, 8, 1])
      done()
    })
  });

  it('is maximizes efficiency by delivering everyone in one of the queues, and then everyone in the other', (done) => {
    let mockUserA = { name: "Lee", currentFloor: 3, dropOffFloor: 9 };
    let mockUserB = { name: "Jae", currentFloor: 3, dropOffFloor: 9 };
    let mockUserC = { name: "Dong", currentFloor: 1, dropOffFloor: 15 };
    let mockUserD = { name: "Best", currentFloor: 6, dropOffFloor: 2 };
    let mockUserE = { name: "Person", currentFloor: 16, dropOffFloor: 7 };
    let mockUserF = { name: "Alive", currentFloor: 6, dropOffFloor: 1 };
    elevator.goToFloor(mockUserA);
    elevator.goToFloor(mockUserE);
    elevator.goToFloor(mockUserC);
    elevator.goToFloor(mockUserF);
    elevator.goToFloor(mockUserD);
    elevator.goToFloor(mockUserB);
    new Promise((resolve, reject) => {
      assert.equal(elevator.stops, 0)
      assert.equal(elevator.floorsTraversed, 0)
      assert.equal(elevator.currentFloor, 0)
      assert.deepEqual(elevator.history, [])
      assert.deepEqual(elevator.currentQueueUp, [1, 3, 9, 15])
      assert.deepEqual(elevator.currentQueueDown, [16, 7, 6, 2, 1])
      resolve();
    })
    .then(() => {
      assert.equal(elevator.stops, 9)
      assert.equal(elevator.floorsTraversed, 31)
      assert.equal(elevator.currentFloor, 1);
      assert.deepEqual(elevator.history, [1, 3, 9, 15, 16, 7, 6, 2, 1])
      done()
    })
  });

  it('should automatically go to floor 0 if the time is past 12:00, and the queue is empty', (done) => {
    elevator.currentTime = 14
    let mockUserA = { name: "Lee", currentFloor: 3, dropOffFloor: 9 };
    elevator.goToFloor(mockUserA);
    new Promise((resolve, reject) => {
      assert.equal(elevator.currentFloor, 0)
      assert.equal(elevator.currentTime, 14)
      resolve();
    })
    .then(() => {
      new Promise((resolve, reject) => {
        resolve()
      })
      .then(() => {
        assert.equal(elevator.currentFloor, 0);
        assert.deepEqual(elevator.history, [3, 9])
        assert.deepEqual(elevator.currentQueueUp, []);
        assert.deepEqual(elevator.currentQueueDown, []);
        done()
      })
    })
  })

  it('should stay at the current floor if the time is less than 12:00', (done) => {
    elevator.currentTime = 6
    let mockUserA = { name: "Lee", currentFloor: 3, dropOffFloor: 9 };
    elevator.goToFloor(mockUserA);
    new Promise((resolve, reject) => {
      assert.equal(elevator.currentFloor, 0)
      assert.equal(elevator.currentTime, 6)
      resolve();
    })
    .then(() => {
      new Promise((resolve, reject) => {
        resolve()
      })
      .then(() => {
        assert.equal(elevator.currentFloor, 9);
        assert.deepEqual(elevator.history, [3, 9])
        assert.deepEqual(elevator.currentQueueUp, []);
        assert.deepEqual(elevator.currentQueueDown, []);
        done()
      })
    })

  })

});
