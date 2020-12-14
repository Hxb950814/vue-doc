/* 退出前的检查数据保存情况 */
import {Component, Vue} from 'vue-property-decorator';

interface TypeKind2DataParamsUnit {
    paramName: string;
    paramValue: string;
}

interface TypeKind2DataUnit {
    name: string;
    display: boolean;
    paramsList: TypeKind2DataParamsUnit[];
}

interface TypeKind3DataParamsUnit {
    paramValue: string;
}

interface TypeKind3DataUnit {
    name: string;
    display: boolean;
    paramsList: TypeKind3DataParamsUnit[];
}

@Component({})
export default class extends Vue {
    protected indexData = {
        chartTypeId: '', // 1 ,2 ,3 ,4,6, 7,8
        kindType: '', // 1 ,2 ,3 ,4 // 默认为空

        // 图表类型为【波段】的数据
        kind1Open: true, // 开关 '1'=勾选 '2'=不勾选
        kind1Default: '', // 保存的数据,正整数

        // 图表类型为【主图、量仓、常用】的数据
        kind2Data: [
            {
                name: '', // 指标名称
                display: true, // 是否显示 '1'=显示 '2'=显示
                paramsList: [
                    {
                        paramName: '',
                        paramValue: ''
                    }
                ]
            }
        ] as TypeKind2DataUnit[],

        // 图表类型为【K线】的数据
        kind3Data: [
            {
                name: '分时K线', // 指标名称
                display: true, // 是否显示
                paramsList: [
                    {
                        paramValue: ''
                    }
                ]
            },
            {
                name: '弹性K线', // 指标名称
                display: true, // 是否显示
                paramsList: [
                    {
                        paramValue: ''
                    }
                ]
            }
        ] as TypeKind3DataUnit[],

        // 图表类型为【时间、幅图、坐标】的数据
        kind4Open: false // 开关  true=勾选   false=不勾选
    };

    protected kind2ParamPanelShow = false;
    protected kind2ParamModifyIndex = 0;
    protected kind2ParamModifyData: TypeKind2DataParamsUnit[] = [];

    //
    protected kind3_0ParamPanelShow = false;
    protected kind3_0ParamModifyData: TypeKind3DataParamsUnit[] = [];

    protected kind3_1ParamPanelShow = false;
    protected kind3_1ParamModifyData: TypeKind3DataParamsUnit[] = [];

    mounted() {

    }

    /* 校验数据 */
    validateIndexData(rule: any, value: string, callback: Function) {
        let errText = '';
        const val = this.indexData.kind1Default;
        const valNumber = Number(val);
        switch (this.indexData.kindType) {
            case '1':
                if (val === '') {
                    errText = '请输入默认值';
                }
                if (isNaN(valNumber)) {
                    errText = '请输入正整数';
                }
                if (val.includes('.')) {
                    errText = '请输入正整数';
                }
                if (valNumber > 100 || valNumber < 1) {
                    errText = '数字范围在1-100';
                }
                break;
            case '2':
                for (let i = 0; i < this.indexData.kind2Data.length; ++i) {
                    if (this.indexData.kind2Data[i].name === '') {
                        errText = '请输入指标名称';
                        break;
                    }
                }
                break;
        }
        if (errText) {
            return callback(new Error(errText));
        }
        callback();
    }

    /* 设置初始化数据 */
    setChartIndexData(dataList: any[]) {
        if (!Array.isArray(dataList)) {
            return;
        }
        const list2: TypeKind2DataUnit[] = [];
        const list3: TypeKind3DataUnit[] = [];

        const type = this.getChartKindById(this.indexData.chartTypeId);

        dataList.forEach((item: any, idx: number) => {
            // console.log(111, type);
            if (type === '1') {
                this.indexData.kind1Open = !!item.indicatorsSwitch;
                this.indexData.kind1Default = item.indicatorsValue;
            } else if (type === '2') {
                const parameterList = item.parameterList.map((item2: any) => ({
                    paramName: item2.parameterName,
                    paramValue: item2.parameterValue
                }));
                list2.push({
                    name: item.indicatorsName, // 指标名称
                    display: !!item.status, // 是否显示 '1'=显示 '2'=显示
                    paramsList: parameterList.length > 0 ? parameterList : [{
                        paramName: '',
                        paramValue: ''
                    }]
                });
            } else if (type === '3') {
                const parameterList = item.parameterList.map((item2: any) => ({paramValue: item2.parameterValue}));

                list3.push({
                    name: item.indicatorsName || (idx === 0 ? '分时K线' : '弹性K线'),
                    display: !!item.status, // 是否显示 '1'=显示 '2'=显示
                    paramsList: parameterList.length > 0 ? parameterList : [{
                        paramValue: ''
                    }]
                });
            } else if (type === '4') {
                this.indexData.kind4Open = !!item.indicatorsSwitch; // 开关  true=勾选   false=不勾选
            }
        });
        if (list2.length > 0) {
            this.indexData.kind2Data = list2;
        }
        console.log(list3);
        if (list3.length > 0) {
            this.indexData.kind3Data = list3;
        }
    }

    getChartKindById(id: string) {
        let type = '';
        if (id === '1') { // 波段
            type = '1';
        } else if (id === '2' || id === '3' || id === '4') { // 主图 量仓 常用
            type = '2';
        } else if (id === '5') { // k线
            type = '3';
        } else if (id === '6' || id === '7' || id === '8') { // 时间 坐标 幅图
            type = '4';
        }
        return type;
    }

    setChartKindById(id: string) {
        this.indexData.chartTypeId = id;
        this.indexData.kindType = this.getChartKindById(id);
    }

    /* 获取提交的数据 */
    getChartIndicatorsData() {
        const list: any[] = [];
        const kindId = this.indexData.kindType;
        if (kindId === '1') { // 波段
            list.push({
                indicatorsSwitch: this.indexData.kind1Open ? 1 : 0,
                indicatorsValue: this.indexData.kind1Default // 默认值
            });
        } else if (kindId === '2') { // 主图 量仓 常用
            this.indexData.kind2Data.forEach((item: TypeKind2DataUnit) => {
                list.push({
                    indicatorsName: item.name,
                    status: item.display ? 1 : 0,
                    parameterList: item.paramsList.filter((item: TypeKind2DataParamsUnit) => {
                        return item.paramName && item.paramName; // 过滤掉空数据
                    }).map((item: TypeKind2DataParamsUnit) => {
                        return {
                            parameterName: item.paramName,
                            parameterValue: item.paramValue
                        };
                    })
                });
            });
        } else if (kindId === '3') { // k线
            this.indexData.kind3Data.forEach((item: any) => {
                list.push({
                    indicatorsName: item.name,
                    status: item.display ? 1 : 0,
                    parameterList: item.paramsList.filter((item: TypeKind3DataParamsUnit) => {
                        return item.paramValue; // 过滤掉空数据
                    }).map((item: TypeKind3DataParamsUnit) => {
                        return {
                            parameterValue: item.paramValue
                        };
                    })
                });
            });
        } else if (kindId === '4') { // 时间 坐标
            list.push({
                indicatorsSwitch: this.indexData.kind4Open ? 1 : 0
            });
        }
        return list;
    }

    getChartKind() {
        return this.indexData.kindType;
    }

    clickDeleteKind2Data(idx: number) {
        this.$delete(this.indexData.kind2Data, idx);
    }

    clickAddKind2Data() {
        const length = this.indexData.kind2Data.length;
        const lastOne = this.indexData.kind2Data.length;
        if (length === 0 || this.indexData.kind2Data[length - 1].name !== '') {
            this.indexData.kind2Data.push({
                name: '',
                display: true,
                paramsList: []
            });
        } else {
            this.$showToast('请输入指标名称');
        }
    }

    /* 显示修改子参数的弹层 */
    clickCheckKind2Params(idx: number) {
        this.kind2ParamPanelShow = true;
        this.kind2ParamModifyIndex = idx;
        // 数据分离
        let temp: any = this.indexData.kind2Data[idx].paramsList;
        if (!temp || temp.length === 0) {
            temp = [{
                paramName: '',
                paramValue: ''
            }];
        }
        this.kind2ParamModifyData = JSON.parse(JSON.stringify(temp)) as TypeKind2DataParamsUnit[];
    }

    /* 点击保存修改参数 */
    clickOnSaveKind2Params() {
        const idx = this.kind2ParamModifyIndex;
        const tempList = this.kind2ParamModifyData;

        // 校验数据
        for (let i = 0; i < tempList.length; ++i) {
            const result = this.validateKind2Params(tempList[i]);
            if (result) {
                this.$showToast(result);
                return;
            }
        }

        // 将数据重新赋值到
        this.indexData.kind2Data[idx].paramsList = tempList;
        this.kind2ParamPanelShow = false; // 关闭弹出层
    }

    /* 添加一行参数 */
    clickAddKind2ParamsLine() {
        /* 先检查上一个是否已经按需求输入了 */
        // 校验数据
        const tempList = this.kind2ParamModifyData;

        const result = this.validateKind2Params(tempList[tempList.length - 1]);
        if (result) {
            this.$showToast(result);
            return;
        }

        this.kind2ParamModifyData.push({
            paramValue: '',
            paramName: ''
        });
    }

    /* 删除一行参数 */
    clickDeleteKind2ParamsLine(idx: number) {
        this.$delete(this.kind2ParamModifyData, idx);
    }

    /* 校验参数合法性 */
    validateKind2Params(data: any) {
        const {paramName, paramValue} = data;
        if (paramName === '') {
            return '请输入参数名称';
        }
        if (paramValue === '') {
            return '请输入参数值';
        }
        if (isNaN(Number(paramValue))) {
            return '参数值必须为数字';
        }
        return '';
    }

    validateKind3_0Params(data: any) {
        const {paramValue} = data;
        if (paramValue === '') {
            return '请输入参数值';
        }
        if (isNaN(Number(paramValue))) {
            return '参数值必须为数字';
        }
        if (String(paramValue).includes('.')) {
            return '参数值必须为整数';
        }
        return '';
    }

    clickCheckKind3Params(idx: number) {
        if (idx === 0) {
            this.kind3_0ParamPanelShow = true;
            const temp = this.indexData.kind3Data[0].paramsList;
            this.kind3_0ParamModifyData = JSON.parse(JSON.stringify(temp)) as TypeKind3DataParamsUnit[];
        } else {
            this.kind3_1ParamPanelShow = true;
            const temp = this.indexData.kind3Data[1].paramsList;
            this.kind3_1ParamModifyData = JSON.parse(JSON.stringify(temp)) as TypeKind3DataParamsUnit[];
        }
    }

    /* 3_0 */
    clickAddKind3_0ParamsLine() {
        /* 先检查上一个是否已经按需求输入了 */
        // 校验数据
        const tempList = this.kind3_0ParamModifyData;

        const result = this.validateKind3_0Params(tempList[tempList.length - 1]);
        if (result) {
            this.$showToast(result);
            return;
        }

        this.kind3_0ParamModifyData.push({
            paramValue: ''
        });
    }

    clickDeleteKind3_0ParamsLine(idx: number) {
        this.$delete(this.kind3_0ParamModifyData, idx);
    }

    clickOnSaveKind3_0Params() {
        const tempList = this.kind3_0ParamModifyData;

        // 校验数据
        for (let i = 0; i < tempList.length; ++i) {
            const result = this.validateKind3_0Params(tempList[i]);
            if (result) {
                this.$showToast(result);
                return;
            }
        }

        // 将数据重新赋值到
        this.indexData.kind3Data[0].paramsList = tempList;
        this.kind3_0ParamPanelShow = false; // 关闭弹出层
    }

    /**/
    validateKind3_1Params(data: any) {
        const {paramValue} = data;
        if (paramValue === '') {
            return '请输入参数值';
        }
        if (isNaN(Number(paramValue))) {
            return '参数值必须为数字';
        }
        return '';
    }

    clickAddKind3_1ParamsLine() {
        /* 先检查上一个是否已经按需求输入了 */
        // 校验数据
        const tempList = this.kind3_1ParamModifyData;

        const result = this.validateKind3_1Params(tempList[tempList.length - 1]);
        if (result) {
            this.$showToast(result);
            return;
        }

        this.kind3_1ParamModifyData.push({
            paramValue: ''
        });
    }

    clickDeleteKind3_1ParamsLine(idx: number) {
        this.$delete(this.kind3_1ParamModifyData, idx);
    }

    clickOnSaveKind3_1Params() {
        const tempList = this.kind3_1ParamModifyData;

        // 校验数据
        for (let i = 0; i < tempList.length; ++i) {
            const result = this.validateKind3_1Params(tempList[i]);
            if (result) {
                this.$showToast(result);
                return;
            }
        }

        // 将数据重新赋值到
        this.indexData.kind3Data[1].paramsList = tempList;
        this.kind3_1ParamPanelShow = false; // 关闭弹出层
    }
}
