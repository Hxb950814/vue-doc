/*
* 配置地址： http://www.mescroll.com/api.html?v=191101#methods
* */

declare module 'mescroll.js' {
    interface MeScrollOption{
        up: {
            // use?: boolean; // 默认为true
            // auto?: boolean; // 默认为true
            // isLock?: boolean; // 默认为false
            // isBoth?: boolean; // 默认为false
            // isBounce?: boolean; // 默认为false
            // offset?: number; // 默认为100
            // noMoreSize?: number; // 默认为5
        },
        down: {

        }
    }

    interface MeScroll {
        constructor: (sel: string, config: MeScrollOption)=>MeScrollInstance;
    }

    interface MeScrollInstance {
        version: string;
        optDown: number;
        optUp: number;
        os: {
            ios: boolean;
            android: boolean;
            pc: boolean;
        };
        endByPage: (dataSize: number, totalPage: number, systime?: number) => void;
        endBySize: (dataSize: number, totalPage: number, systime?: number) => void;
        endSuccess: (dataSize: number, hasNext: boolean, systime?: number) => void;
        endErr: ()=>void;
        beforeRouteLeave: () => {};
        beforeRouteEnter: () => {};
        destroy: ()=>void;
        resetUpScroll: (isShowLoading?: boolean)=>void; // 重置列表为第一页
        triggerDownScroll: ()=>void;
        triggerUpScroll: ()=>void;
        setPageNum: (num: number)=>void;
        setPageSize: (size: number)=>void;
        scrollTo: (y: number, t?:number/* 时间 */)=>void;/* 默认t=300 */
        lockDownScroll: (isLock?: boolean)=>void;
        lockUpScroll: (isLock?: boolean)=>void;
        setBounce: (isBounce: boolean)=>void;
        lazyLoad: (delay?: number)=>void; /* 默认=500 */
    }
}
