<!-- 查看行情种类 -->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title page-cap-titleH">
                <span>查看行情种类</span>
                <el-button v-if="!canEditData" type="primary" class="page-table-btn" @click="editClick">
                    编辑
                </el-button>
                <el-button v-else type="primary" class="page-table-btn" @click="clearClick">
                    取消编辑
                </el-button>
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <!-- 品种基本信息 -->
                <template>
                    <div class="hbb-f-title">
                        基本信息
                    </div>
                    <table class="hbb-f-table">
                        <tr>
                            <th><span>*</span>交易品种</th>
                            <td>
                                <template v-if="canEditData">
                                    <el-form-item prop="name" class="hb-mb0">
                                        <el-input
                                            v-model.trim="editData.name"
                                            type="text"
                                            placeholder="请输入行情展示名称"
                                            clearable
                                            maxlength="15"
                                            style="width:300px"
                                        />
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <span>{{ editData.name }}</span>
                                </template>
                            </td>
                            <th>交易代码</th>
                            <td>
                                <template v-if="canEditData">
                                    <el-form-item prop="speciesCode" class="hb-mb0">
                                        <el-input
                                            v-model.trim="editData.speciesCode"
                                            type="text"
                                            placeholder="请输入交易代码"
                                            clearable
                                            style="width:300px"
                                        />
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <span>{{ editData.speciesCode }}</span>
                                </template>
                            </td>
                        </tr>
                        <tr>
                            <th>交易单位</th>
                            <td>
                                <template v-if="canEditData">
                                    <el-form-item prop="speciesUnit" class="hb-mb0">
                                        <el-input
                                            v-model.trim="editData.speciesUnit"
                                            type="text"
                                            placeholder="请输入交易单位"
                                            clearable
                                            style="width:300px"
                                        />
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <span>{{ editData.speciesUnit }}</span>
                                </template>
                            </td>
                            <th>报价单位</th>
                            <td>
                                <template v-if="canEditData">
                                    <el-form-item prop="speciesQuotedUnit" class="hb-mb0">
                                        <el-input
                                            v-model.trim="editData.speciesQuotedUnit"
                                            type="text"
                                            placeholder="请输入报价单位"
                                            clearable
                                            style="width:300px"
                                        />
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <span>{{ editData.speciesQuotedUnit }}</span>
                                </template>
                            </td>
                        </tr>
                        <tr>
                            <th>最小变动单位</th>
                            <td>
                                <template v-if="canEditData">
                                    <el-form-item prop="speciesMinUnit" class="hb-mb0">
                                        <el-input
                                            v-model.trim="editData.speciesMinUnit"
                                            type="text"
                                            placeholder="请输入最小变动单位"
                                            clearable
                                            maxlength="15"
                                            style="width:300px"
                                        />
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <span>{{ editData.speciesMinUnit }}</span>
                                </template>
                            </td>
                            <th>涨跌停板幅度</th>
                            <td>
                                <template v-if="canEditData">
                                    <el-form-item prop="limitRange" class="hb-mb0">
                                        <el-input
                                            v-model.trim="editData.limitRange"
                                            type="text"
                                            placeholder="请输入涨跌停板幅度"
                                            clearable
                                            style="width:300px"
                                        />
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <span>{{ editData.limitRange }}</span>
                                </template>
                            </td>
                        </tr>
                        <tr>
                            <th>合约月份</th>
                            <td>
                                <template v-if="canEditData">
                                    <el-form-item prop="contractMonths" class="hb-mb0">
                                        <el-input
                                            v-model.trim="editData.contractMonths"
                                            type="text"
                                            placeholder="请输入合约月份"
                                            clearable
                                            maxlength="15"
                                            style="width:300px"
                                        />
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <span>{{ editData.contractMonths }}</span>
                                </template>
                            </td>
                            <th>最低交易保证金</th>
                            <td>
                                <template v-if="canEditData">
                                    <el-form-item prop="tradeKickerMin" class="hb-mb0">
                                        <el-input
                                            v-model.trim="editData.tradeKickerMin"
                                            type="text"
                                            placeholder="请输入最低交易保证金"
                                            clearable
                                            maxlength="15"
                                            style="width:300px"
                                        />
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <span>{{ editData.tradeKickerMin }}</span>
                                </template>
                            </td>
                        </tr>
                        <tr>
                            <th><span>*</span>上市交易所</th>
                            <td>
                                <el-form-item prop="exchangeId" class="hb-mb0">
                                    <el-select
                                        v-model.trim="editData.exchangeId"
                                        :disabled="!canEditData"
                                        style="width: 160px"
                                        placeholder="请选择"
                                    >
                                        <el-option value="" label="请选择" />
                                        <el-option
                                            v-for="(item,idx) in sourceList"
                                            :key="idx"
                                            :value="item.id"
                                            :label="item.name"
                                        />
                                    </el-select>
                                </el-form-item>
                            </td>
                            <th>上市日期</th>
                            <td>
                                <template v-if="canEditData">
                                    <el-form-item prop="listingDate" class="hb-mb0">
                                        <el-date-picker
                                            v-model.trim="editData.listingDate"
                                            type="date"
                                            placeholder="请输入上市日期"
                                            clearable
                                            style="width:300px">
                                        </el-date-picker>
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <span>{{ editData.listingDate }}</span>
                                </template>
                            </td>
                        </tr>
                        <tr>
                            <th>最后交易日</th>
                            <td>
                                <template v-if="canEditData">
                                    <el-form-item prop="lastTransDate" class="hb-mb0">
                                        <el-input
                                            v-model.trim="editData.lastTransDate"
                                            type="textarea"
                                            placeholder="请输入最后交易日"
                                            clearable
                                            :rows="3"
                                            resize="none"
                                            style="width:300px"
                                        />
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <span>{{ editData.lastTransDate }}</span>
                                </template>
                            </td>
                            <th>合约数量</th>
                            <td>
                                <span>{{ editData.contractNumber }}</span>
                            </td>
                        </tr>
                    </table>
                </template>
                <!-- 品种交割信息 -->
                <template>
                    <div class="hbb-f-title">
                        交割信息
                    </div>
                    <table class="hbb-f-table">
                        <tr>
                            <th>交割单位</th>
                            <td>
                                <template v-if="canEditData">
                                    <el-form-item prop="deliveryUnit" class="hb-mb0">
                                        <el-input
                                            v-model.trim="editData.deliveryUnit"
                                            type="text"
                                            placeholder="请输入交割单位"
                                            clearable
                                            style="width:300px"
                                        />
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <span>{{ editData.deliveryUnit }}</span>
                                </template>
                            </td>
                            <th>交割方式</th>
                            <td>
                                <template v-if="canEditData">
                                    <el-form-item prop="deliveryType" class="hb-mb0">
                                        <el-input
                                            v-model.trim="editData.deliveryType"
                                            type="text"
                                            placeholder="请输入交割方式"
                                            clearable
                                            style="width:300px"
                                        >
                                        </el-input>
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <span>{{ editData.deliveryType }}</span>
                                </template>
                            </td>
                        </tr>
                        <tr>
                            <th>合约交割月份</th>
                            <td>
                                <template v-if="canEditData">
                                    <el-form-item prop="contractMonth" class="hb-mb0">
                                        <el-input
                                            v-model.trim="editData.contractMonth"
                                            type="textarea"
                                            placeholder="请输入合约交割月份"
                                            clearable
                                            :rows="3"
                                            resize="none"
                                            style="width:300px"
                                        />
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <span>{{ editData.contractMonth }}</span>
                                </template>
                            </td>
                            <th>最后交割日</th>
                            <td>
                                <template v-if="canEditData">
                                    <el-form-item prop="lastTradingDay" class="hb-mb0">
                                        <el-input
                                            v-model.trim="editData.lastTradingDay"
                                            type="textarea"
                                            placeholder="请输入最后交割日"
                                            clearable
                                            resize="none"
                                            :rows="3"
                                            style="width:300px"
                                        />
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <span>{{ editData.lastTradingDay }}</span>
                                </template>
                            </td>
                        </tr>
                        <tr>
                            <th>交割地点</th>
                            <td>
                                <template v-if="canEditData">
                                    <el-form-item prop="deliveryPoints" class="hb-mb0">
                                        <el-input
                                            v-model.trim="editData.deliveryPoints"
                                            type="textarea"
                                            placeholder="请输入交割地点"
                                            clearable
                                            :rows="3"
                                            resize="none"
                                            style="width:300px"
                                        />
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <span>{{ editData.deliveryPoints }}</span>
                                </template>
                            </td>
                            <th>交割品级</th>
                            <td>
                                <template v-if="canEditData">
                                    <el-form-item prop="deliveryGrade" class="hb-mb0">
                                        <el-input
                                            v-model.trim="editData.deliveryGrade"
                                            type="textarea"
                                            placeholder="请输入交割品级"
                                            clearable
                                            resize="none"
                                            :rows="3"
                                            style="width:300px"
                                        />
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <span>{{ editData.deliveryGrade }}</span>
                                </template>
                            </td>
                        </tr>
                    </table>
                </template>
                <!-- 品种交易时间 -->
                <template>
                    <div class="hbb-f-title">
                        交易时间
                    </div>
                    <el-form-item label="白盘交易：" prop="supportDay" label-width="120px">
                        <el-radio-group v-model="editData.supportDay" :disabled="!canEditData" @change="onSupportDayChange">
                            <el-radio label="1">
                                支持
                            </el-radio>
                            <el-radio label="0">
                                不支持
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item style="padding-left: 120px" prop="dayTimeAM">
                        <span>上午开市：</span>
                        <el-time-picker
                            v-model="editData.dayTimeAM"
                            is-range
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            format="HH:mm:ss"
                            value-format="HH:mm:ss"
                            :disabled="editData.supportDay === '0' || !canEditData"
                        />
                    </el-form-item>
                    <el-form-item label-width="120px">
                        <span>盘中休市：</span>
                        <el-time-picker
                            v-model="editData.timePause"
                            is-range
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            format="HH:mm:ss"
                            value-format="HH:mm:ss"
                            :disabled="!canEditData"
                        />
                        <el-radio-group style="margin-left:20px" v-model="editData.supportClosed" :disabled="!canEditData">
                            <el-radio label="1">
                                支持
                            </el-radio>
                            <el-radio label="0">
                                不支持
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item style="padding-left: 120px" prop="dayTimePM">
                        <div style="margin-top: 10px">
                            <span>下午开市：</span>
                            <el-time-picker
                                v-model="editData.dayTimePM"
                                is-range
                                range-separator="-"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围"
                                format="HH:mm:ss"
                                value-format="HH:mm:ss"
                                :disabled="editData.supportNight === '0' || !canEditData"
                            />
                        </div>
                    </el-form-item>
                    <el-form-item label="夜盘交易：" prop="supportNight" label-width="120px">
                        <el-radio-group v-model="editData.supportNight" :disabled="!canEditData" @change="onSupportNightChange">
                            <el-radio label="1">
                                支持
                            </el-radio>
                            <el-radio label="0">
                                不支持
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item style="padding-left: 120px" prop="nightTimeT">
                        <div style="margin-top: 5px">
                            <span>当日：</span>
                            <el-time-picker
                                v-model="editData.nightTimeT"
                                is-range
                                range-separator="-"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围"
                                format="HH:mm:ss"
                                value-format="HH:mm:ss"
                                :disabled="editData.supportNight === '0' || !canEditData"
                            />
                        </div>
                    </el-form-item>
                    <el-form-item style="padding-left: 120px" prop="nightTimeN">
                        <div style="margin-top: 10px">
                            <span>次日：</span>
                            <el-time-picker
                                v-model="editData.nightTimeN"
                                is-range
                                range-separator="-"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围"
                                format="HH:mm:ss"
                                value-format="HH:mm:ss"
                                :disabled="editData.supportNight === '0'"
                            />
                        </div>
                    </el-form-item>
                    <el-form-item label="状态：" prop="supportClosed" label-width="120px">
                        <el-radio-group  v-model="editData.status" :disabled="!canEditData">
                            <el-radio label="1">
                                已上架
                            </el-radio>
                            <el-radio label="0">
                                已下架
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="时间备注：" prop="timeNotes" label-width="120px">
                        <el-input
                            v-model.trim="editData.timeNotes"
                            :disabled="!canEditData"
                            type="textarea"
                            :rows="3"
                            resize="none"
                            maxLength="100"
                            placeholder="请输入时间备注,最大字数不超过100字"
                        />
                    </el-form-item>
                </template>
            </el-form>
            <div v-if="canEditData" class="form-submit-line" style="width: 500px;margin-top: 20px">
                <el-button @click="clickClose">
                    关闭
                </el-button>
                <el-button type="primary" @click="clickSave">
                    保存
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Ref, Vue, Watch} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import dayjs from 'dayjs';

    let editDataSnapshot = '';
    @Component({
        components: {},
        mixins: []
    })
    export default class extends Vue {
        canEditData = false;
        id = '';
        editData: any = {
            name: '', // 展示名称
            exchangeId: '', // 交易所全称
            status: '', // 状态
            contractNumber: '--', // 合约数量
            supportDay: '', // 白盘交易 1=支持 0=不支持
            supportNight: '', // 夜盘交易 1=支持 0=不支持
            supportClosed: '', // 是否支持中间修休盘 1=支持 0=不支持

            speciesCode: '', // 交易代码
            speciesUnit: '', // 交易单位
            speciesQuotedUnit: '', // 报价单位
            speciesMinUnit: '', // 最小变动单位
            limitRange: '', // 涨跌停板幅度
            contractMonths: '', // 合约月份度
            tradeKickerMin: '', // 最低交易保证金
            listingDate: '', // 上市日期
            lastTransDate: '', // 最后交易日
            deliveryUnit: '', // 交割单位
            deliveryType: '', // 交割方式
            contractMonth: '', // 合约交割月份
            lastTradingDay: '', // 最后交割日
            deliveryPoints: '', // 交割地点
            deliveryGrade: '', // 交割品级
            timeNotes: '', // 时间备注

            timePause: [
                '10:15:00',
                '10:30:00'
            ],
            dayTimeAM: [
                '09:00:00', // 年月日 随便填 默认上午9:00
                '11:30:00' // 默认下午 11:30
            ],
            dayTimePM: [
                '13:30:00',
                '15:00:00'
            ],
            nightTimeT: [ // 当日
                '21:00:00',
                '23:59:59'
            ],
            nightTimeN: [ // 次日
                '00:00:00',
                '02:30:00'
            ]
        };

        dataRule: any = {
            name: [{required: true, message: '请输入种类名称', trigger: 'blur'}],
            exchangeId: [{required: true, message: '请选择交易所', trigger: 'change'}],
            dayTimeAM: [{required: true, validator: this.validateDayAM, trigger: 'change'}],
            dayTimePM: [{required: true, validator: this.validateDayPM, trigger: 'change'}],
            nightTimeT: [{required: true, validator: this.validateNightT, trigger: 'change'}]
            // nightTimeN: [{required: true, validator: this.validateNightN, trigger: 'change'}]
        };

        sourceList: any = [];

        @Ref('dataForm')
        dataForm!: ElForm;

        validateDayAM(rule: any, value: string[], callback: Function) {
            if (!value || !value[0] || !value[1]) {
                if (this.editData.supportDay === '0') {
                    return callback();
                }
                callback(new Error('请选择时间'));
                return;
            }
            if (value[0] < '08:00:00' || value[0] > '12:00:00') {
                return callback(new Error('起始时间应在08:00:00 - 12:00:00'));
            }
            if (value[1] < '08:00:00' || value[1] > '12:00:00') {
                return callback(new Error('结束时间应在08:00:00 - 12:00:00'));
            }
            callback();
        }

        validateDayPM(rule: any, value: string[], callback: Function) { // 次日
            if (!value || !value[0] || !value[1]) {
                if (this.editData.supportDay === '0') {
                    return callback();
                }
                callback(new Error('请选择时间'));
                return;
            }
            if (value[0] < '13:00:00' || value[0] > '16:00:00') {
                return callback(new Error('起始时间应在13:00:00-16:00:00'));
            }
            if (value[1] < '13:00:00' || value[1] > '16:00:00') {
                return callback(new Error('结束时间应在13:00:00-16:00:00'));
            }
            callback();
        }

        validateNightT(rule: any, value: string[], callback: Function) { // 当日
            if (!value || !value[0] || !value[1]) {
                if (this.editData.supportNight === '0') {
                    return callback();
                }
                callback(new Error('请选择时间'));
                return;
            }
            if (value[0] < '20:00:00' || value[0] > '23:59:59') {
                return callback(new Error('起始时间应在20:00:00-23:59:59'));
            }
            if (value[1] < '20:00:00' || value[1] > '23:59:59') {
                return callback(new Error('结束时间应在20:00:00-23:59:59'));
            }
            callback();
        }

        validateNightN(rule: any, value: string[], callback: Function) {
            if (!value || !value[0] || !value[1]) {
                if (this.editData.supportNight === '0') {
                    return callback();
                }
                callback(new Error('请选择时间'));
                return;
            }
            if (value[0] < '00:00:00' || value[0] > '03:00:00') {
                return callback(new Error('起始时间应在00:00:00-03:00:00'));
            }
            if (value[1] < '00:00:00' || value[1] > '03:00:00') {
                return callback(new Error('结束时间应在00:00:00-03:00:00'));
            }
            callback();
        }

        async mounted() {
            this.id = this.$route.query.id + '';
            if (!this.id || this.id === 'undefined') {
                this.$message.error('id不正确');
                return;
            }
            // 保存未更改的快照, 用于对比数据是否发生更改
            this.getDataSource();
            this.getData();
        }

        async getDataSource() {
            const [err, resp] = await this.$getAsync('/quotation/selectQuotationSourceAll', {});
            if (resp?.code === '000000') {
                const list: any = [];
                (resp?.data || []).forEach((item: any) => {
                    list.push({
                        id: String(item.quotationSourceId),
                        name: item.sourceName
                    });
                });
                this.sourceList = list;
            }
        }

        async getData() {
            this.$showLoading();
            const [_, resp] = await this.$getAsync('/quotation/getQuotationSpeciesDetail', {
                quotationSpeciesId: this.id
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                const data = resp.data;
                this.editData.name = data.speciesName;
                this.editData.exchangeId = data.quotationSourceId + '';
                this.editData.contractNumber = data.contractNumber + '';
                // if (Number(data.contractNumber) === 0) {
                //     this.canEditData = true;
                // }
                this.editData.status = data.status + '';
                this.editData.supportDay = data.supportDay + '';
                this.editData.supportNight = data.supportNight + '';
                this.editData.supportClosed = data.supportClosed + '';

                // 盘中休市
                this.editData.timePause = [data.closedStart, data.closedEnd];

                this.editData.nightTimeN = [data.nightAmStart, data.nightAmEnd]; // 次日
                this.editData.nightTimeT = [data.nightPmStart, data.nightPmEnd]; // 当日
                this.editData.dayTimeAM = [data.dayAmStart, data.dayAmEnd];
                this.editData.dayTimePM = [data.dayPmStart, data.dayPmEnd];

                this.editData.speciesCode = data.speciesCode;
                this.editData.speciesUnit = data.speciesUnit;
                this.editData.speciesQuotedUnit = data.speciesQuotedUnit;
                this.editData.speciesMinUnit = data.speciesMinUnit;
                this.editData.limitRange = data.limitRange;
                this.editData.contractMonths = data.contractMonths;
                this.editData.tradeKickerMin = data.tradeKickerMin;
                this.editData.listingDate = data.listingDate ? dayjs(data.listingDate).format('YYYY-MM-DD') : '';
                this.editData.lastTransDate = data.lastTransDate;
                this.editData.deliveryUnit = data.deliveryUnit;
                this.editData.deliveryType = data.deliveryType;
                this.editData.contractMonth = data.contractMonth;
                this.editData.lastTradingDay = data.lastTradingDay;
                this.editData.deliveryPoints = data.deliveryPoints;
                this.editData.deliveryGrade = data.deliveryGrade;
                this.editData.timeNotes = data.timeNotes;
            }
            // 保存未更改的快照, 用于对比数据是否发生更改
            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            });
        }

        onSupportNightChange(val: string) {
            this.dataForm.clearValidate('nightTimeT');
            this.dataForm.clearValidate('nightTimeN');
        }

        onSupportDayChange(val: string) {
            this.dataForm.clearValidate('dayTimeAM');
            this.dataForm.clearValidate('dayTimePM');
        }

        clickClose() {
            const editDataNewSnapshot = JSON.stringify(this.editData);
            if (editDataSnapshot === '' || editDataNewSnapshot === editDataSnapshot) {
                this.$router.back();
                return;
            }
            this.$showMessageBox('内容未保存，是否关闭?').then(() => {
                this.$router.back();
            }).catch(() => {
            });
        }

        clickSave() {
            this.dataForm.validate((valid: boolean) => {
                if (valid) {
                    this.$showMessageBox('是否保存?').then(() => {
                        this.doSave();
                    }).catch(() => {
                    });
                }
            });
        }

        async doSave() {
            this.$showLoading();
            const data = {
                quotationSpeciesId: this.id,
                speciesName: this.editData.name, // 种类名称
                quotationSourceId: this.editData.exchangeId, // 行情来源id，交易所id
                status: this.editData.status,
                supportDay: this.editData.supportDay,
                supportNight: this.editData.supportNight,
                supportClosed: this.editData.supportClosed,
                dayAmStart: this.editData?.dayTimeAM?.[0] || '',
                dayAmEnd: this.editData?.dayTimeAM?.[1] || '',
                dayPmStart: this.editData?.dayTimePM?.[0] || '',
                dayPmEnd: this.editData?.dayTimePM?.[1] || '',
                nightAmStart: this.editData?.nightTimeN?.[0] || '',
                nightAmEnd: this.editData?.nightTimeN?.[1] || '',
                nightPmStart: this.editData?.nightTimeT?.[0] || '',
                nightPmEnd: this.editData?.nightTimeT?.[1] || '',
                closedStart: this.editData?.timePause?.[0] || '',
                closedEnd: this.editData?.timePause?.[1] || '',
                speciesCode: encodeURI(this.editData.speciesCode), // 交易代码
                speciesUnit: encodeURI(this.editData.speciesUnit), // 交易单位
                speciesQuotedUnit: encodeURI(this.editData.speciesQuotedUnit), // 报价单位
                speciesMinUnit: encodeURI(this.editData.speciesMinUnit), // 最小变动单位
                limitRange: encodeURI(this.editData.limitRange), // 涨跌停板幅度
                contractMonths: encodeURI(this.editData.contractMonths), // 合约月份度
                tradeKickerMin: encodeURI(this.editData.tradeKickerMin), // 最低交易保证金
                listingDate: this.editData.listingDate ? dayjs(this.editData.listingDate).format('YYYY-MM-DD') : '', // 上市日期
                lastTransDate: encodeURI(this.editData.lastTransDate), // 最后交易日
                deliveryUnit: encodeURI(this.editData.deliveryUnit), // 交割单位
                deliveryType: encodeURI(this.editData.deliveryType), // 交割方式
                contractMonth: encodeURI(this.editData.contractMonth), // 合约交割月份
                lastTradingDay: encodeURI(this.editData.lastTradingDay), // 最后交割日
                deliveryPoints: encodeURI(this.editData.deliveryPoints), // 交割地点
                deliveryGrade: encodeURI(this.editData.deliveryGrade), // 交割品级
                timeNotes: encodeURI(this.editData.timeNotes) // 时间备注
            };
            const [err, resp] = await this.$postAsync('/quotation/updateOrAddQuotationSpecies', data, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('保存成功');
                setTimeout(() => {
                    this.$router.back();
                }, 300);
            } else {
                this.$showToast(resp?.message || '保存失败');
            }
        }

        editClick() {
            // 点击编辑
            this.canEditData = true;
        }

        clearClick() {
            // 点击取消编辑
            this.canEditData = false;
        }
    }
</script>

<style lang="scss" scoped>
    .page-cap-titleH{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        margin-top: 10px;
        span{
            font-size: 20px;
        }
        .el-button {
            span{
                font-size: 14px;
            }
        }
    }
    .hbb-f-title{
        display: flex;
        width: 100%;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
        margin: 20px 0;
        font-size: 16px;
        color: #666;
        font-weight: bold;
    }
    .hbb-f-table{
        word-wrap: break-word;
        table-layout: fixed !important;
        word-break: break-all;
        border: 1px solid #ddd;
        tr{
            th{
                min-width:160px;
                padding: 10px;
                border-right: 1px solid #ddd;
                border-bottom: 1px solid #ddd;
                span{
                    color: #e74c3c;
                }
            }
            td{
                min-width:265px;
                padding: 10px;
                border-right: 1px solid #ddd;
                border-bottom: 1px solid #ddd;
            }
        }
    }
    .hb-mb0{
        margin-bottom: 0 !important;
        .el-input__inner{
            border: none !important;
            border-radius: 0 !important;
        }
    }
    /deep/ .el-form-item__error{
        padding-left: 43px;
    }
</style>
