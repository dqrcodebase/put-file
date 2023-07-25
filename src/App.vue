<script setup>
import { ref } from 'vue';
import PutFileTools from './components/PutFileTools.vue'
import axios from 'axios'

let fileProgress= ref(0)
const inspectApiUrl = '/api/inspect/'
const uploadApiUrl = '/api/uploadChunk'
async function onchange() {
  console.log("🚀 ~ file: App.vue:5 ~ onchange ~ onchange:")
}

async function inspectRequest(hash) {
  console.log("🚀 ~ file: App.vue:14 ~ inspectRequest ~ hash:", hash)
  const res = await axios({
    method: 'GET',
    url: `/api/inspect/${hash}`,
    data: hash
  }).catch(error => {
    console.log("🚀 ~ file: PutFileTools.vue:93 ~ inspectRequest ~ error:", error)
  })
  console.log("🚀 ~ file: App.vue:22 ~ inspectRequest ~ res:", res)
  return res.data.data
}

// 上传进度
function onUploadProgress(progress) {
  fileProgress.value = progress
  console.log("🚀 ~ file: App.vue:19 ~ onUploadProgress ~ progress:", progress)
}

async function fileUploadRequest(chunk) {
  console.log("🚀 ~ file: App.vue:32 ~ fileUploadRequest ~ chunk:", chunk)
  const res = await axios({
    method: 'POST',
    url: uploadApiUrl,
    // onUploadProgress: function (progressEvent) {
    //   console.log("🚀 ~ file: App.vue:36 ~ fileUploadRequest ~ progressEvent:", progressEvent)
    //   // 处理原生进度事件
    // },
  }).catch(error => {
    console.log("🚀 ~ file: PutFileTools.vue:93 ~ inspectRequest ~ error:", error)
  })
  console.log("🚀 ~ file: App.vue:43 ~ fileUploadRequest ~ res:", res)
  return res
}
</script>

<template>
  <main>
    {{ fileProgress }}
    <PutFileTools 
      :fileUploadRequest="fileUploadRequest"
      :inspectApiUrl="inspectApiUrl"
      :uploadApiUrl="uploadApiUrl"
      @onUploadProgress="onUploadProgress"/>
    <div @click="onchange">改变一下</div>
  </main>
</template>

