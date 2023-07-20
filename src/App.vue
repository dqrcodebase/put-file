<script setup>
import { ref } from 'vue';
import PutFileTools from './components/PutFileTools.vue'
let chunkSize= ref(1000)
const inspectApiUrl = '/api/annex/oss/v2/upload'
const uploadApiUrl = '/api/annex/oss/v2/upload'
function onchange() {
  console.log("🚀 ~ file: App.vue:5 ~ onchange ~ onchange:")
  chunkSize.value = 2000
}
function inspectHash(hash) {
console.log("🚀 ~ file: App.vue:10 ~ inspectHash ~ hash:", hash)
  if(Math.random() > 0.5) {
    return true
  }else {
    return false
  }
}
function onUploadProgress(progress) {
  console.log("🚀 ~ file: App.vue:19 ~ onUploadProgress ~ progress:", progress)
}
</script>

<template>
  <main>
    {{ chunkSize }}
    <PutFileTools 
      :inspectHash="inspectHash" 
      :inspectApiUrl="inspectApiUrl"
      :uploadApiUrl="uploadApiUrl"
      @onUploadProgress="onUploadProgress"/>
    <div @click="onchange">改变一下</div>
  </main>
</template>

