<script setup>
import { ref } from 'vue'
import PutFileTools from './components/PutFileTools/index.vue'
import axios from 'axios'

let fileProgress = ref(0)
const inspectApiUrl = '/api/uploadChunk/inspect'
const uploadApiUrl = '/api/uploadChunk'
const uploadFinishApiUrl = '/api/uploadChunk/finish'

async function inspectRequest(hash, file) {
  console.log('🚀 ~ file: App.vue:13 ~ inspectRequest ~ file:', file)
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
  // console.log("onUploadProgress  progress", progress)
}

function onChange(file) {
  // console.log('onChange  file',file)
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
</script>

<template>
  <main>
    {{ fileProgress }}
    <PutFileTools
      :uploadApiUrl="uploadApiUrl"
      :inspectRequest="inspectRequest"
      @onUploadProgress="onUploadProgress"
      @onChange="onChange"
      @onFinish="onFinish"
    />
    <div @click="onchange">改变一下</div>
  </main>
</template>
