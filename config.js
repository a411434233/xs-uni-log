export default {
  aid: 'appId',
  tag: 'clientId',
  ot: 'query', // 来源渠道名称
  url: 'https://xsmddata.cn-hangzhou.log.aliyuncs.com/logstores/mddatatest/track.gif?APIVersion=0.6.0', // 上报接口(测试）
  debug: false, // 日志打印
  // 应用隐藏
  enableAppOnHidden: false,
  // 应用显示
  enableAppOnShow: false,
  // 监听小程序启动
  enableAppLoad: false,
  // 监听小程序切入后台
  enableAppHide: false,
  // 页面加载时长
  enablePageLoadTime: false,
  // 自定义代码上报事件
  enableCustomEvents: false,
  // 页面配置点击事件
  enablePageOnClick: false,
  // 页面停留时长
  enablePageSayTime: false,
  // 页面访问量
  enablePageDisplay: false,
  // 页面隐藏
  enablePageDisplayNone: false,
  // 用户操作记录
  userOperationRecord: false,
  // 页面不存在
  onPageNotFound: false,
  // JS错误
  enableJsError: false,
  watchList: [],
  beforeUpdate: function (Params) {
    Params.oid = 'openId'
    Params.uid = 'userId'
  }
}
