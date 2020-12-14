import echarts from 'echarts';
import {formatTime} from '@common/src/utils/format';
import {getTodayTimeStamp} from '@/utils/time';

let markValue = 0; // 标记线的值

// let flagInvoke = false;
// let flagInvoke2 = false;

interface TypeChartContractTickData {
    name: string; //
    time: number;
    preSettle: number; // 昨日结算价
    amount: number;
    volume: number;
    price: number;
    high: number;
    low: number;
}

export function showChartTime(chart: echarts.ECharts, dataIn: TypeChartContractTickData[] = [], extraData?: any) {
    if (!chart) {
        console.error('showChartTime 参数chart不能为空');
        return;
    }
    if (!dataIn) {
        dataIn = [];
    }
    const contractSize = extraData?.contractSize || 1;
    // 处理数据
    const data: any[] = [];
    const data2: any[] = [];
    let intervalVal = 0;
    let maxVal = -1; // 刻度最大值
    let minVal = 1e8; // 只是取一个比较大的值

    const preSettle = dataIn[dataIn.length - 1].preSettle; // 昨日结算算价格
    markValue = preSettle; // 参考线
    let totalVolume = 0;
    let totalAmount = 0;
    for (const obj of dataIn) {
        totalAmount += obj.amount;
        totalVolume += obj.volume;
    }
    // 分时图均线计算：当日累计交易额/当日累计交易量/合约乘数
    for (const obj of dataIn) {
        totalAmount += obj.amount;
        totalVolume += obj.volume;
        data.push({
            name: obj.name,
            value: [
                obj.name,
                obj.price,
                markValue
            ]
        });
        totalAmount += obj.amount;
        totalVolume += obj.volume;
        data2.push({
            name: obj.name,
            value: [
                obj.name,
                totalAmount / totalVolume / contractSize /* 平均线 */
            ]
        });
        if (obj.high !== undefined && obj.high > maxVal) {
            maxVal = obj.high;
        }
        if (obj.low !== undefined && obj.low < minVal) {
            minVal = obj.low;
        }
    }

    // 参考线 = 昨日结算价
    // 图表上下范围：
    // 差值 = （昨日结算价-最高价） 和 （昨日结算价-最低价）中绝对值最大的
    // 上范围 = 昨日结算价+差值
    // 下范围 = 昨日结算价+差值
    const range = Math.max(Math.abs(preSettle - maxVal), Math.abs(preSettle - minVal));
    maxVal = preSettle + range;
    minVal = preSettle - range;
    intervalVal = (maxVal - minVal) / 5; // 间隔

    const option = {
        grid: {
            left: 0,
            right: 0,
            top: 20,
            bottom: 2,
            padding: 5,
            trigger: 'axis',
            tooltip: {
                axisPointer: {
                    snap: 'true',
                    label: {
                        formatter(params: any) {
                            // console.log(params);
                            if (params.axisDimension === 'x') {
                                return formatTime(params.value, 'hh:mm:ss');
                            } else if (params.axisDimension === 'y') {
                                if (params.axisIndex === 0) {
                                    return params.value.toFixed(2);
                                } else if (params.axisIndex === 1) {
                                    return ((params.value - markValue) / markValue * 100).toFixed(2) + '%';
                                }
                            }
                            return '';
                        }
                    }
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            formatter(prams1: any, prams2: any) {
                const value1 = prams1[0].data.value[1]; // 当前值
                const value2 = prams1[0].data.value[2]; // 当前值
                // console.log(value1);
                return formatTime(prams1[0].name, 'hh:mm:ss') + ' <br> ' + value1 +
                    '(' + ((value1 - value2) / value2 * 100).toFixed(2) + '%)';
            },
            axisPointer: {
                type: 'cross',
                animation: false
            }
        },
        xAxis: {
            boundaryGap: false,
            type: 'time',
            splitLine: {
                show: false,
                lineStyle: {
                    color: '#FF1A02',
                    type: 'dashed'
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#FF1A02'
                }
            },
            min: getTodayTimeStamp(9, 0, 0),
            max: getTodayTimeStamp(15, 0, 0)
        },
        yAxis: [
            {
                type: 'value',
                boundaryGap: false,
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#FF1A02',
                        type: 'dashed'
                    }
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    inside: true,
                    margin: 2,
                    align: 'left',
                    verticalAlign: 'bottom',
                    lineHeight: 15,
                    color(value: any) {
                        // console.log('000', value, index, a);
                        return value > preSettle ? '#ff4338' : '#03b602';
                    }
                },
                axisTick: {
                    show: false
                },
                interval: intervalVal,
                min: minVal, // 刻度最小值
                max: maxVal // 刻度最大值
            }, {
                name: '1',
                show: true,
                minorSplitLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                minorTick: {
                    show: false
                },
                axisLabel: {
                    inside: true,
                    margin: 5,
                    align: 'right',
                    verticalAlign: 'bottom',
                    lineHeight: 15,
                    formatter(value: string, index: number) {
                        // console.log('valuesss', value);
                        return ((parseFloat(value) - markValue) / markValue * 100).toFixed(2) + '%';
                    },
                    color(value: any) {
                        return value > markValue ? '#ff4338' : value === markValue ? '#333' : '#03b602';
                    }
                },
                interval: intervalVal,
                min: minVal, // 刻度最小值
                max: maxVal // 刻度最大值
            }],
        series: [
            {
                name: '走势线',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                lineStyle: {
                    color: '#0086FF',
                    width: 1
                },
                markLine: {
                    symbolSize: [0, 0],
                    data: [{
                        yAxis: markValue
                    }],
                    lineStyle: {
                        color: '#999',
                        type: 'dashed'
                    },
                    animation: false
                },
                data
            },
            {
                name: '参考线',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                lineStyle: {
                    color: '#E4AB40',
                    width: 1
                },
                data: data2
            }]
    };
    // if (!flagInvoke) {
        chart && chart.setOption(option as any); // 绘制
    //     flagInvoke = true;
    // } else {
    //     /* 只设置data */
    //     chart && chart.setOption({
    //         yAxis: [{
    //             interval: intervalVal,
    //             min: minVal, // 刻度最小值
    //             max: maxVal // 刻度最大值
    //         }],
    //         series: [
    //             {data},
    //             {data: data2}
    //         ]
    //     }); // 绘制
    // }
}

/* 显示指数 */
export function showChartKindIndex(chart: echarts.ECharts, dataIn: any[] = [], extraData?: any) {
    if (!chart) {
        console.error('showChartKindIndex 参数chart不能为空');
        return;
    }
    if (!dataIn) {
        dataIn = [];
    }
    const data: any[] = [];
    const data2: any[] = [];
    const data3: any[] = [];
    for (const obj of dataIn) {
        data.push({
            name: obj.name,
            value: [
                obj.name,
                obj.value1
            ]
        });
        data2.push({
            name: obj.name,
            value: [
                obj.name,
                obj.value2
            ]
        });
        data3.push({
            name: obj.name,
            value: [
                obj.name,
                obj.value3
            ]
        });
    }

    const option = {
        grid: {
            left: 0,
            right: 0,
            top: 20,
            bottom: 2,
            padding: 5
        },
        xAxis: {
            type: 'time',
            boundaryGap: false,
            axisTick: {
                show: false
            },
            markLine: {
                symbolSize: 0,
                data: [{
                    yAxis: getTodayTimeStamp(11, 0, 0)
                }],
                lineStyle: {
                    color: '#000',
                    type: 'dashed'
                },
                animation: false
            },
            min: getTodayTimeStamp(9, 0, 0),
            max: getTodayTimeStamp(15, 0, 0)
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            }
        },
        series: [
            {
                name: '1',
                type: 'line',
                lineStyle: {
                    color: '#bbb',
                    width: 1
                },
                showSymbol: false,
                hoverAnimation: false,
                data
            },
            {
                name: '2',
                type: 'line',
                lineStyle: {
                    color: '#E4AB40',
                    width: 1
                },
                showSymbol: false,
                hoverAnimation: false,
                data: data2
            },
            {
                name: '3',
                type: 'bar',
                showSymbol: false,
                hoverAnimation: false,
                itemStyle: {
                    color(param: any) {
                        return param.value[1] >= 0 ? '#ff4338' : '#03B602';
                    },
                    width: 1
                },
                data: data3
            }
        ]
    };
    if (!chart) {
        return;
    }
    // if (!flagInvoke2) {
        chart && chart.setOption(option as any); // 绘制
        // flagInvoke2 = true;
    // } else {
        /* 只设置data */
    //     chart && chart.setOption({
    //         series: [
    //             {data},
    //             {data: data2},
    //             {data: data3}
    //         ]
    //     }); // 绘制
    // }
}
