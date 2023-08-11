
import PutFileTools from './components/PutFileTools/index.vue'

export function install(Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component('PutFileTools', PutFileTools)
}

const plugin = {
  install
}

let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}
console.log("🚀 ~ file: index.js:22 ~ GlobalVue:", GlobalVue)
console.log("🚀 ~ file: index.js:26 ~ PutFileTools:", PutFileTools)

export default PutFileTools
