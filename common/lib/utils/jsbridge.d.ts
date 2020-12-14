export default class JsBridge {
    static instance: JsBridge;
    static getInstance(): JsBridge;
    private readyCallbackFunc;
    constructor();
    onReady(cb: Function): void;
    invoke(funName: string, paramText: string, cb: (errCode: number | string, data: any) => void): void;
    register(funName: string, cb: Function): void;
}
