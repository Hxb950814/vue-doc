import {EnumContractDataKey, TypeContractData} from '@common/src/future';

export function getSituationDataObject() {
    return {
        askPrice: '', // 卖价 最低卖价
        askVolume: '', // 卖量 累计卖量
        bidPrice: '', // 买价
        bidVolume: '', // 买量
        price: '', // 最新价
        changeValue: '', // 涨跌
        changeRate: '', // 涨跌幅度
        open: '', // 开盘
        totalVolume: '', // 成交量
        low: '', // 最低价
        high: '', // 最高价
        position: '', // 持仓
        positionDelta: '', // 增仓
        positionDeltaRate: '', // 增仓比例
        average: '', // 均价
        settle: '', // 结算
        preSettle: '', // 昨结
        preClose: '', // 昨收
        close: '', // 收盘价
        lowLimited: '', // 跌停价
        highLimited: '' // 涨停价
    };
}

export function setSituationData(data: any, dataSource: TypeContractData) {
    // console.log('dataSource:', dataSource);
    if (!data) {
        return;
    }
    if (!dataSource) {
        return;
    }
    console.log(data)
    data.price = dataSource[EnumContractDataKey.price] ?? ''; // 最新价

    data.askPrice = dataSource[EnumContractDataKey.askPrices]?.[0] ?? ''; // 卖价 最低卖价
    data.askVolume = (dataSource[EnumContractDataKey.askVolumes] || []).reduce((prev: number, curr: number) => {
        return prev + curr;
    }, 0); // 卖量 累计卖量
    data.bidPrice = (dataSource[EnumContractDataKey.bidPrices])?.[0] ?? ''; // 买价

    data.bidVolume = (dataSource[EnumContractDataKey.bidVolumes] || []).reduce((prev: number, curr: number) => {
        return prev + curr;
    }, 0);
    data.position = dataSource[EnumContractDataKey.position] ?? ''; // 持仓

    data.bidVolume = dataSource[EnumContractDataKey.bidVolumes]?.[0] ?? ''; // 买量
    data.changeValue = dataSource[EnumContractDataKey.changeValue] ?? ''; // 涨跌
    if (data.changeValue) {
        data.changeValue = data.changeValue >= 0 ? '+' + data.changeValue : data.changeValue;
    }
    data.changeRate = dataSource[EnumContractDataKey.changeRate] ?? ''; // 涨跌
    if (data.changeRate) {
        data.changeRate = data.changeRate >= 0 ? '+' + data.changeRate : data.changeRate;
    }
    data.open = dataSource[EnumContractDataKey.open] ?? ''; // 开盘
    data.totalVolume = dataSource[EnumContractDataKey.totalVolume] ?? ''; // 成交量
    data.low = dataSource[EnumContractDataKey.low] ?? ''; // 最低价
    data.high = dataSource[EnumContractDataKey.high] ?? ''; // 最高价
    data.position = dataSource[EnumContractDataKey.position] ?? ''; // 持仓
    data.positionDelta = dataSource[EnumContractDataKey.positionDelta] ?? ''; // 增仓
    data.positionDeltaRate = dataSource[EnumContractDataKey.positionDelta] / dataSource[EnumContractDataKey.position] * 100; // 增仓
    if (isNaN(data.positionDeltaRate)) {
        data.positionDeltaRate = 0;
    } else {
        data.positionDeltaRate = data.positionDeltaRate.toFixed(2);
    }
    data.average = dataSource[EnumContractDataKey.average] ?? ''; // 均价
    data.settle = dataSource[EnumContractDataKey.settle] ?? ''; // 收盘
    data.preSettle = dataSource[EnumContractDataKey.preSettle] ?? ''; // 昨收
    data.preClose = dataSource[EnumContractDataKey.preClose] ?? ''; // 昨结
    data.close = dataSource[EnumContractDataKey.close] ?? ''; // 结算
    data.lowLimited = dataSource[EnumContractDataKey.lowLimited] ?? ''; // 跌停价
    data.highLimited = dataSource[EnumContractDataKey.highLimited] ?? ''; // 涨停价
    data.close = dataSource[EnumContractDataKey.close] ?? ''; // 收盘价
}

export function resetSituationData(data: any) {
    if (!data) {
        return;
    }
    for (const i in data) {
        if (!data.hasOwnProperty(i)) {
            continue;
        }
        if (typeof data[i] === 'number') {
            data[i] = 0;
        } else if (typeof data[i] === 'string') {
            data[i] = '';
        } else if (Array.isArray(data[i])) {
            data[i] = [];
        }
    }
}
