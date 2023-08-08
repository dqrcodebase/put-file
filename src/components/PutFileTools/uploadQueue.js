export default class UploadQueue {
 queueList = []
 computedHash = ''

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

  concurrencyQueue() {
    const queue = []
    for(let i = 0; i < this.concurrencyNumber; i++) {
      if(this.queueList.length === 0) break
      queue.push(this.shift())
    }
    return queue
  }

  queueLength() {
    return this.queueList.length
  }

  saveComputedHash(computedHash) {
    this.computedHash = computedHash
  }
}
