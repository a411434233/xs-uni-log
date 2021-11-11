class Params {
  constructor(options) {
    this.ul = '' // url
    this.ref = '' // from //
    this.ot = '' // 站外来源
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
    this.et = '' // 事件类型 访问/关注/收藏/点击/搜索/离开
    this.aid = options.aid || '' // appid
    this.uid = options.uid || '' // userid
    this.oid = options.oid || '' // openId
    this.v = {}// 扩展信息
    this.refresh(options)
  }

  refresh(options) {
    if (typeof options !== 'object') return console.error('opetion必须为对象')
    for (const key in this) {
      if (options[key] !== undefined) {
        this[key] = options[key]
      }
    }
    uni.getSystemInfo({
      success: res => {
        this.os = res.model
        this.ov = res.system
        this.br = res.version
        this.bv = res.SDKVersion
        this.sr = res.screenHeight + '*' + res.screenWidth
      }
    })
  }

  clearEventInfo() {
    this.et = ''
    this.ex = ''
    this.ey = ''
  }
}

module.exports = Params
