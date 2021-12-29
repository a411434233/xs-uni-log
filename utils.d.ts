import {watchList} from "./config";

export interface envOptions {
    isWechat: boolean;
    isAliPay: boolean
}


export interface Utils {
    getPageConfig(page: any): watchList

    useSwitch(switchName: string, page?: any): boolean
}


export const util: Utils

export default util

