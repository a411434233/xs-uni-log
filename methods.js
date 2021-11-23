import config from './config.js'
import Params from './Params.js'
import utils from './utils.js'

const PageInfo = {
  pageShowTime: 0,
  pageHiddenTime: 0,
  pageStartLoadTime: 0,
  pageEndLoadTime: 0,
  appShowTime: 0,
  appHiddenTime: 0,
  appStartLoadTime: 0,
  appEndLoadTime: 0
}
let _this
let _thisPage
const userPortrait = []

/**
 * 页面不存在
 * */
export function appOnPageNotFound(options) {
  if (!config.onPageNotFound) return
  const { onPageNotFound } = options.App
  options.App.onPageNotFound = function (e) {
    Params.v = JSON.stringify(e)
    consoleLogs('appOnPageNotFound')
    onPageNotFound && onPageNotFound.call(options.App, ...arguments)
  }
}

/**
 * 日志打印
 * */
export function consoleLogs(title) {
  if (config.debug) console.log(title, JSON.parse(JSON.stringify(Params)))
}

/**
 * JS错误监听
 */
export function enableJsError(options) {
  if (!config.enableJsError) return
  const { onError } = options.App
  options.App.onError = function (e) {
    Params.et = 'error'
    Params.v = {
      err: JSON.stringify(e)
    }
    dataReport()
    consoleLogs('enableJsError')
    if (onError) onError.call(options.App)
  }
}

/**
 * 页面加载
 * */
export function enablePageLoad(that) {
  _this = that
  _thisPage = that.$mp.page
  const query = _this.$mp.query
  PageInfo.pageStartLoadTime = Date.now()
  Params.ref = Params.ul || '/'
  Params.ul = _thisPage.route
  if (query && query[config.ot]) {
    Params.ot = query[config.ot]
    Params.tag = Params.ot
  }
  const pageConfig = utils.getPageConfig(_thisPage)
  Params.t = pageConfig ? pageConfig.title : ''
  enablePageOnClick.call(_this)
}

/**
 * 页面加载时间
 * */
export function enablePageLodTime() {
  if (!config.enablePageLoadTime) return
  if (utils.isPageClose(_thisPage, 'enablePageLoadTime')) return
  const onReady = _thisPage.onReady
  _thisPage.onReady = function () {
    PageInfo.pageEndLoadTime = Date.now()
    Params.et = 'load'
    Params.v = { _loadTime: PageInfo.pageEndLoadTime - PageInfo.pageStartLoadTime }
    dataReport()
    consoleLogs('enablePageLoadTime')
    onReady && onReady.call(_thisPage)
  }
}

/**
 * 页面显示监听
 * */
export function enablePageDisplayBlock() {
  PageInfo.pageShowTime = Date.now()
  if (!config.enablePageDisplay) return
  if (utils.isPageClose(_thisPage, 'enablePageDisplay')) return
  const onShow = _thisPage.onShow
  _thisPage.onShow = function () {
    Params.et = 'access'
    dataReport()
    consoleLogs('enablePageDisplay')
    userOperationRecord('enablePageDisplay')
    onShow && onShow.call(_thisPage)
  }
}

/**
 * 页面隐藏监听
 * */
function onPageHide(fn) {
  return function () {
    enablePageSayTime()
    pageHidden()
    fn.call(this)
  }
}

export function enablePageDisplayNone() {
  const { onHide, onUnload } = _thisPage
  _thisPage.onHide = onPageHide(onHide)
  _thisPage.onUnload = onPageHide(onUnload)
}

/**
 *页面离开或隐藏
 * */
function pageHidden() {
  if (config.enablePageDisplayNone === false) return
  if (utils.isPageClose(_thisPage, 'enablePageDisplayNone')) return
  Params.et = 'leave'
  Params.v = { _leaveTime: PageInfo.pageHiddenTime }
  dataReport()
  consoleLogs('enablePageDisplayNone')
  userOperationRecord('enablePageDisplayNone')
}

/**
 *页面停留时长
 */
export function enablePageSayTime() {
  PageInfo.pageHiddenTime = Date.now()
  if (config.enablePageSayTime === false) return
  if (utils.isPageClose(_thisPage, 'enablePageSayTime')) return
  Params.et = 'stay'
  Params.v = { _stayTime: PageInfo.pageHiddenTime - PageInfo.pageShowTime }
  dataReport()
  consoleLogs('enablePageSayTime')
}

/**
 * 自定义上报事件
 * @param callback {function(Params)}
 * */
export function enableCustomEvents(callback) {
  if (!config.enableCustomEvents) return
  if (utils.isPageClose(_thisPage, 'enableCustomEvents')) return
  if (callback) callback(Params)
  if (!Params.et) Params.et = 'custom'
  dataReport()
  consoleLogs('enableCustomEvents')
  userOperationRecord('enableCustomEvents')
}

/**
 * 应用启动
 * */
export function enableAppLoad(options) {
  const { onLaunch } = options.App
  options.App.onLaunch = function (op) {
    onLaunch && onLaunch.call(this, ...arguments)
    if (op.query && op.query[options.ot]) {
      Params.ot = op.query[options.ot]
      Params.tag = Params.ot
    } else {
      Params.ot = op.scene
      Params.tag = Params.ot
    }
    consoleLogs('enableAppLoad')
  }
}

/**
 * 应用启动时长
 * */
export function enableAppLoadTime() {

}

/**
 * 应用显示
 * */
export function enableAppOnShow(options) {
  if (!config.enableAppOnShow) return
  const onShow = options.App.onShow
  options.App.onShow = function () {
    onShow && onShow.call(this)
    PageInfo.appShowTime = Date.now()
    Params.v = {
      name: 'enableAppOnShow'
    }
    consoleLogs('enableAppOnShow')
    userOperationRecord('enableAppOnShow')
  }
}

/**
 * 应用隐藏
 * */
export function enableAppOnHidden(options) {
  if (!config.enableAppOnHidden) return
  const onHide = options.App.onHide
  options.App.onHide = function () {
    onHide && onHide.call(this)
    PageInfo.appHiddenTime = Date.now()
    Params.v = {
      name: 'enableAppOnHidden',
      appShowTime: PageInfo.appShowTime - PageInfo.appHiddenTime
    }
    consoleLogs('enableAppOnHidden')
    userOperationRecord('enableAppOnHidden')
  }
}

/**
 * 页面配置点击事件
 * */
export function enablePageOnClick() {
  if (config.enablePageOnClick === false) return
  if (utils.isPageClose(_thisPage, 'enablePageOnClick')) return
  const pageConfig = utils.getPageConfig(_thisPage)
  if (pageConfig && pageConfig.methods.length > 0) {
    const methods = _this.$options.methods
    for (const fName in methods) {
      if (Object.hasOwnProperty.call(methods, fName) && pageConfig.methods.includes(fName)) {
        const copyEv = methods[fName]
        this[fName] = function ($event = {}) {
          customEv($event, { fName: fName })
          copyEv.call(_this, ...arguments)
        }
      }
    }
  }
}


function customEv($event = {}, query = {}) {
  Params.setEventInfo($event)
  Params.v = query
  Params.rm = Date.now()
  Params.el = query.fName || ''
  Params.v._name = '自定义上报事件'
  dataReport()
  consoleLogs('enablePageOnClick', Params)
  userOperationRecord('enablePageOnClick')
}

/**
 * 用户操作记录
 * */
export function userOperationRecord(title) {
  if (!config.userOperationRecord) return
  userPortrait.push({ title, Params: JSON.stringify(Params), dateTime: Date.now() })
  config.debug && console.log(userPortrait)
}

/**
 *参数序列化
 * */
export function queryParse(data, enObj = {}) {
  if (data && Object.keys(data).length === 0) return enObj
  for (const key in data) {
    if (typeof data[key] === 'object' && Object.hasOwnProperty.call(data, key)) {
      queryParse(data[key], enObj)
    } else {
      enObj[key] = data[key]
    }
  }
  return enObj
}

/**
 * 数据上报
 * */
async function dataReport() {
  if (Params.ot && Params.et !== 'access') Params.ot = ''
  if (config.beforeUpdate) await config.beforeUpdate(Params)
  const obj = queryParse(Params.v, {})
  delete Params.v
  const jsonData = { ...Params, ...obj }
  uni.request({
    url: config.url,
    data: jsonData,
    method: 'GET',
    dataType: 'string',
    complete: () => {
      Params.ot = ''
      Params.clearEventInfo()
    }
  })
}
