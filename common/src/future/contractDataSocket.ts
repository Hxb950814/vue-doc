/* 从数据源获取数据 */
/* 只能获取合约数据， 可以获取单个或者多个合约的数据 */
/* 不需要主动销毁， 会监听beforeDestory，会销毁 */

import pako from 'pako';
import to from 'await-to-js';
import {getSituationData} from './operate';

type TypeContractDataSocketListener = (errCode: number, data: any) => void;

export default class ContractDataSocket {
    static COUNT = 0;
    static Pool = new Map(); // socket数组

    private ws: WebSocket | null = null;
    private uid = 0; // 标记
    private idle = true; // 是不是空闲，没有被使用的
    private context: any = null; // context, 传入的vue 实例
    private messageListeners: TypeContractDataSocketListener[] = [];
    private keepCodes: string | string[] = ''; // 保存发送的数据，合约code或者合约code组， 用来在销毁之前关闭

    /* 从socket池里拿出一个空闲socket，如果没有就新建一个 */
    static getIdleDataSocket(context?: any /* vue实例对象 */) {
        if (ContractDataSocket.Pool.size >= 10) {
            console.log('当前websocket 池中socket链接数量已超过10个');
        }
        // console.log('websocket 池数量', ContractDataSocket.Pool.size);
        for (const [, dataSocket] of ContractDataSocket.Pool) {
            if (dataSocket.isIdle()) {
                dataSocket.reset();
                dataSocket.setContext(context);
                return dataSocket;
            }
        }
        const socket = new ContractDataSocket();
        socket.setContext(context);
        return socket;
    }

    constructor(listener?: TypeContractDataSocketListener) {
        if (!('WebSocket' in window)) {
            console.error('您的浏览器不支持websocket');
        }
        if (listener) {
            this.addListener(listener);
        }
        this.reset();
        // 在
        ContractDataSocket.Pool.set(this.uid, this); // 把新创建的socket放到Pool里面
    }

    /* 开始 */
    async connect() {
        // console.log('连接');
        this.idle = false;
        const path = 'cquote.tanxingk.com/api/ws'; // todo : path
        // eslint-disable-next-line no-undef
        return await to<string>(new Promise((resolve: Function, reject: Function) => {
            // 已存在的直接使用原来的
            if (this.ws && this.ws?.readyState === WebSocket.OPEN) {
                resolve('already exists');
                return;
            }

            this.ws = new WebSocket(location.protocol === 'https:' ? 'wss://' + path : 'ws://' + path); // 这里是走代理
            this.ws.onopen = (ev: any): any => {
                resolve('success');
            };
            this.ws.onmessage = (ev: any): any => {
                // 只有状态为open才能处理数据
                if (this.ws?.readyState === WebSocket.OPEN) {
                    const reader = new FileReader();
                    // const dateNow = +new Date();
                    reader.onload = (event: any) => {
                        this.messageListeners.forEach((fn: TypeContractDataSocketListener) => {
                            let targetData = {};
                            let err_code = 0;
                            try {
                                const output = pako.ungzip(reader.result as string);
                                const strData = String.fromCharCode.apply(null, new Uint16Array(output) as any);
                                const resultStr = decodeURIComponent(strData);
                                const respData = JSON.parse(resultStr);
                                // console.log('解析', respData);
                                if (respData.data) {
                                    targetData = respData.data;
                                    if (Array.isArray(targetData)) {
                                        targetData = targetData.map((item: any) => getSituationData(item));
                                    } else {
                                        targetData = getSituationData(targetData); // 大写数据转小写
                                    }
                                } else {
                                    targetData = {};
                                }
                                err_code = +respData.err_code || 0;
                            } catch (e) {
                                console.log('ws数据解析错误', e);
                            }
                            // console.log('获得数据', targetData);
                            // console.log('获得code', err_code, targetData);
                            fn(err_code, targetData); // 错误优先的回调函数
                        });
                    };
                    reader.readAsBinaryString(ev.data);
                }
            };
            this.ws.onerror = (ev: any): any => {
                console.log(ev);
                reject(new Error('connect error'));
            };
        }));
    }

    isIdle() {
       return this.idle;
    }

    // resetUId() {
    //     this.uid = ++ContractDataSocket.COUNT;
    // }

    /* 清空，重置资源 */
    reset() {
        this.uid = ++ContractDataSocket.COUNT;
        this.idle = true;
        this.context = null;
        this.keepCodes = '';
        this.messageListeners.length = 0;
    }

    getUniqueId() {
        return this.uid;
    }

    setContext(context: any) {
        this.context = context;
        if (this.context) {
            // 在离开页面时候进行销毁，而不需要主动去调用销毁
            this.context.$once && this.context.$once('hook:beforeDestroy', this.hookBeforeDestroy);
        }
    }

    /* 被动关闭时候调用 */
    private hookBeforeDestroy = () => {
        // console.log('主动销毁了');
        this.close();
    }

    /* 向服务器发送消息 */
    sendMessage(data: any) {
        if (this.ws && this.ws?.readyState === WebSocket.OPEN) {
            const dataS = JSON.stringify(data);
            console.log('发送ws数据', dataS);
            this.ws.send(dataS);
        } else {
            // todo
        }
    }

    /* 订阅一组合约消息 */
    sendContractTickMessage(contractCode: string) {
        this.keepCodes = contractCode;
        this.sendMessage({
            id: this.getUniqueId(),
            topic: 'sub_tick',
            data: {
                code: contractCode
            }
        });
        return this;
    }

    /* 取消订阅合约消息 */
    sendCancelContractTickMessage(contractCode: string) {
        this.keepCodes = '';
        this.sendMessage({
            id: this.getUniqueId(),
            topic: 'unsub_tick',
            data: {
                code: contractCode
            }
        });
        return this;
    }

    /* 订阅合约组的消息 */
    sendContractTickGroupMessage(contractCodes: string[]) {
        this.keepCodes = contractCodes;
        this.sendMessage({
            id: this.getUniqueId(),
            topic: 'sub_group_tick',
            data: {
                codes: Array.from(new Set(contractCodes))
            }
        });
        return this;
    }

    /* 取消订阅合约组消息 */
    sendCancelContractTickGroupMessage(contractCodes: string[]) {
        this.keepCodes = '';
        this.sendMessage({
            id: this.getUniqueId(),
            topic: 'unsub_group_tick',
            data: {
                codes: Array.from(new Set(contractCodes))
            }
        });
        return this;
    }

    /* 添加回调函数 */
    addListener(fn: TypeContractDataSocketListener) {
        if (typeof fn !== 'function') {
            return;
        }
        this.messageListeners.push(fn);
        return this;
    }

    /* 移除回调函数 */
    removeListener(fn: Function) {
        if (typeof fn !== 'function') {
            return;
        }
        const findIndex = this.messageListeners.findIndex((item: any) => {
            return item === fn;
        });
        if (findIndex >= 0) {
            this.messageListeners.splice(findIndex, 1);
        }
        return this;
    }

    /* 关闭数据通道，但不关闭socket */
    close() {
        if (this.idle) {
            return;
        }
        if (this.ws) {
            // 关闭之前已经有的
            if (Array.isArray(this.keepCodes)) {
                this.sendCancelContractTickGroupMessage(this.keepCodes); // 自动取消以及订阅的组数据
            } else if (this.keepCodes) {
                this.sendCancelContractTickMessage(this.keepCodes); // 自动取消以及订阅的数据
            }
        }
        // console.log('关闭了连接');
        this.idle = true; // 标记为闲置， 可以被复用
        // this.messageListeners.length = 0; // 清空他的监听数组
        if (this.context) {
            // 在离开页面时候进行销毁，而不需要主动去调用销毁
            this.context.$off && this.context.$off('hook:beforeDestroy', this.hookBeforeDestroy);
        }
        // 如果之前
        return this;
    }

    /* 销毁实例以及数组 */
    destroy() {
        if (this.ws) {
            // this.ws.send('close');
            this.close();
            /* 下一帧去做关闭 */
            window.setTimeout(() => {
                this.ws && this.ws.close(); // 关闭socket
                this.ws = null;
            }, 0);
            // 将自己从socket pool里面移除
            ContractDataSocket.Pool.delete(this.uid);
        }
    }
}
