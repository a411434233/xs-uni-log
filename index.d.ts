import Vue from 'vue'

import {Config} from "./config";
import {params} from "./Params";

export default function install(vue: typeof Vue, options: Config): void


export interface report {
    (p: params): void
}


declare module 'vue/types/vue' {
    export interface Vue {
        $report: (p: report) => void
    }
}
