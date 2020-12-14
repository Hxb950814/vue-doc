import {firstLetterUppercase} from '../utils/string';
import {EnumContractDataKey} from './type';

/* 生成数据结构体 */
export function getSituationData(data: any, keyArr?: string[]) {
    if (!data) {
        return {};
    }
    if (!keyArr) {
        keyArr = Object.keys(EnumContractDataKey);
    }
    const newData: any = {
        [EnumContractDataKey.code]: data.Code
    };

    for (const key of keyArr) {
        let val = data[key] ?? data[firstLetterUppercase(key)];
        switch (key) {
            case EnumContractDataKey.changeRate:
                val = ((data.ChangeValue / data.PreSettle) * 100);
                if (isNaN(val)) {
                    val = '';
                } else {
                    val = parseFloat(val.toFixed(2));
                }
                break;
        }
        newData[key] = val;
    }
    return newData;
}

/* 生成数据结构体，按照顺序 */
export function pickSituationDataByOrder(data: any, keyArr: string[]) {
    if (!data) {
        return {};
    }
    const newData: any = {
        [EnumContractDataKey.code]: data.code
    };
    for (let i = 0; i < keyArr.length; ++i) {
        newData['value' + (i + 1)] = data[keyArr[i]];
    }
    return newData;
}
