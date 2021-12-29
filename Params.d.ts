export interface params {
    /**  上报参数 - 当前页面地址   */
    ul?: string,
    /**  上个页面地址   */
    ref?: string,
    /**   站外来源   */
    ot?: string,
    /**   页面标题   */
    t?: string,
    /**   渠道来源   */
    tag?: string,
    /**   操作时间   */
    rm?: any,
    os?: string,
    ov?: string,
    br?: string,
    bv?: string,
    sr?: string,
    ex?: string,
    ey?: string,
    el?: string,
    et?: string,
    aid?: string,
    uid?: string,
    oid?: string,
    v?: any,

    init(params: any): void

    clearEventInfo(): void

    setEventInfo(event: events): void
}

export interface events {
    type?: string,
    detail?: object
}


export const Params: params

export default Params

