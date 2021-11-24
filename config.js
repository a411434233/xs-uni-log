export default {
  aid: 'appId',
  tag: 'clientId',
  ot: 'query', // 来源渠道名称
  url: 'https://xsmddata.cn-hangzhou.log.aliyuncs.com/logstores/mddatatest/track.gif?APIVersion=0.6.0', // 上报接口
  debug: true, // 日志打印
  // 应用隐藏
  enableAppOnHidden: true,
  // 应用显示
  enableAppOnShow: true,
  // 监听小程序启动
  enableAppLoad: true,
  // 监听小程序切入后台
  enableAppHide: true,
  // 页面加载时长
  enablePageLoadTime: true,
  // 自定义代码上报事件
  enableCustomEvents: true,
  // 页面配置点击事件
  enablePageOnClick: true,
  // 页面停留时长
  enablePageSayTime: true,
  // 页面访问量
  enablePageDisplay: true,
  // 页面隐藏
  enablePageDisplayNone: true,
  // 用户操作记录
  userOperationRecord: true,
  // 页面不存在
  onPageNotFound: true,
  // JS错误
  enableJsError: true,
  watchList: [],
  beforeUpdate: function (Params) {
    Params.oid = 'openId'
    Params.uid = 'userId'
  }
}
