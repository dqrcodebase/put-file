<script setup>
import SparkMD5 from 'spark-md5'
import { ref } from 'vue';
import axios from 'axios'

const props = defineProps({
  // 切片大小
  chunkSize: {
    type: Number,
    default: 1048576 * 1 // 1MB
  },
  /**
   * @description 校验文件是否在服务器中存在
   * @return {Boolean | Array} 如果在服务器中上传了部分切片则返回这些切片的hash
   */
  inspectRequest: {
    type: Function,
    default: () => {
      return () => {}
    }
  },
  // 上传失败
  uploadError: {
    type: Function,
    default: () => {
      return () => {}
    }
  },
  // 校验是否已经上传到服务的接口地址
  inspectApiUrl: {
    type: String,
    default: '',
  },
  // 上传文件的接口地址
  uploadApiUrl: {
    type: String,
    default: ''
  },
  // 切片上传的并发数
  concurrencyNumber: {
    type: Number,
    default: 3
  },
})

const emits = defineEmits(['onUploadProgress'])


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
let isLoaded = ''
let fileReader = null
// 上传进度
let progress = 0
let uploadChunkQueue = ref([])
let spark = null
// 已上传大小
let uploadedSize = 0


async function onchange() {
  blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
  file = this.files[0]
  fileProcessing()
}

// 把文件处理成切片
function fileProcessing() {
  fileSize = file.size
  chunkNumber = Math.ceil(file.size / props.chunkSize)
  spark = new SparkMD5.ArrayBuffer()
  fileReader = new FileReader();
  currentChunkIndex = 0

  fileReader.onload = async function (e) {
    const formData = new FormData()
    // 切片的hash
    let chunkHash = SparkMD5.ArrayBuffer.hash(e.target.result)

    spark.append(e.target.result)
    // 切片文件
    formData.append('chunk', e.target.result)
    // 切片文件hash
    formData.append('chunkHash', chunkHash)
    const chunkInfo = {chunkHash,formData}
    uploadChunkQueue.value.push(chunkInfo)
    
    currentChunkIndex++;
    if (currentChunkIndex < chunkNumber) {
      loadNext();
    } else {
      computedHash = spark.end()
      if(inspectRequest) {
        isLoaded = await inspectRequest(computedHash)
      }
      // 验证文件是否已经在服务端存在，如果存在，那就不用上传了，相当于秒传成功。
      if(isLoaded === true) {
        progress = 100
        emits('onUploadProgress',progress)
      }else {
        chunkUpload()
      }
    }
  };

  fileReader.onerror = function () {
    console.warn('oops, something went wrong.');
  };
  loadNext();
}

// 读取文件切片
function loadNext() {
  const start = currentChunkIndex * props.chunkSize
  const end = ((start + props.chunkSize) >= file.size) ? file.size : start + props.chunkSize;
  // 按字节读取文件内容
  fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
}

// 校验文件是否在服务器中存在
async function inspectRequest(computedHash) {
  const data = await props.inspectRequest(computedHash)
  return data
}

// 文件上传
async function fileUploadRequest(chunk) {
  const res = await axios({
    method: 'POST',
    url: props.uploadApiUrl,
    data: chunk,
    // onUploadProgress: function (progressEvent) {
    //   console.log("🚀 ~ file: App.vue:36 ~ fileUploadRequest ~ progressEvent:", progressEvent)
    //   uploadedSize += progressEvent.size
    //   progress = uploadedSize / fileSize
    //   emits('onUploadProgress',progress)
    //   // 处理原生进度事件
    // },
  }).catch(error => {
    console.log("🚀 ~ file: PutFileTools.vue:93 ~ inspectRequest ~ error:", error)
    props.uploadError(error)
  })
  console.log("🚀 ~ file: PutFileTools.vue:148 ~ fileUploadRequest ~ res:", res)
}

// 切片上传
async function chunkUpload() {
  if(isLoaded === false) {
    cheakChunkUpload()
  }else if(Object.prototype.toString.call(isLoaded) === '[object Array]') {
    console.log("🚀 ~ file: PutFileTools.vue:159 ~ chunkUpload ~ currentUploadChunkIndex:", currentUploadChunkIndex)

    if(isLoaded.includes(uploadChunkQueue.value[currentUploadChunkIndex]?.chunkHash)) {
      uploadedSize += props.chunkSize
      currentUploadChunkIndex ++
      chunkUpload()
    }else {
      cheakChunkUpload()
    }
  }
}

function cheakChunkUpload() {
    if(currentUploadChunkIndex < chunkNumber){
      currentUploadChunkIndex ++
      fileUploadRequest(uploadChunkQueue.value[currentUploadChunkIndex]).then(res => {
        chunkUpload()
      })
      if(currentUploadChunkIndex < concurrencyNumber) chunkUpload()
    }
}

</script>

<template>
  <div class="greetings">
    <input type="file" :onchange="onchange">
  </div>
</template>
