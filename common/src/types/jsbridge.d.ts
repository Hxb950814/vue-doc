declare global {
    interface Window {
        tkJsBridgeReady: (cb: () => void) => void,
        tkJsBridgeCallback: {},
        tkJsBridge: {};
        tkJsBridgeLoaded: boolean;
    }
}
export {};
