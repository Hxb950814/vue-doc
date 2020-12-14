/* 数据结构体 */

/* eslint-disable */
export enum EnumContractDataKey {
    // eslint-disable-next-line no-unused-vars
    code = 'code', // 'string - 合约代码'
    date = 'date', // 'string - YYYYmmdd HH,//MM,//SS',
    position = 'position', // 'float - 持仓',
    totalVolume = 'totalVolume', // 'float - 总成交量',
    low = 'low', // 'float - 最低价',
    preSettle = 'preSettle', // 'float - 昨结算价',
    prePosition = 'prePosition', // 'float - 昨持仓',
    high = 'high', // 'float - 最⾼价',
    insideVolume = 'insideVolume', // 'float - 内盘量',
    price = 'price', // 'float - 即时价格',
    bidVolumes = 'bidVolumes', // '[float] - 10 档买量',
    open = 'open', // 'float - 开盘价',
    settle = 'settle', // 'float - 结算价',
    amount = 'amount', // 'float - 成交额',
    bidPrices = 'bidPrices', // '[float] - 10 档买价',
    totalAmount = 'totalAmount', // 'float - 总成交额',
    volume = 'volume', // 'float - 成交量',
    lowLimited = 'lowLimited', // 'float - 跌停价',
    preClose = 'preClose', // 'float - 昨收盘价',
    close = 'close', // 'float - 收盘价',
    average = 'average', // 'float - 均价',
    outsideVolume = 'outsideVolume', // 'float - 外盘量',
    askVolumes = 'askVolumes', // '[float] - 10 档卖量',
    changeSpeed = 'changeSpeed', // 'float - 涨速',
    changeValue = 'changeValue', // 'float - 涨跌值',
    highLimited = 'highLimited', // 'float - 涨停价',
    timestamp = 'timestamp', // 'int64 - 毫秒时间戳',
    positionDelta = 'positionDelta', // 'float - 增仓',
    turnoverRate = 'turnoverRate', // 'float - 换⼿率',
    askPrices = 'askPrices', // '[float] - 10 档卖价',
    /* 自定义的 */
    changeRate = 'changeRate' // 'float - 涨跌幅度', 服务器不返回这个值
}

/* 合约数据类型  export declare interface */
export declare interface TypeContractData {
    code: string; // 'string - 合约代码'
    date: number; // 'number - YYYYmmdd HH,//MM,//SS',
    position: number; // 'float - 持仓',
    totalVolume: number; // 'float - 总成交量',
    low: number; // 'float - 最低价',
    preSettle: number; // 'float - 昨结算价',
    prePosition: number; // 'float - 昨持仓',
    high: number; // 'float - 最⾼价',
    insideVolume: number; // 'float - 内盘量',
    price: number; // 'float - 即时价格',
    bidVolumes: number[]; // '[float] - 10 档买量',
    open: number; // 'float - 开盘价',
    settle: number; // 'float - 结算价',
    amount: number; // 'float - 成交额',
    bidPrices: Array<number>; // '[float] - 10 档买价',
    totalAmount: number; // 'float - 总成交额',
    volume: number; // 'float - 成交量',
    lowLimited: number; // 'float - 跌停价',
    preClose: number; // 'float - 昨收盘价',
    close: number; // 'float - 收盘价',
    average: number; // 'float - 均价',
    outsideVolume: number; // 'float - 外盘量',
    askVolumes: number[]; // '[float] - 10 档卖量',
    changeSpeed: number; // 'float - 涨速',
    changeValue: number; // 'float - 涨跌值',
    highLimited: number; // 'float - 涨停价',
    timestamp: number; // 'int64 - 毫秒时间戳',
    positionDelta: number; // 'float - 增仓',
    turnoverRate: number; // 'float - 换⼿率',
    askPrices: number[]; // '[float] - 10 档卖价',
    /* 自定义的 */
    changeRate: number; // 'float - 涨跌幅度', 服务器不返回这个值
}

/* 合约历史数据类型 */
/* eslint-disable */
export declare interface TypeContractHistoryData {
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

