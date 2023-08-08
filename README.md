# put-file-tools 适用于vue3的大文件上传插件

## 序言

> put-file-tools是一款针对大文件，超大文件上传的全方位解决方案，支持断点续传，持久化续传，全程状态监控，严格的请求队列模式，分片传输造成高并发的同时，又保障了数据传输的稳定性。

## 属性

| 参数                |                  说明                           | 类型           |  可选值      |  默认值                  |
| ------------------- | ------------------------------ | ------------- | -------------| ---------------------------------------- |
| chunkSize           | 切片大小                                        | number         | —            | 10 * 1024 * 1024         |
| inspectRequest      | <div style="width: 200pt"> 校验文件是否在服务器中存在,已上传返回true，未上传返回false，上传部分切片返回切片hash数组,数组示例：['537746f9cfb594a7','69898a563de05a1a']</div>     | function(hash)       | —     | —        |
| uploadApiUrl        | 上传文件的接口地址                               | string        | —     | —        |
| concurrencyNumber   | 切片上传的并发数                                 | number        | —     | 3         |

## 方法

| 事件名               |                  说明                           | 回调参数          |
| ------------------- | ------------------------------------------------ |  ------- |
| onChange            | 文件状态改变时的钩子，添加文件会被调用     | function(file)         |
| onUploadProgress    | 返回文件上传进度                                  | function(progress)         |
| uploadError         | 上传失败                                         |function(error)        |
| onFinish            | 上传完成                                         |function(hash)        |

## 安装使用

```
$ npm install put-file-tools
```

```
$ yarn add put-file-tools
```
```vue

<template>
  <div id="app">
    <PutFileTools 
      :uploadApiUrl="uploadApiUrl"
      :inspectRequest="inspectRequest"
      @onUploadProgress="onUploadProgress"
      @onChange="onChange"/>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import PutFileTools from 'PutFileTools'
import axios from 'axios'

let fileProgress = ref(0)
const inspectApiUrl = '/api/uploadChunk/inspect'
const uploadApiUrl = '/api/uploadChunk'
const uploadFinishApiUrl = '/api/uploadChunk/finish'

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
  console.log("onUploadProgress  progress", progress)
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
</script>
```
