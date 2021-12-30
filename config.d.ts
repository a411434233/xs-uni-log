import {params} from "./Params";

export interface watchList {
    title: string,
    path: string,
    methods: Array<string>
}

export interface Config {
    App?: any,
    aid?: string,
    tag?: string,
    /**   渠道来源   */
    ot?: string,
    /**   数据上报地址   */
    url?: string,
    /**   是否在控制台输入log   */
    debug?: boolean,
    /**   应用隐藏   */
    enableAppOnHidden?: false,
    /**   应用显示   */
    enableAppOnShow?: false,
    /**   监听小程序启动   */
    enableAppLoad?: false,
    /**   监听小程序切入后台   */
    enableAppHide?: false,
    /**   页面加载时长   */
    enablePageLoadTime?: false,
    /**   自定义代码上报事件   */
    enableCustomEvents?: false,
    /**   页面配置点击事件   */
    enablePageOnClick?: false,
    /**   页面停留时长   */
    enablePageSayTime?: false,
    /**   页面访问量   */
    enablePageDisplay?: false,
    /**   页面隐藏   */
    enablePageDisplayNone?: false,
    /**   用户操作记录   */
    userOperationRecord?: false,
    /**   页面不存在   */
    onPageNotFound?: false,
    /**   JS错误   */
    enableJsError?: false,
    /**   自定义监听配置   */
    watchList?: Array<watchList>

    beforeUpdate?(p: params): any
}

export const config: Config

export default config
