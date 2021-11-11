import Params from './Params'

const pageHistory = []

const params = new Params({})
let Options = {}

/**
 * 数据上报接口
 */
function dataReporting(data) {
  uni.request({
    url: Options.url,
    data: data,
    method: 'GET',
  })
}


function isPageEnable(key, page) {
  let item = Options.watchList.find(value => value.pages === page.route)

  return (item && item[key] !== false || item === undefined)
}


function log($event, query = {}) {
  if (!Options.enableCustomEvents) return
  params.et = $event.type
  params.ex = $event.detail.x
  params.ey = $event.detail.y
  params.v = query
  params.rm = Date.now()
  params.el = query.name || ''
  params.v._name = '自定义上报事件'

  if (Options.debug) console.log(params.v, params)

  if (Options.enablePageHistory) {
    pageHistory.push({
      title: '点击事件',
      urls: params.ul,
      name: query.name,
      time: params.rm
    })
  }

  dataReporting(params)
}

function onPageShow(onShow) {
  params.clearEventInfo()
  const page = this.$mp.page
  let pages = getCurrentPages()
  params.ref = pages.length > 1 ? pages[pages.length - 2].route : '/'
  if (onShow) onShow.call(page, params)
  const nowTime = Date.now()

  //页面浏览记录
  if (Options.enablePageHistory) {
    if (Options.debug) console.log('页面浏览记录', pageHistory)
    pageHistory.push({ title: '进入页面', urls: page.route, time: nowTime })
  }


  //页面显示
  if (Options.enablePageDisplay) {
    if (isPageEnable('enablePageDisplay', pages)) {
      params.ul = page.route
      params.rm = Date.now()
      params.v = {
        _name: '页面显示'
      }
      if (Options.debug) console.log(params.v, params)
      dataReporting(params)
    }
  }

  const onHide = page.onHide
  const onUnload = page.onUnload
  page.onHide = onPageHide.bind(this, 'onHide', nowTime, onHide)
  page.onUnload = onPageHide.bind(this, 'onUnload', nowTime, onUnload)
}

function onPageReady(onReady, loadStTime) {
  const page = this.$mp.page

  //页面加载时长
  if (Options.enablePageLoadTime) {
    if (isPageEnable('enablePageLoadTime', page)) {
      params.v = {
        _name: '页面加载时长',
        _time: Date.now() - loadStTime
      }
      params.ul = page.route
      if (Options.debug) console.log(params.v, params)
      dataReporting(params)
    }
  }
  onReady.call(this.$mp.page)
}

function onPageHide(scopeId, nowTime, fn,) {
  const page = this.$mp.page
  page.onHide = function () {}
  page.onUnload = function () {}
  const endTime = Date.now()

  // 添加浏览记录
  if (Options.enablePageHistory) {
    pageHistory.push({ title: '离开页面', urls: page.route, time: endTime })
  }

  // 监听离开事件
  if (Options.enablePageDisplayNone) {
    if (isPageEnable('enablePageDisplayNone', page)) {
      params.ref = page.route
      params.rm = Date.now()
      params.v = {
        _name: '页面隐藏,离开'
      }
      if (Options.debug) console.log(params.v, params)
      dataReporting(params)
    }
  }

  //页面停留时长
  if (Options.enablePageSayTime) {
    if (isPageEnable('enablePageSayTime', page)) {
      params.v = {
        _name: '页面停留时长',
        _time: endTime - nowTime
      }
      if (Options.debug) console.log(params.v, params)
      dataReporting(params)
    }
  }


  if (fn) fn.call(page)
}

function addEventListener() {
  const page = this.$mp.page
  let item = Options.watchList.find(value => value.pages === page.route)
  if (isPageEnable('enableCustomEvents', page) && item) {
    let that = this
    let methodsList = item.methods
    let methods = this.$options.methods
    for (let mName in methods) {
      if (methodsList.includes(mName)) {
        let copyEv = methods[mName]
        that[mName] = function ($event) {
          params.ul = item.pages
          if ($event && typeof $event === 'object' && $event.type === 'tap') {
            log.call(that, $event, { name: mName })
          } else {
            console.log(`自定义事件 ${mName} 缺少$event`)
          }
          copyEv.call(that, ...arguments)
        }
      }
    }

  }
}

function onPageLoad() {
  params.clearEventInfo()
  const ot = Options.ot

  if (this.$mp.query && this.$mp.query[ot]) params.ot = this.$mp.query[ot]

  const page = this.$mp.page
  let item = Options.watchList.find(value => value.pages === page.route)

  if (item) {
    params.t = item.title || ''
    let pages = getCurrentPages()
    params.ref = pages.length > 1 ? pages[pages.length - 2].route : '/'
  }

  const loadStTime = Date.now()
  const onReady = page.onReady
  page.onReady = onPageReady.bind(this, onReady, loadStTime)

  const onShow = page.onShow
  page.onShow = onPageShow.bind(this, onShow)

  if (Options.enableCustomEvents) {
    addEventListener.call(this)
  }
}

/**
 * @param Vue
 * @param options
 * @param options.debug {boolean} 打印log
 * @param options.enableCustomEvents {boolean} 自定义事件监听
 * @param options.enablePageLoadTime {boolean} 页面首次加载时长
 * @param options.enablePageSayTime {boolean}  页面停留时长
 * @param options.enablePageDisplay {boolean}  页面显示
 * @param options.enablePageDisplayNone {boolean}  页面隐藏||关闭
 * @param options.enablePageHistory {boolean}  浏览记录
 * @param options.enableJsError {boolean}  Js异常
 * @param options.enableAppLoad {boolean}  小程序启动
 * @param options.enableAppHide {boolean}  小程序切入后台
 * @param options.App {object}  应用对象
 * */
export default (Vue, options) => {

  //数据准备阶段
  params.refresh(options)
  Options = options

  const onLaunch = options.App.onLaunch

  if (onLaunch) {
    options.App.onLaunch = function (op) {
      if (op.query && op.query[options.ot]) {
        params.ot = op.query[options.ot]
      }

      /**   JavaScript 异常  Api异常  */
      if (options.enableJsError && options.debug) {
        uni.onError(function (back) {
          console.log('监听到JS错误', back)
        })
      }

      //小程序启动
      if (options.enableAppLoad) {
        console.log('小程序冷启动')
      }
      onLaunch.call(this, ...arguments)
    }
  } else {
    console.log('缺少onLaunch')
  }


  const onHide = options.App.onHide
  if (onHide) {
    options.App.onHide = function () {
      if (options.enableAppHide) {
        console.log('小程序切入后台')
      }
      onHide.call(this, ...arguments)
    }
  } else {
    console.log(`缺少onHide`)
  }


  /**   参数模型对象   */
  Vue.prototype.$Params = params

  /**   嵌入JS自定义上报   */
  Vue.prototype.$log = log
  Vue.mixin({
    onLoad: function () {
      /**   @param this {{$mp:{page:object,route:string}}}   */
      onPageLoad.call(this)
    },
    onShow() {},
    onReady() {},
    onHide() {},
    // 监听分享小程序事件
    onShareAppMessage() {}
  })
}
