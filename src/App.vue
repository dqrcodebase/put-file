<script setup>
import { ref } from 'vue';
import PutFileTools from './components/PutFileTools.vue'
import axios from 'axios'

let fileProgress= ref(0)
const inspectApiUrl = '/api/uploadChunk/inspect/'
const uploadApiUrl = '/api/uploadChunk'

async function inspectRequest(hash) {
  // console.log("🚀 ~ file: App.vue:14 ~ inspectRequest ~ hash:", hash)
  const res = await axios({
    method: 'GET',
    url: `${inspectApiUrl}/${hash}`,
    data: hash
  }).catch(error => {
    // console.log("inspectRequest  error:", error)
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

</script>

<template>
  <main>
    {{ fileProgress }}
    <PutFileTools 
      :uploadApiUrl="uploadApiUrl"
      :inspectRequest="inspectRequest"
      @onUploadProgress="onUploadProgress"
      @onChange="onChange"/>
    <div @click="onchange">改变一下</div>
  </main>
</template>

