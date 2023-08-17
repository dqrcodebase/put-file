<script setup>
import { ref } from 'vue'
import PutFileTools from './components/PutFileTools/index.vue'
import axios from 'axios'

let fileProgress = ref(0)
const inspectApiUrl = '/api/uploadChunk/inspect'
const uploadApiUrl = '/api/uploadChunk'
const uploadFinishApiUrl = '/api/uploadChunk/finish'

// 检查文件是否存在服务器中
async function inspectRequest(hash, file) {
  const res = await axios({
    method: 'POST',
    url: `${inspectApiUrl}/${hash}`,
    data: { hash, name: file.name, size: file.size, type: file.type },
  }).catch((error) => {
    console.log('inspectRequest  error:', error)
  })
  return res.data.data
}

// 上传进度
function onUploadProgress(progress) {
  fileProgress.value = progress
  console.log('onUploadProgress  progress', progress)
}

function onChange(file) {
  console.log('onChange  file',file)
}

// 文件切片全部上传完成
async function onFinish(hash) {
  const res = await axios({
    method: 'GET',
    url: `${uploadFinishApiUrl}/${hash}`,
  }).catch((error) => {
    console.log('inspectRequest  error:', error)
  })
}

function uploadError(err) {
  console.log('uploadError err',err);
}
</script>

<template>
  <main>
    {{ fileProgress }}
    <PutFileTools
      :chunkSize="1024 * 1024 * 100"
      :uploadApiUrl="uploadApiUrl"
      :inspectRequest="inspectRequest"
      @onUploadProgress="onUploadProgress"
      @onChange="onChange"
      @onFinish="onFinish"
      @uploadError="uploadError"
    />
  </main>
</template>
