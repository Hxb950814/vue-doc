<template>
    <div>
        <div class="page-cap-title page-cap-titleH">
            <span>添加策略</span>
            <el-button type="danger" class="page-table-btn" @click="editInfo">
                添加
            </el-button>
        </div>
        <!--    内容部分    -->
        <div class="hbb-contentBox">
            <div class="left-box">
                <el-form ref="dataForm" class="form-data form-style" :model="pageData" :rules="dataRule">
                    <div class="group">
                        <span>策略名称：</span>
                        <el-form-item prop="strategyName" style="width:60%;margin-bottom:0">
                            <el-input
                                v-model.trim="pageData.strategyName"
                                :disabled="!canEdit"
                                placeholder="请输入策略名称限制15字符"
                                maxlength="15"
                            />
                        </el-form-item>
                    </div>
                    <div class="group">
                        <span>策略本金：</span>
                        <el-form-item prop="strategyName" style="width:60%;margin-bottom:0">
                            <el-input
                                v-model.trim="pageData.strategyCapital"
                                :disabled="!canEdit"
                                placeholder="请输入策略本金"
                                @input="inputCheck($event,9, {}, 2)"
                            />
                        </el-form-item>
                    </div>

                    <div class="group">
                        <span>策略ID：</span>
                        <el-form-item prop="strategyIdString" style="width:60%;margin-bottom:0">
                            <el-input
                                v-model.trim="pageData.strategyIdString"
                                :disabled="!canEdit"
                                type="text"
                                placeholder="请输入策略ID"
                            />
                        </el-form-item>
                        <el-button :disabled="!canEdit" style="margin-left:15px" type="primary" class="page-table-btn" @click="queryCe">
                            查询
                        </el-button>
                    </div>
                    <div class="group">
                        <span>费用模式：</span>
                        <el-form-item style="width:60%;margin-bottom:0">
                            <div class="inputBox radioBox" style="margin-bottom:10px">
                                <el-radio v-model="pageData.serviceType" :disabled="!canEdit" label="0" @change="handCloseChange">
                                    比例模式
                                </el-radio>
                                <el-radio v-model="pageData.serviceType" :disabled="!canEdit" label="1" @change="handCloseChange">
                                    订阅模式
                                </el-radio>
                            </div>
                            <el-input
                                v-if="pageData.serviceType === '0'"
                                v-model.trim="pageData.serviceRate"
                                :disabled="!canEdit"
                                placeholder="输入数值（比例模式0-100)"
                                type="number"
                                @input="inputCheck($event,1, {}, 2)"
                            >
                                <i
                                    slot="suffix"
                                >
                                    %
                                </i>
                            </el-input>
                            <el-input
                                v-if="pageData.serviceType === '1'"
                                v-model.trim="pageData.serviceBean"
                                :disabled="!canEdit"
                                placeholder="输入数值（订阅模式0-100万）"
                                type="number"
                                @input="inputCheck($event,4, {}, 2)"
                            >
                                <i
                                    slot="suffix"
                                >
                                    万
                                </i>
                            </el-input>
                            <div class="hbb-tip">
                                注：比例模式为%，订阅模式为K豆数量
                            </div>
                        </el-form-item>
                    </div>
                    <div class="group">
                        <span>策略额度：</span>
                        <el-form-item style="width:60%;margin-bottom:0">
                            <div class="inputBox radioBox">
                                <el-radio v-model="pageData.strategyQuotaType" :disabled="!canEdit" label="0" @change="handCloseChange">
                                    无限制
                                </el-radio>
                                <el-radio v-model="pageData.strategyQuotaType" :disabled="!canEdit" label="1" @change="handCloseChange">
                                    固定额度
                                </el-radio>
                            </div>
                            <el-input
                                v-if="pageData.strategyQuotaType === '1'"
                                v-model.trim="pageData.strategyQuota"
                                style="margin-top:10px"
                                :disabled="!canEdit"
                                placeholder="请输入额度"
                                type="text"
                                maxlength="10"
                                @input="inputCheck($event,5, {}, 2)"
                            >
                                <i
                                    slot="suffix"
                                >
                                    万
                                </i>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div class="group">
                        <span>资金上限：</span>
                        <el-input
                            v-model.trim="pageData.fundTopLimit"
                            :disabled="!canEdit"
                            placeholder="请输入操作资金上限"
                            type="number"
                            @input="inputCheck($event,2, {}, 2)"
                        >
                            <i
                                slot="suffix"
                            >
                                万
                            </i>
                        </el-input>
                    </div>
                    <div class="group">
                        <span>最大止盈：</span>
                        <div class="inputBox">
                            <el-input
                                v-for="(item,index) in surplusList"
                                :key="index"
                                v-model.trim="item.profitRate"
                                :disabled="!canEdit"
                                :placeholder="item.placeholder"
                                type="number"
                                @input="inputCheck($event,0,item, 2)"
                            >
                                <i
                                    slot="suffix"
                                >
                                    %
                                </i>
                            </el-input>
                        </div>
                    </div>
                    <div class="group">
                        <span>最大止损：</span>
                        <div class="inputBox">
                            <el-input
                                v-for="(itm,ind) in damageList"
                                :key="ind"
                                v-model.trim="itm.profitRate"
                                :disabled="!canEdit"
                                :placeholder="itm.placeholder"
                                type="number"
                                @input="inputCheck($event,0,itm, 2)"
                            >
                                <i
                                    slot="suffix"
                                >
                                    %
                                </i>
                            </el-input>
                        </div>
                    </div>
                    <div class="group">
                        <span>资产步长：</span>
                        <el-input
                            v-model.trim="pageData.assetStepSize"
                            :disabled="!canEdit"
                            placeholder="输入数字为0.1-1 之间，小数点后一位"
                            type="number"
                            @input="inputCheck($event,6, {}, 3)"
                        >
                            <i
                                slot="suffix"
                            >
                                万
                            </i>
                        </el-input>
                    </div>
                    <div class="group">
                        <span>有效天数：</span>
                        <el-input
                            v-model.trim="pageData.validDay"
                            :disabled="!canEdit"
                            type="number"
                            placeholder="请输入有效天数"
                            @input="inputCheck($event,8, {}, 1)"
                        >
                            <i
                                slot="suffix"
                            >
                                天
                            </i>
                        </el-input>
                    </div>
                    <div class="group">
                        <span>策略标签：</span>
                        <div class="inputBox">
                            <el-input
                                v-model.trim="pageData.strategyLabel1"
                                :disabled="!canEdit"
                                placeholder="标签1（限6字）"
                                maxlength="6"
                            />
                            <el-input
                                v-model.trim="pageData.strategyLabel2"
                                :disabled="!canEdit"
                                placeholder="标签2（限6字）"
                                maxlength="6"
                            />
                            <el-input
                                v-model.trim="pageData.strategyLabel3"
                                :disabled="!canEdit"
                                placeholder="标签3（限6字）"
                                maxlength="6"
                            />
                        </div>
                    </div>
                    <div class="group">
                        <span>限制次数：</span>
                        <el-form-item style="width:60%;margin-bottom:0">
                            <div class="inputBox radioBox">
                                <el-radio v-model="pageData.limitNumType" :disabled="!canEdit" label="0" @change="handCloseChange">
                                    无限制
                                </el-radio>
                                <el-radio v-model="pageData.limitNumType" :disabled="!canEdit" label="1" @change="handCloseChange">
                                    固定次数
                                </el-radio>
                            </div>
                            <el-input
                                v-if="pageData.limitNumType === '1'"
                                v-model.trim="pageData.limitNum"
                                style="margin-top:10px"
                                :disabled="!canEdit"
                                placeholder="请输入次数"
                                type="number"
                                @input="inputCheck($event,7, {}, 1)"
                            />
                        </el-form-item>
                    </div>
                    <div class="group">
                        <span>新户专享：</span>
                        <div class="inputBox radioBox">
                            <el-radio v-model="pageData.newUserUse" :disabled="!canEdit" label="0">
                                否
                            </el-radio>
                            <el-radio v-model="pageData.newUserUse" :disabled="!canEdit" label="1">
                                是
                            </el-radio>
                        </div>
                    </div>
                    <div class="group">
                        <span>手动关闭：</span>
                        <div class="inputBox radioBox">
                            <el-radio v-model="pageData.isHandClose" :disabled="!canEdit" label="0" @change="handCloseChange">
                                不支持
                            </el-radio>
                            <el-radio v-model="pageData.isHandClose" :disabled="!canEdit" label="1" @change="handCloseChange">
                                可支持
                            </el-radio>
                            <span class="wybl">
                                <el-input
                                    v-model.trim="pageData.defaultRate"
                                    style="width:130px;"
                                    :disabled="!canEdit || !isZhi"
                                    placeholder="请输入违约比例"
                                    type="number"
                                    @input="inputCheck($event,3,{}, 2)"
                                >
                                    <i
                                        slot="suffix"
                                    >
                                        %
                                    </i>
                                </el-input>
                            </span>
                        </div>
                    </div>
                    <div class="group">
                        <span>用户持仓：</span>
                        <div class="inputBox radioBox">
                            <el-radio v-model="pageData.strategyPosition" :disabled="!canEdit" label="1">
                                可显示
                            </el-radio>
                            <el-radio v-model="pageData.strategyPosition" :disabled="!canEdit" label="0">
                                不显示
                            </el-radio>
                        </div>
                    </div>
                    <div class="group">
                        <span>交易记录：</span>
                        <div class="inputBox radioBox">
                            <el-radio v-model="pageData.dealLog" :disabled="!canEdit" label="1">
                                可显示
                            </el-radio>
                            <el-radio v-model="pageData.dealLog" :disabled="!canEdit" label="0">
                                不显示
                            </el-radio>
                        </div>
                    </div>
                    <div class="group">
                        <span>当前状态：</span>
                        <div class="inputBox radioBox">
                            <el-radio v-model="pageData.status" :disabled="!canEdit" label="1">
                                展示中
                            </el-radio>
                            <el-radio v-model="pageData.status" :disabled="!canEdit" label="0">
                                不展示
                            </el-radio>
                        </div>
                    </div>
                    <div class="group">
                        <span>使用终端：</span>
                        <div class="inputBox radioBox">
                            <el-checkbox-group v-model="pageData.useClient" :disabled="!canEdit">
                                <el-checkbox label="0">
                                    移动端
                                </el-checkbox>
                                <el-checkbox label="1">
                                    PC端
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div class="group">
                        <span>是否推荐：</span>
                        <div class="inputBox radioBox">
                            <el-radio v-model="pageData.isRecommend" :disabled="!canEdit" label="1">
                                可推荐
                            </el-radio>
                            <el-radio v-model="pageData.isRecommend" :disabled="!canEdit" label="0">
                                不推荐
                            </el-radio>
                        </div>
                    </div>
                    <div class="group">
                        <span>策略介绍：</span>
                        <!--    这也可能是上传图片 【后期需确认修改】       -->
                        <div class="inputBox radioBox">
                            <div v-viewer class="imgBox">
                                <my-image-upload :url.sync="pageData.strategyIntroduceMobile" />
                                <p style="text-align: center">移动端</p>
                            </div>
                            <div v-viewer class="imgBox">
                                <my-image-upload :url.sync="pageData.strategyIntroducePc" />
                                <p style="text-align: center">PC端</p>
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>
            <div class="right-box">
                <div class="hbb-echartBox">
                    <statisticsView ref="statisticsView" />
                </div>
                <!--按钮切换区域-->
                <div class="hbb-navBox">
                    <span :class="isCheckAll ? 'active' : ''" @click="navBtnClick(2 ,-1)">
                        全部
                    </span>
                    <span v-for="(item,index) in navList" :key="index" :class="item.isSelected ? 'active' : ''" @click="navBtnClick(item,index)">
                        {{ item.title }}
                    </span>
                </div>
                <!--自选区域-->
                <div class="hbb-ownBox">
                    <div class="title">
                        配置合约 <span @click="addContractClick">+</span>
                    </div>
                    <el-table
                        :data="pageData.strategyContractConfigDoList"
                        :header-cell-style="{background: '#f3f3f3'}"
                        border
                        max-height="350"
                        style="width: 100%;"
                    >
                        <el-table-column
                            prop="date"
                            label="序号"
                            align="center"
                            width="55"
                        >
                            <template slot-scope="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="speciesName"
                            label="合约品种"
                            width="180"
                        />
                        <el-table-column
                            prop="contractName"
                            label="合约名称"
                        />
                        <el-table-column
                            prop="contractCode"
                            label="合约代码"
                        />
                        <el-table-column
                            prop="sourceName"
                            label="交易所"
                        />
                        <el-table-column
                            prop=""
                            align="center"
                            label="操作"
                        >
                            <template slot-scope="scope">
                                <span style="cursor: pointer;color: #1a7ef8" @click="delClick(scope.row)">移除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <!--      配置合约弹层-->
        <configurationView ref="configurationView" />
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import configurationView from './modalView/configuration.vue';
    import statisticsView from './compontent/statistics.vue';
    import MyImageUpload from '@/components/MyImageUpload.vue';
    import {integer} from '@/utils';
    @Component({
        components: {configurationView, statisticsView, MyImageUpload}
    })

    export default class extends Vue {
        canEdit:boolean = true; // 是否是编辑模式
        strategyId:string = ''; // 当前的策略id
        navList:any[] = [
            {timeType: 0, title: '近7天', isSelected: false},
            {timeType: 1, title: '近1月', isSelected: false},
            {timeType: 3, title: '近3月', isSelected: false},
            {timeType: 6, title: '近半年', isSelected: false},
            {timeType: 12, title: '近1年', isSelected: false},
            {timeType: 24, title: '近2年', isSelected: false},
            {timeType: 36, title: '近3年', isSelected: false},
            {timeType: 48, title: '近4年', isSelected: false}
        ];

        isCheckAll:boolean = true; // 当前选中的按钮 是否选择全部

        pageData = {
            dealLog: '0', // 交易记录
            strategyCapital: '', // 策略本金
            defaultRate: '', // 违约比例
            fundTopLimit: '', // 资金上限
            isHandClose: '1', // 手动关闭 0=不支持，1=支持
            isRecommend: '1', // 是否推荐 0=不推荐，1=可推荐
            operator: '', // 操作人
            profitRateList: [], // 止盈止损率List
            serviceRate: '', // 服务费率
            status: '1', // 当前状态 0=不展示，1=展示
            strategyContractConfigDoList: [], // 合约配置list
            strategyId: '', // 策略主键id
            strategyIdString: '', // 策略ID
            strategyIntroduceMobile: '', // 策略介绍移动端图片链接
            strategyIntroducePc: '', // 策略介绍pc端图片链接
            strategyLabel1: '', // 策略便签1
            strategyLabel2: '', // 策略便签2
            strategyLabel3: '', // 策略便签3
            strategyName: '', // 策略名称
            strategyPosition: '0', // 用户持仓 0=不显示，1=显示
            strategyProfitChartConfigList: [], // 收益图表配置list
            useClient: ['0', '1'], // 使用前端 0=移动端 1=pc端(多选）
            validDay: '', // 有效天数
            serviceType: '0', // 费用模式 0=比例模式、1=订阅模式
            serviceBean: '', // 订阅模式k豆数量
            strategyQuotaType: '0', // 策略额度 0=无限制,1=固定额度
            strategyQuota: '', // 策略额度
            assetStepSize: '', // 资产步长(万) 输入数字为0.1-1 之间，小数点后一位
            limitNumType: '0', // 限制次数类型 0=无限制， 1=固定次数
            limitNum: '', // 限制次数
            newUserUse: '0' // 新户专享 0=否，1=是
        }; // 页面数据源

        dataRule: any = {
            strategyName: [{required: true, message: '请输入策略名称', trigger: 'blur'}],
            strategyIdString: [{required: true, message: '请输入策略ID', trigger: 'blur'}]
        };

        isZhi:number = 1; // 默认支持

        surplusList:any[] = []; // 止盈数据

        damageList:any[] = []; // 止损数据

        mounted() {
            this.init();
        }

        init() {
            // 默认选中所有的时间区域配置
            this.navList.forEach((x:any) => {
                x.isSelected = true;
            });
            // 新增时候组装最大止盈最大止损的数据结构
            const obj = {
                profitRate: ''
            };
            for (let i = 0; i < 3; i++) {
                this.surplusList.push(obj);
                this.damageList.push(obj);
            }
            this.surplusList = this.surplusList.map((x:any, i:number) => {
                return {
                    profitType: 0,
                    profitRate: x.profitRate,
                    placeholder: '最大止盈-' + (i + 1)
                };
            });
            this.damageList = this.damageList.map((y:any, i:number) => {
                return {
                    profitType: 1,
                    profitRate: y.profitRate,
                    placeholder: '最大止损-' + (i + 1)
                };
            });
        }

        navBtnClick(item:any, index:number) {
            // 点击切换模拟收益区的按钮

            if (index === -1) {
                this.isCheckAll = !this.isCheckAll;
                this.navList.forEach((x:any) => {
                    if (this.isCheckAll) {
                        x.isSelected = true;
                    } else {
                        x.isSelected = false;
                    }
                    const indx = this.navList.indexOf(x);
                    this.$set(this.navList, indx, x);
                });
            } else {
                item.isSelected = !item.isSelected;
                const ind = this.navList.indexOf(item);
                this.$set(this.navList, ind, item);
            }
            let flagL:any[] = [];
            flagL = this.navList.filter((x:any) => x.isSelected === true);
            if (flagL.length === this.navList.length) {
                this.isCheckAll = true;
            } else {
                this.isCheckAll = false;
            };
        }

        addContractClick() {
            // 点击配置合约 弹层是否启动
            (this.$refs.configurationView as any).active();
        }

        queryCe() {
            (this.$refs.statisticsView as any).timeChange();
        }

        editInfo() {
            // 点击添加效果
            console.log(this.pageData.useClient);
            if (this.pageData.useClient.length === 0) {
                this.$message({
                    type: 'warning',
                    message: '请至少选择一种使用终端'
                });
                return false;
            }
            if (this.pageData.serviceType === '1') {
                if (Number(this.pageData.serviceBean) < 0) {
                    this.$message({
                        type: 'warning',
                        message: '订阅模式下K豆数量为0-100之间'
                    });
                    return false;
                }
            }
            (this.$refs.dataForm as ElForm).validate((valid: boolean) => {
                if (valid) {
                    this.$confirm('是否确认添加?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.doSave();
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消添加'
                        });
                    });
                }
            });
        }

        async doSave() {
            // 保存操作
            // 重组止盈止损list
            (this.pageData.profitRateList as any) = [...this.surplusList, ...this.damageList];
            // 重组收益图表list
            const requestArr = this.navList.filter((y:any) => y.isSelected === true).map((x:any) => {
                return {
                    timeType: x.timeType,
                    strategyId: this.strategyId
                };
            });
            if (requestArr.length < 2) {
                this.$message({
                    type: 'info',
                    message: '至少选择两个区间段'
                });
                return;
            }
            const data:any = {
                dealLog: this.pageData.dealLog, // 交易记录
                defaultRate: this.pageData.defaultRate, // 违约比例
                fundTopLimit: this.pageData.fundTopLimit, // 资金上限
                isHandClose: this.pageData.isHandClose, // 手动关闭 0=不支持，1=支持
                isRecommend: this.pageData.isRecommend, // 是否推荐 0=不推荐，1=可推荐
                operator: this.pageData.operator, // 操作人
                profitRateList: this.pageData.profitRateList, // 止盈止损率List
                serviceRate: Number(this.pageData.serviceRate), // 服务费率
                status: this.pageData.status, // 当前状态 0=不展示，1=展示
                strategyContractConfigDoList: this.pageData.strategyContractConfigDoList, // 合约配置list
                strategyId: this.strategyId, // 策略主键id
                strategyIdString: this.pageData.strategyIdString, // 策略ID
                strategyIntroduceMobile: this.pageData.strategyIntroduceMobile, // 策略介绍移动端图片链接
                strategyIntroducePc: this.pageData.strategyIntroducePc, // 策略介绍pc端图片链接
                strategyLabel1: this.pageData.strategyLabel1, // 策略便签1
                strategyLabel2: this.pageData.strategyLabel2, // 策略便签2
                strategyLabel3: this.pageData.strategyLabel3, // 策略便签3
                strategyName: this.pageData.strategyName, // 策略名称
                strategyPosition: this.pageData.strategyPosition, // 用户持仓 0=不显示，1=显示
                strategyProfitChartConfigList: requestArr, // 收益图表配置list
                useClient: (this.pageData.useClient as any).join(','), // 使用前端 0=移动端 1=pc端(多选）
                validDay: this.pageData.validDay, // 有效天数
                serviceType: this.pageData.serviceType,
                serviceBean: Number(this.pageData.serviceBean),
                strategyQuotaType: this.pageData.strategyQuotaType,
                strategyQuota: this.pageData.strategyQuota,
                assetStepSize: Number(this.pageData.assetStepSize),
                limitNumType: this.pageData.limitNumType,
                limitNum: Number(this.pageData.limitNum),
                newUserUse: this.pageData.newUserUse,
                strategyCapital: Number(this.pageData.strategyCapital)
            };
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/strategy/addOrUpdateStrategyAndConfigContract', data, {
                paramType: 'json'
            });

            if (resp?.code === '000000') {
                this.$message({
                    type: 'success',
                    message: '添加成功!'
                });
                setTimeout(() => {
                    this.$router.replace({
                        path: '/strategy_manage/manage/index'
                    });
                }, 1000);
            } else {
                this.$message({
                    type: 'error',
                    message: '添加失败!'
                });
            }
            this.$closeLoading();
        }

        delClick(row:never) {
            // 移除添加的数据
            const index = this.pageData.strategyContractConfigDoList.indexOf(row);
            this.pageData.strategyContractConfigDoList.splice(index, 1);
        }

        handCloseChange(v:any) {
            if (v === '0') {
                this.pageData.defaultRate = '0';
                this.isZhi = 0;
            } else {
                this.isZhi = 1;
            }
        }

        inputCheck(v:any, type:number, item:any, mode:number) {
            // 如果输入框是百分比的话要进行限制不可超过100 否则不做限制
            // type:0 止盈止损 type：1 服务费率 type:2 资金上限 type: 3 违约比例 4：k豆数量
            // mode:1 只能输入整数 2：保留小数点后面2位 3：保留小数点后面1位
            // integer 判断/* 只能输入正整数 or 保留小数点后2位 or 保留小数点后1位 */
            v = integer(v, mode);
            if (type !== 2 && type !== 5) {
                if (type === 6) {
                    if (Number(v) >= 1) {
                        v = 1;
                    }
                } else if (type === 7) {
                    if (Number(v) >= 1000) {
                        v = 1000;
                    }
                } else if (type === 9) {
                    if (Number(v) >= 100000000000000) {
                        v = 100000000000000;
                    }
                } else if (Number(v) >= 100) {
                        v = 100;
                    }
            }
            switch (type) {
                case 0:
                    item.profitRate = v;
                    break;
                case 1:
                    this.pageData.serviceRate = v;
                    break;
                case 2:
                    this.pageData.fundTopLimit = v;
                    break;
                case 3:
                    this.pageData.defaultRate = v;
                    break;
                case 4:
                    this.pageData.serviceBean = v;
                    break;
                case 5:
                    this.pageData.strategyQuota = v;
                    break;
                case 6:
                    this.pageData.assetStepSize = v;
                    break;
                case 7:
                    this.pageData.limitNum = v;
                    break;
                case 8:
                    this.pageData.validDay = v;
                    break;
                case 9:
                    this.pageData.strategyCapital = v;
                    break;
                default:
                    break;
            }
        }
    }

</script>

<style lang="scss"  scoped>
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
    .hbb-contentBox{
        float: left;
        width: 100%;
        padding: 10px 0;
        .left-box{
            float: left;
            width: 40%;
            .group{
                display: flex;
                width: 100%;
                align-items: center;
                margin-bottom: 20px;
                span{
                    width: 70px;
                    &.el-input__suffix{
                        display: flex;
                        width: 30px;
                        align-items: center;
                        justify-content: center;
                        i{
                            color: #ccc;
                            float: left;
                            height: 100%;
                            line-height: 35px;
                            margin-right: 3px;
                        }
                    }

                }
                &>.radioBox {
                    .imgBox{
                        border: 1px solid #ddd;
                        float: left;
                        margin-right: 20px;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    span{
                        width: 15px !important;
                        &.wybl{
                            width: auto;
                            color: #666 !important;
                            padding: 3px 5px;
                            font-size: 14px;
                        }
                    }
                }
                &>.el-input{
                    width:60%
                }
                &>.inputBox{
                    width: calc(100% - 70px);
                    &>.el-input{
                        width:125px;
                        margin-right:14px
                    }
                }
                .hbb-tip{
                    margin-top: 10px;
                    font-size: 12px;
                    color: #ff2f2f;
                    font-weight: bold;
                }
            }
        }
        .right-box{
            float: right;
            width: 60%;
            .hbb-echartBox{
                display: flex;
                float: right;
                width: 100%;
                height: 380px;
                border: 1px solid #ddd;
            }
            .hbb-navBox{
                display: flex;
                width: 100%;
                float: right;
                justify-content: space-between;
                margin:20px 0;
                cursor: pointer;
                span{
                    width: 60px;
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    background: #ccc;
                    color: #666;
                    font-size: 13px;
                    &.active{
                        background: #1a7ef8;
                        color: #fff;
                    }
                }
            }
            .hbb-ownBox{
                display: flex;
                width: 100%;
                float: right;
                flex-direction: column;
                .title{
                    display: flex;
                    width: 100%;
                    height: 50px;
                    align-items: center;
                    font-size: 14px;
                    margin-bottom: 10px;
                    cursor: pointer;
                    span{
                        font-weight: bold;
                        font-size: 24px;
                        padding-left: 10px;
                        padding-bottom:5px;
                    }
                }
            }
        }
    }
</style>
