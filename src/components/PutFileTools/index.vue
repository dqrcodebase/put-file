<script setup>
import SparkMD5, { hash } from 'spark-md5'
import { ref } from 'vue'
import axios from 'axios'
import UploadQueue from './uploadQueue.js'

const props = defineProps({
  // 切片大小
  chunkSize: {
    type: Number,
    default: 10 * 1024 * 1024, // 10MB
  },
  /**
   * @description 校验文件是否在服务器中存在
   * @return {Boolean | Array} 如果在服务器中上传了部分切片则返回这些切片的hash
   */
  inspectRequest: {
    type: Function,
    default: '',
  },
  // 校验是否已经上传到服务的接口地址
  inspectApiUrl: {
    type: String,
    default: '',
  },
  // 上传文件的接口地址
  uploadApiUrl: {
    type: String,
    default: '',
  },
  // 切片上传的并发数
  concurrencyNumber: {
    type: Number,
    default: 3,
  },
})

const emits = defineEmits([
  'onUploadProgress',
  'uploadError',
  'onChange',
  'onFinish',
])

let blobSlice = null
let file = null
// 整个文件的hash
let computedHash = ''
// 文件大小
let fileSize = 0
// 切片数
let chunkNumber = 0
// 当前处理的切片索引
let currentChunkIndex = 0
// 当前上传的切片索引
let currentUploadChunkIndex = 0
// 是否已经在服务器存在
let isLoaded = false
let fileReader = null
// 上传进度
let progress = 0
// 切片列表信息
let chunkList = []
// 已上传列表
let uploadedChunkList = []
let spark = null
// 已上传大小
let uploadedSize = 0
let uploadQueue = null

function init() {
  computedHash = ''
  fileSize = 0
  uploadedSize = 0
  progress = 0
  isLoaded = false
  chunkNumber = 0
  currentChunkIndex = 0
  currentUploadChunkIndex = 0
  file = null
  uploadedChunkList = []
  uploadQueue = new UploadQueue(props.concurrencyNumber)
  chunkList = []
}

async function onchange(e) {
  init()
  blobSlice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice
  file = e.target.files[0]
  emits('onChange', file)
  fileProcessing()
}

// 把文件处理成切片
function fileProcessing() {
  fileSize = file.size
  chunkNumber = Math.ceil(file.size / props.chunkSize)
  spark = new SparkMD5.ArrayBuffer()
  fileReader = new FileReader()
  currentChunkIndex = 0

  fileReader.onload = async function (e) {
    const chunkFormData = new FormData()
    // 切片的hash
    let chunkHash = SparkMD5.ArrayBuffer.hash(e.target.result)

    spark.append(e.target.result)
    // 切片文件
    chunkFormData.append('chunk', new Blob([e.target.result]))
    // 切片文件hash
    chunkFormData.append('chunkHash', chunkHash)
    const fileUpload = fileUploadRequest(chunkFormData)
    uploadQueue.add(fileUpload)
    chunkList.push({
      chunkHash,
      formData: chunkFormData,
    })
    currentChunkIndex++
    if (currentChunkIndex < chunkNumber) {
      loadNext()
    } else {
      computedHash = spark.end()
      isLoaded = await inspectRequest()
      cheakChunkUpload()
    }
  }

  fileReader.onerror = function () {
    console.warn('oops, something went wrong.')
  }
  loadNext()
}

// 读取文件切片
function loadNext() {
  const start = currentChunkIndex * props.chunkSize
  const end =
    start + props.chunkSize >= file.size ? file.size : start + props.chunkSize

  // 按字节读取文件内容
  fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
}

// 校验文件是否在服务器中存在
async function inspectRequest() {
  if (props.inspectRequest) {
    const data = await props.inspectRequest(computedHash, file)
    return data
  } else {
    return false
  }
}

// 上传请求
function fileUploadRequest(chunkFormData) {
  return function () {
    return new Promise((resolve) => {
      chunkFormData.append('hash', computedHash)
      axios({
        method: 'POST',
        url: props.uploadApiUrl,
        data: chunkFormData,
        headers: {
          hash: computedHash,
          chunkHash: chunkFormData.get('chunkHash'),
        },
        onUploadProgress: function (progressEvent) {
          onUploadProgress(progressEvent, chunkFormData)
        },
      })
        .then((res) => {
          uploadedChunkList.push(chunkFormData.get('chunkHash'))
          resolve(res, chunkFormData)
        })
        .catch((error) => {
          emits('uploadError', error)
        })
    })
  }
}

// 切片上传
async function chunkUpload() {
  const uploadChunkQueue = uploadQueue.concurrencyQueue()
  uploadChunkQueue.forEach((item) => {
    item().then((res) => {
      uploadQueueShift()
    })
  })
}

function uploadQueueShift() {
  const queueLength = uploadQueue.getQueueLength()
  if (queueLength === 0 && uploadedChunkList.length === chunkList.length) {
    emits('onFinish', computedHash)
    return
  }
  if (queueLength > 0) {
    uploadQueue
      .shift()()
      .then((res) => {
        uploadQueueShift()
      })
  }
}

async function cheakChunkUpload() {
  if (isLoaded === true) {
    // 验证文件是否已经在服务端存在，如果存在，那就不用上传了，相当于秒传成功。
    progress = 100
    emits('onUploadProgress', progress)
  } else {
    if (isLoaded === false) {
      chunkUpload()
    } else if (Object.prototype.toString.call(isLoaded) === '[object Array]') {
    }
  }
}

// 上传进度
function onUploadProgress(progressEvent, chunkFormData) {
  uploadQueue.changeProgress(
    chunkFormData.get('chunkHash'),
    progressEvent.loaded
  )
  const uploadedList = uploadQueue.getUploadedList()
  let uploadedSize = 0
  for (let hash in uploadedList) {
    uploadedSize += uploadedList[hash]
  }
  progress = (uploadedSize / fileSize).toFixed(3)
  progress = progress > 1? 1 : progress
  emits('onUploadProgress', progress)
}
</script>

<template>
  <div class="greetings">
    <input type="file" @change="onchange" />
  </div>
</template>
