class Params {
  constructor() {
    this.ul = '' // url
    this.ref = '' // from
    this.ot = '' // 站外来源
    this.tag = '' // 渠道来源
    this.t = ''		// title
    this.rm = '' // timestamp(操作时间)
    this.os = ''	// 系统
    this.ov = '' // 版本号
    this.br = ''	// 浏览器
    this.bv = ''	// 浏览器版本
    this.sr = ''	// 屏幕分辨率
    this.ex = ''	// 事件触发 x 坐标
    this.ey = ''	// 事件触发 y 坐标
    this.el = ''	// 事件名称  xs_event_xxxxx
    this.et = '' // 事件类型 访问（access）/关注/收藏(collect)/点击(click)/搜索(search)/离开（leave） /停留（stay）/异常（error) / 自定义（custom)
    this.aid = '' // appid
    this.uid = '' // userid
    this.oid = '' // openId
    this.v = {}// 扩展信息
  }

  init(options) {
    if (typeof options !== 'object') return console.error('opetion必须为对象')
    for (const key in this) {
      if (Object.hasOwnProperty.call(options, key) && options[key] !== undefined) {
        this[key] = options[key]
      }
    }
    const res = uni.getSystemInfoSync()
    this.os = res.model
    this.ov = res.system
    this.br = res.version
    this.bv = res.SDKVersion || res.version
    this.sr = res.screenHeight + '*' + res.screenWidth
  }

  clearEventInfo() {
    this.et = ''
    this.ex = ''
    this.ey = ''
    this.v = {}
  }

  setEventInfo($event) {
    this.et = $event?.type ?? 'tap'
    this.ex = $event?.detail?.x ?? ''
    this.ey = $event?.detail?.y ?? ''
  }
}

export default new Params()
