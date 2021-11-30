import config from './config.js'

const envOptions = {
  isWechat: false,
  isAliPay: false
}
//  #ifdef  MP-WEIXIN
envOptions.isWechat = true
//  #endif
// #ifdef  MP-ALIPAY
envOptions.isAliPay = true
// #endif

export default {
  getPageConfig(page) {
    let pageConfig
    if (envOptions.isAliPay) pageConfig = config.watchList.find(value => value.path.indexOf(page.$page.fullPath) >= 0)
    if (envOptions.isWechat) pageConfig = config.watchList.find(value => value.path.indexOf(page.route) >= 0)
    return pageConfig
  },
  useSwitch(switchName, page = undefined) {
    config.debug && console.log(config[switchName], switchName)
    if (config[switchName] === false) return true
    if (config[switchName] === undefined) return true
    if (page === undefined) return false
    const pageConfig = this.getPageConfig(page)
    if (pageConfig === undefined) return false
    return pageConfig[switchName] === false
  }
}
