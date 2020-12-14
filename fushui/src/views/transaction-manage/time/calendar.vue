<!-- 行情种类 -->
<template>
    <div>
        <div class="page-cap-title">
            交易日历
        </div>
        <div class="page-cap-content">
            <div class="h-left">
                <el-calendar v-model="defaultTime" :first-day-of-week="7" class="el-calendar-table-hbb">
                    <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
                    <template
                        slot="dateCell"
                        slot-scope="{date, data}"
                    >
                        <div
                            class="hbb-calendar-div"
                            :class="`status_${dataS[data.day] && dataS[data.day].status}`"
                            @click.stop="clickDate(data.day)"
                        >
                            <p
                                class="hbb-t-calendar"
                                :class="dataS[data.day] && dataS[data.day].isSelected ? 'selected' : dataS[data.day] && dataS[data.day].isClickSelected ? 'clickSelect': ''"
                            >
                                {{ data.day.split('-').slice(1).join('-').slice(3) }}
                                <span
                                    v-if="dataS[data.day] && (dataS[data.day].type === '0' || dataS[data.day].type === '2')"
                                    class="hbb-t-title"
                                >交</span>
                                <span
                                    v-if="dataS[data.day] && dataS[data.day].type === '1'"
                                    class="hbb-t-title"
                                >节</span>
                            </p>
                        </div>
                    </template>
                </el-calendar>
            </div>
            <div class="h-right">
                <div class="hbb-arrangement">
                    <div class="title">
                        时间安排
                    </div>
                    <div class="con">
                        <el-tabs v-model="currentTabView" @tab-click="clickTab">
                            <el-tab-pane
                                v-for="(item, index) in quotationSource"
                                :key="index"
                                :label="item.name"
                                :name="item.name"
                            >
                                <LoginView
                                    v-if="componentView === 1"
                                    ref="LoginView"
                                    :notice="loginNotice"
                                    :data-day-list="quotationSourceDayInfo"
                                />
                                <BusinessView
                                    v-else
                                    :key="item.id"
                                    :data-source-list="quotationSourceTimeInfo"
                                    :notice="sourceNotice"
                                />
                            </el-tab-pane>
                        </el-tabs>
                        <div v-show="componentView === 1 && isShowLoginBtn" class="hbb-time-button">
                            <el-button v-permission="'07010101'" type="primary" @click="clickTimePop">
                                时间调整
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>

            <!--时间调整弹层-->
            <el-dialog
                v-if="timeVisible"
                title="登录时间调整"
                :center="true"
                :visible.sync="timeVisible"
                :before-close="handleClose"
                width="600px"
            >
                <div class="hbb-time-checkBox">
                    <div class="grounp">
                        <span class="small-grounp">
                            <span>
                                凌晨
                            </span>
                            <el-time-picker
                                v-model="timeCheck.nightAmStart"
                                placeholder="开始时间"
                            />

                            <span class="xian">
                                -
                            </span>
                            <el-time-picker
                                v-model="timeCheck.nightAmEnd"
                                placeholder="结束时间"
                            />
                        </span>
                        <span class="small-grounp">
                            <span>
                                上午
                            </span>
                            <el-time-picker
                                v-model="timeCheck.dayAmStart"
                                placeholder="开始时间"
                            />
                            <span class="xian">
                                -
                            </span>
                            <el-time-picker
                                v-model="timeCheck.dayAmEnd"
                                placeholder="结束时间"
                            />
                        </span>
                        <span class="small-grounp">
                            <span>
                                下午
                            </span>
                            <el-time-picker
                                v-model="timeCheck.dayPmStart"
                                placeholder="开始时间"
                            />
                            <span class="xian">
                                -
                            </span>
                            <el-time-picker
                                v-model="timeCheck.dayPmEnd"
                                placeholder="结束时间"
                            />
                        </span>
                        <span class="small-grounp">
                            <span>
                                晚上
                            </span>
                            <el-time-picker
                                v-model="timeCheck.nightPmStart"
                                placeholder="开始时间"
                            />
                            <span class="xian">
                                -
                            </span>
                            <el-time-picker
                                v-model="timeCheck.nightPmEnd"
                                placeholder="结束时间"
                            />
                        </span>
                        <span class="small-grounp">
                            <span>适用</span>
                            <el-radio v-model="beApplicable" label="0">仅限当天交易</el-radio>
                            <el-radio v-model="beApplicable" label="1">后续未到交易日(包括当天)</el-radio>
                        </span>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="timeVisible = false">取 消</el-button>
                    <el-button type="primary" @click="checkTime">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';

    import dayjs from 'dayjs';
    import {number} from '@common/lib'; // 商所类型模板
    import {log} from 'lodash-decorators/utils';
    import LoginView from './tabview/login.vue'; // 交易登录
    import BusinessView from './tabview/business.vue';

    @Component({
        components: {LoginView, BusinessView}
    })
    export default class extends Vue {
        quotationSource: any[] = []; // 取得所有商所的列表

        originalData: any[] = []; // 所有日期的原始数据 便于实现指定的业务效果展示

        dataS: any = {}; // 用于映射日期的数据

        currentTabView: string = ''; // 当前tab的视图 1:交易登录模板 2:商所模板
        defaultTime = new Date(); // 默认展示的时间

        todayTime = dayjs(new Date()).format('YYYY-MM-DD'); // 当天时间 用于做判断比较
        currentTime = ''; // 自定义时间 【用户自己选择的时间】

        componentView: number = 1; // 模板视图 1：交易登录 2：商所的模板
        quotationSourceTimeInfo = []; // 交易所交易数据源
        sourceNotice = ''; // 交易所交易数据源 描述
        quotationSourceDayInfo = []; // 登录时间信息
        loginNotice = ''; // 交易登录数据源 描述

        timeVisible: boolean = false; // 时间调整弹层

        timeCheck: any = {
            dayAmStart: '', // 凌晨时间 => 开始
            dayAmEnd: '', // 凌晨时间 => 结束
            dayPmStart: '', // 上午时间 => 开始
            dayPmEnd: '', // 上午时间 => 结束
            nightAmStart: '', // 下午时间 => 开始
            nightAmEnd: '', // 下午时间 => 结束
            nightPmStart: '', // 晚上时间 => 开始
            nightPmEnd: '' // 晚上时间 => 结束
        }; // 调整时间参数

        isShowLoginBtn: boolean = true; // 调整登陆时间按钮的控制

        beApplicable: string = '0'; // 调整时间弹层 适用的方式

        @Watch('defaultTime')
        onDefaultTimeChange(val: Date, oldVal: Date) {
            // 日历根据val改变去请求最近3个月的数据
            const _this = this;
            if (dayjs(val).format('YYYY-MM') === dayjs(oldVal).format('YYYY-MM')) {
                return;
            }
            const day = dayjs(val).format('YYYY-MM-DD');
            // 判断如果周六就往后推2天 周日就往后推1天
            if (_this.getWeek(day) === '周六') {
                val.setDate(val.getDate() + 2);
            }
            if (_this.getWeek(day) === '周日') {
                val.setDate(val.getDate() + 1);
            }
            this.currentTime = day;
        }

        async mounted() {
            this.currentTime = this.todayTime;
            await Promise.all([
                // 获取交易日和节假日
                this.queryTransactionDayAndHoliday(),
                // // 获取所有的交易所
                this.queryAllQuotationSource(),
                // // 获取登录时间的详情
                this.queryLoginTimeInfoByDate(this.todayTime)
            ]);
        }

        async queryTransactionDayAndHoliday() {
            // 获取交易日和节假日
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/transaction/queryTransactionDayAndHoliday');
            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = {};
                // 拷贝一份原始数据 用于效果的展示
                this.originalData = JSON.parse(JSON.stringify(resp?.data || []));
                (resp?.data || []).map((item: any, idx: number) => {
                    const day = item?.date?.split(' ')?.[0] || '';
                    list[day] = {
                        type: String(item.type),
                        date: String(item.date),
                        status: String(item.type) === '0' ? 0 : String(item.type) === '1' ? 1 : 2,
                        isTodaySelected: String(item.type) === '2',
                        isClickSelected: false
                    };
                });
                Object.keys(list).forEach((key: string) => {
                    if (dayjs(key).valueOf() >= dayjs(this.todayTime).valueOf()) {
                        if (list[key].type === '1') {
                            list[key].status = 2;
                        } else {
                            list[key].status = 0;
                        }
                    } else {
                        list[key].status = 1;
                    }
                });
                this.dataS = list;
                // 判断在数据中是否有当天日期 进行过滤 并且进行判定 type :2 代表当天日期
                const arr = this.originalData.filter((x:any) => x.type === 2);
                this.dataS[arr[0]?.date].isSelected = true;
            }
        }

        async queryAllQuotationSource() {
            // 获取所有的交易所
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/transaction/queryAllQuotationSource', {});
            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any[] = [];
                (resp?.data || []).forEach((item: any, idx: number) => {
                    list.push({
                        id: String(item.quotationSourceId),
                        name: String(item.sourceName),
                        mode: 2
                    });
                });
                list.unshift({
                    name: '交易登录',
                    mode: 1
                });
                this.currentTabView = list[0].name;
                this.quotationSource = list;
            }
        }

        clickDate(day: string) {
            // 如果是周六 周日 或者是今天之前的日期  点击都不会去发送请求
            const dayType = this.getWeek(day);
            if (dayType === '周六' || dayType === '周日') {
                return false;
            }
            if (dayjs(day).valueOf() < dayjs(this.todayTime).valueOf()) {
                // 选择的时间小于当天的时间不展示登陆时间调整
                this.isShowLoginBtn = false;
            } else {
                this.isShowLoginBtn = true;
            }
            // 判断在数据中是否有当天日期 进行过滤 并且进行判定 type :2 代表当天日期
            const arr = this.originalData.filter((x:any) => x.type === 2);
            this.dataS[arr[0]?.date].isSelected = true;

            Object.keys(this.dataS).forEach((key: string) => {
                this.dataS[key].isClickSelected = day === key;
            });
            // 选择的当前时间
            this.currentTime = day;
            // 取得时间安排的数据
            this.componentView = 1;
            // 获取所有的交易所
            this.queryAllQuotationSource();
            // 获取登录时间的详情
            this.queryLoginTimeInfoByDate(day);
        }

        getWeek(d: string) {
            // 标准时间 Wed Jul 31 2019 00:00:00 GMT+0800 (中国标准时间)
            const num = dayjs(d).day();
            let week;
            switch (num) {
                case 0:
                    week = '周日';
                    break;
                case 1:
                    week = '周一';
                    break;
                case 2:
                    week = '周二';
                    break;
                case 3:
                    week = '周三';
                    break;
                case 4:
                    week = '周四';
                    break;
                case 5:
                    week = '周五';
                    break;
                case 6:
                    week = '周六';
                    break;
                default:
                    break;
            }
            return week;
        }

        clickTab(tab: any, event: any) {
            // 点击tab
            // index : 0 交易登录 则：商所模板
            const modeArr = this.quotationSource.filter((x: any) => x.name === tab.name);
            const mode = modeArr[0].mode;
            const quotationSourceId = modeArr[0].id;

            if (mode === 1) {
                // 去拿登录模板的数据
                this.componentView = 1;
            } else {
                // 通过交易所id去拿指定商所模板的数据
                this.componentView = 2;
                this.queryQuotationSourceTimeInfo(quotationSourceId);
            }
        }

        async queryLoginTimeInfoByDate(day: string) {
            // 拿交易登录的时间段数据
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/transaction/queryLoginTimeInfoByDate', {date: day});
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.quotationSourceDayInfo = resp?.data;
                this.loginNotice = resp?.message || '';
            }
        }

        async queryQuotationSourceTimeInfo(id: string) {
            // 交易所交易时间说明
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/transaction/queryQuotationSourceTimeInfo', {quotationSourceId: id});
            this.$closeLoading();
            if (resp?.code === '000000') {
                const list: any = [];
                this.sourceNotice = resp?.data?.notice;
                Object.keys(resp?.data?.data || {}).forEach((item: any, idx: number) => {
                    list.push({
                        time: item,
                        content: resp?.data?.data[item]
                    });
                });
                this.quotationSourceTimeInfo = list;
            }
        }

        clickTimePop() {
            // 启动调整时间的弹层
            this.timeVisible = true;
            const middleObj = JSON.parse(JSON.stringify(this.quotationSourceDayInfo[0]));
            this.timeCheck.loginTimeId = middleObj.loginTimeId;
            this.timeCheck.nightAmStart = this.formatTimeFn(middleObj.nightAmStart, 1);
            this.timeCheck.nightAmEnd = this.formatTimeFn(middleObj.nightAmEnd, 1);
            this.timeCheck.dayAmStart = this.formatTimeFn(middleObj.dayAmStart, 1);
            this.timeCheck.dayAmEnd = this.formatTimeFn(middleObj.dayAmEnd, 1);
            this.timeCheck.dayPmStart = this.formatTimeFn(middleObj.dayPmStart, 1);
            this.timeCheck.dayPmEnd = this.formatTimeFn(middleObj.dayPmEnd, 1);
            this.timeCheck.nightPmStart = this.formatTimeFn(middleObj.nightPmStart, 1);
            this.timeCheck.nightPmEnd = this.formatTimeFn(middleObj.nightPmEnd, 1);
        }

        formatTimeFn(t: string, type:number) {
            // 格式化时间 便于联动弹层与页面的数据 type:1: 启动模式 2：确认调整模式
            if (type === 1) {
                if (t) {
                    const dayObj = dayjs(this.currentTime + t).format('YYYY,MM,DD,HH,mm,ss').split(',');
                    return new Date(Number(dayObj[0]), Number(dayObj[1]), Number(dayObj[2]), Number(dayObj[3]), Number(dayObj[4]), Number(dayObj[5]));
                } else {
                    return '';
                }
            } else if (t) {
                    return dayjs(t).format('HH:mm:ss');
                } else {
                    return '';
                }
        }

        checkTime() {
            // 确认调整时间 操作动作
            this.updateTransactionDayAndHoliday();
        }

        async updateTransactionDayAndHoliday() {
            // 确认调整时间

            // 处理数据方便去请求
            const timeCheck_request = {
                dayAmStart: this.formatTimeFn(this.timeCheck.dayAmStart, 2), // 凌晨时间 => 开始
                dayAmEnd: this.formatTimeFn(this.timeCheck.dayAmEnd, 2), // 凌晨时间 => 结束
                dayPmStart: this.formatTimeFn(this.timeCheck.dayPmStart, 2), // 上午时间 => 开始
                dayPmEnd: this.formatTimeFn(this.timeCheck.dayPmEnd, 2), // 上午时间 => 结束
                nightAmStart: this.formatTimeFn(this.timeCheck.nightAmStart, 2), // 下午时间 => 开始
                nightAmEnd: this.formatTimeFn(this.timeCheck.nightAmEnd, 2), // 下午时间 => 结束
                nightPmStart: this.formatTimeFn(this.timeCheck.nightPmStart, 2), // 晚上时间 => 开始
                nightPmEnd: this.formatTimeFn(this.timeCheck.nightPmEnd, 2) // 晚上时间 => 结束
            };
            const errorArr:any = [];

            if (!timeCheck_request.dayAmStart) { errorArr.push('上午开始'); }
            if (!timeCheck_request.dayAmEnd) { errorArr.push('上午结束'); }
            if (!timeCheck_request.dayPmStart) { errorArr.push('下午开始'); }
            if (!timeCheck_request.dayPmEnd) { errorArr.push('下午结束'); }
            if (errorArr.length > 0) {
                this.$showToast(errorArr.join(',') + '时间不能为空');
                return;
            }
            const request_data = {
                ...timeCheck_request,
                loginTimeId: this.timeCheck.loginTimeId,
                type: this.beApplicable,
                date: this.currentTime ? this.currentTime : this.todayTime
            };
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/transaction/updateTransactionDayAndHoliday', request_data);
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('调整成功');
                this.timeVisible = false;
                await Promise.all([
                    // 获取所有的交易所
                    this.queryAllQuotationSource(),
                    // 获取登录时间的详情
                    this.queryLoginTimeInfoByDate(this.currentTime)
                ]);
            }
        }

        handleClose() {
            // 关闭弹层的时候的一些操作
            this.timeVisible = false;
        }
    }
</script>

<style lang="scss" scoped>

    .el-calendar-table-hbb .el-calendar-day {
        padding: 0 !important;

    }

    .page-cap-content {

        & > .h-left {
            float: left;
            width: 600px;
        }

        & > .h-right {
            float: right;
            width: calc(100% - 600px);
        }

    }

    .hbb-calendar-div {
        width: 100%;
        height: 100%;

        &.status_0 {
            & > .hbb-t-calendar {
                color: #1a7ef8
            }
        }

        &.status_1, &.status_undefined {
            & > .hbb-t-calendar {
                color: #ccc;

                & > .hbb-t-title {
                    color: #ccc;
                }
            }
        }

        &.status_2 {
            & > .hbb-t-calendar {
                color: #1a7ef8;

                & > .hbb-t-title {
                    color: $btn-danger-color;
                    font-weight: bold;
                }
            }
        }

        & > .selected {
            color: #fff !important;
            background: $btn-danger-color;

            & > span {
                color: #fff !important;
            }
        }
        & > .clickSelect{
            color: #fff !important;
            background: #0ca2ff;
            & > span {
                color: #fff !important;
            }
        }
    }

    .hbb-t-calendar {
        position: relative;
        width: 100%;
        height: 100%;
        background: #efefef;

        & > span {
            position: absolute;
            bottom: 5px;
            right: 5px;
        }
    }

    .hbb-arrangement {
        display: flex;
        width: 100%;
        padding-left: 20px;
        flex-direction: column;

        & > .title {
            display: flex;
            width: 100%;
            height: 40px;
            background: #efefef;
            justify-content: center;
            align-items: center;
            font-size: 14px;
        }
    }

    .hbb-nav {
        display: flex;
        width: 100%;
        margin: 10px 0;
        justify-content: space-between;
        cursor: pointer;

        & > span {
            display: flex;
            width: 100px;
            height: 40px;
            border: 1px solid #ddd;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            background: #cccccc;
            color: #fff;

            &.active {
                background: #1a7ef8;
            }
        }
    }

    .hbb-tip {
        display: flex;
        margin-top: 200px;
        color: #000;
        justify-content: center;
    }

    .hbb-time-button {
        display: flex;
        width: 100px;
        height: 40px;
        font-size: 14px;
        margin: 40px auto;
        color: #fff;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
    }

    /* 调整时间部分*/
    .hbb-time-checkBox {
        display: flex;
        width: 100%;

        & > .grounp {
            display: flex;
            width: 100%;
            flex-direction: column;
            align-items: center;

            & > .small-grounp {
                display: flex;
                width: 100%;
                justify-content: center;
                align-items: center;
                margin-top: 20px;

                & > span:first-child {
                    margin-right: 10px;
                }

                & > span.xian {
                    margin: 0 10px;
                }

                & > .el-input {
                    width: 145px;
                }
            }
        }
    }
</style>
