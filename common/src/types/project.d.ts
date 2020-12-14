declare global {
    interface Window {
        WeixinJSBridge: {
            invoke: (str: string, conf: Object, resultFunc: (result: any) => void)=>void
        },
        ActiveXObject: {
        }
    }
}

export {};
