declare type TypeContractDataSocketListener = (errCode: number, data: any) => void;
export default class ContractDataSocket {
    static COUNT: number;
    private uid;
    private ws;
    private messageListeners;
    constructor(listener?: TypeContractDataSocketListener);
    connect(): Promise<[Error | null, string | undefined]>;
    getUniqueId(): number;
    sendMessage(data: any): void;
    sendContractTickMessage(code: string): void;
    sendCancelContractTickMessage(code: string): void;
    sendContractTickGroupMessage(codes: string[]): void;
    sendCancelContractTickGroupMessage(codes: string[]): void;
    addListener(fn: TypeContractDataSocketListener): void;
    removeListener(fn: Function): void;
    close(): void;
    destroy(): void;
}
export {};
