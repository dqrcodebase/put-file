import { hash } from "spark-md5"

export default class UploadQueue {
 queueList = []
 queueHashList = []
 computedHash = ''
//  已上传列表
 uploadedList = {}

  constructor(concurrencyNumber) {
    this.concurrencyNumber = concurrencyNumber
  }

  add(hash,item) {
    this.queueHashList.push(hash)
    this.queueList.push(item)
  }

  shift() {
    if(this.queueList.length === 0) return
    this.queueHashList.shift()
    return this.queueList.shift()
  }

  queueListSplice(index,num) {
    this.queueHashList.splice(index,num)
    this.queueList.splice(index,num)
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

  getQueueHashList() {
    return this.queueHashList
  }
}
