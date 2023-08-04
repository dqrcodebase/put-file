export default class UploadQueue {
 queueList = []

  constructor(concurrencyNumber) {
    this.concurrencyNumber = concurrencyNumber
  }

  add(item) {
    this.queueList.push(item)
  }

  shift() {
    if(this.queueList.length === 0) return
    return this.queueList.shift()
  }

  concurrencyQueue(computedHash) {
    const queue = []
    for(let i = 0; i < this.concurrencyNumber; i++) {
      queue.push(this.shift())
    }
    return queue
  }

  queueLength() {
    return this.queueList.length
  }
}
