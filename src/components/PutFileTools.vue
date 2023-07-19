<script setup>
import SparkMD5 from 'spark-md5'
const props = defineProps({
  // 切片大小
  chunkSize: {
    type: Number,
    default: 1048576 * 10 // 1MB
  },
  /**
   * @description 校验文件是否在服务器中存在
   * @return {Boolean}
   */
  inspectHash: {
    type: Function,
    default: () => {
      return () => {}
    }
  }
})

function onchange() {
  const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
  const file = this.files[0]
    // 整个文件的hash
  const computedHash = SparkMD5.ArrayBuffer.hash(file)
  // 切片数
  const chunks = Math.ceil(file.size / props.chunkSize)
  const spark = new SparkMD5.ArrayBuffer()
  const fileReader = new FileReader();
  // 当前处理的切片索引
  let currentChunk = 0
  // 是否已经在服务器存在
  let isLoaded = props.inspectHash(computedHash)
  
  fileReader.onload = function (e) {
    console.log("🚀 ~ file: PutFileTools.vue:36 ~ onchange ~ e:", e)
    console.log('read chunk nr', currentChunk + 1, 'of', chunks);
    spark.append(e.target.result);                 
    // 切片的hash
    let hexHash = SparkMD5.ArrayBuffer.hash(e.target.result)
    console.log('hexHash',hexHash);
    currentChunk++;

    if (currentChunk < chunks) {
      const formData = new FormData()
      // 切片文件
      formData.append('chunk', e.target.result)
      // 切片文件hash
      formData.append('hash', hexHash)
        loadNext();
    } else {
        computedHash = spark.end()
        console.log('finished loading');
        console.info('computed hash', computedHash);  // Compute hash
        // 验证文件是否已经在服务端存在，如果存在，那就不用上传了，相当于秒传成功。
        console.log("🚀 ~ file: PutFileTools.vue:47 ~ onchange ~ res:", isLoaded)
    }
  };

  fileReader.onerror = function () {
    console.warn('oops, something went wrong.');
  };

  // 读取文件切片
  function loadNext() {
    const start = currentChunk * props.chunkSize
    const end = ((start + props.chunkSize) >= file.size) ? file.size : start + props.chunkSize;
    // 按字节读取文件内容
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }

  loadNext();

}
</script>

<template>
  <div class="greetings">
    <input type="file" :onchange="onchange">
  </div>
</template>
