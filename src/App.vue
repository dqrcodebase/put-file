<script setup>
import { ref } from 'vue';
import PutFileTools from './components/PutFileTools.vue'
let chunkSize= ref(1000)
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
</script>

<template>
  <main>
    {{ chunkSize }}
    <PutFileTools :inspectHash="inspectHash" />
    <div @click="onchange">改变一下</div>
  </main>
</template>

