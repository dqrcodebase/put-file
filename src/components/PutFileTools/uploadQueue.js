export default class UploadQueue {
 queueList = []
 computedHash = ''
//  已上传列表
 uploadedList = {}

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

  getQueueLength() {
    return this.queueList.length
  }

  // 切片上传进度
  changeProgress(hash,loaded) {
    this.uploadedList[hash] = loaded
  }
  
  getUploadedList() {
    return this.uploadedList
  }
}
