export declare enum EnumContractDataKey {
    code = "code",
    date = "date",
    position = "position",
    totalVolume = "totalVolume",
    low = "low",
    preSettle = "preSettle",
    prePosition = "prePosition",
    high = "high",
    insideVolume = "insideVolume",
    price = "price",
    bidVolumes = "bidVolumes",
    open = "open",
    settle = "settle",
    amount = "amount",
    bidPrices = "bidPrices",
    totalAmount = "totalAmount",
    volume = "volume",
    lowLimited = "lowLimited",
    preClose = "preClose",
    close = "close",
    average = "average",
    outsideVolume = "outsideVolume",
    askVolumes = "askVolumes",
    changeSpeed = "changeSpeed",
    changeValue = "changeValue",
    highLimited = "highLimited",
    timestamp = "timestamp",
    positionDelta = "positionDelta",
    turnoverRate = "turnoverRate",
    askPrices = "askPrices",
    changeRate = "changeRate"
}
export interface TypeContractData {
    code: string;
    date: number;
    position: number;
    totalVolume: number;
    low: number;
    preSettle: number;
    prePosition: number;
    high: number;
    insideVolume: number;
    price: number;
    bidVolumes: number[];
    open: number;
    settle: number;
    amount: number;
    bidPrices: Array<number>;
    totalAmount: number;
    volume: number;
    lowLimited: number;
    preClose: number;
    close: number;
    average: number;
    outsideVolume: number;
    askVolumes: number[];
    changeSpeed: number;
    changeValue: number;
    highLimited: number;
    timestamp: number;
    positionDelta: number;
    turnoverRate: number;
    askPrices: number[];
    changeRate: number;
}
export interface TypeContractHistoryData {
    amount: number;
    askPrice: number;
    askVol: number;
    bidPrice: number;
    bidVol: number;
    close: number;
    high: number;
    highLimited: number;
    low: number;
    lowLimited: number;
    open: number;
    position: number;
    settle: number;
    timestamp: number;
    volume: number;
}
