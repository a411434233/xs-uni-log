import config from './config.js'
import { appOnPageNotFound, enableAppLoad, enableAppOnHidden, enableAppOnShow, enableCustomEvents, enableJsError, enablePageDisplayBlock, enablePageDisplayNone, enablePageLoad, enablePageLodTime } from './methods.js'
import Params from './Params'

/**
 * @param Vue
 * @param options {Config}
 * */
export default (Vue, options = { App: undefined }) => {
  Params.init(config)
  Params.init(options)
  Object.assign(config, options)
  if (options.App) {
    enableAppLoad.call(Vue, options) // 应用加载
    appOnPageNotFound.call(Vue, options) // 页面不存在
    enableAppOnShow.call(Vue, options) // 应用显示
    enableAppOnHidden.call(Vue, options) // 应用隐藏
    enableJsError.call(Vue, options) // JS错误监听
  } else {
    console.error('配置项缺少App配置项')
  }
  Vue.prototype.$report = enableCustomEvents
  Vue.mixin({
    onLoad: function () {
      enablePageLoad(this) // 页面加载
      enablePageLodTime() // 页面加载时间
    },
    onShow() {
      enablePageDisplayBlock(this) // 页面访问量(显示)
    },
    onReady() {},
    onHide() {
      enablePageDisplayNone(this) // 用户离开页面 （页面停留时长)
    },
    onUnload() {
      enablePageDisplayNone(this)// 用户离开页面 （页面停留时长)
    },
    onShareAppMessage() {}
  })
}

