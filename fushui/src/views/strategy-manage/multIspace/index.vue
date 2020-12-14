<template>
    <div>
        <div class="page-cap-title">
            多空组合
        </div>
        <div class="page-cap-content">
            <!--      修改参数      -->
            <div class="hbb-page-a">
                <div class="btn a" @click="goPage(1)">
                    修改参数
                </div>
                <div class="item">
                    <span>多空信号</span>
                    <div>
                        <el-switch
                            v-model="pageData.status"
                            active-color="#009AFF"
                            inactive-color="#999999"
                            @change="updateSignalSettingStatus"
                        />
                    </div>
                    <p><b>?</b>启用多空信号，请完善最大资产值及平衡系数设置</p>
                </div>
                <div class="item">
                    <span>最大资产</span>
                    <div>
                        <el-input v-model="pageData.dealAmount" disabled placeholder="请输入内容">
                            <i slot="suffix" class="el-input__icon" style="font-style: normal">万</i>
                        </el-input>
                    </div>
                    <p><b>?</b>输入的资产为1-200之间的正整数</p>
                </div>
                <div class="item">
                    <span>平衡系数</span>
                    <div>
                        <el-input v-model="pageData.dealRatio" disabled placeholder="请输入内容" />
                    </div>
                    <p><b>?</b>输入的系统为0-1之间，不能为0</p>
                </div>
                <div class="item">
                    <span>开启时间</span>
                    <div>
                        <el-date-picker
                            v-model="pageData.openTime"
                            disabled
                            type="datetime"
                            placeholder="选择开启时间"
                            :picker-options="pickerOptions"
                        />
                    </div>
                </div>
            </div>
            <!--      查询费用      -->
            <div class="hbb-page-a">
                <h2>查询费用</h2>
                <div class="btn b" @click="goPage(2)">
                    月卡记录
                </div>
                <div class="item">
                    <span>单词查询</span>
                    <div>
                        <el-input v-model="pageData.oneFee" disabled placeholder="请输入内容" />
                    </div>
                    <p>K豆</p>
                </div>
                <div class="item">
                    <span>多空月卡</span>
                    <div>
                        <el-input v-model="pageData.mouthFee" disabled placeholder="请输入内容" />
                    </div>
                    <p>K豆 <strong>有效天数<el-input v-model="pageData.mouthDay" style="margin: 0 10px" disabled placeholder="请输入内容" />天</strong></p>
                </div>
                <div class="item">
                    <p><b>?</b>有效天数是自用户购买包月套餐当天开始计算，后推30天；修改前购买的用户不受修改后的影响</p>
                </div>
            </div>
            <!--      多空信号      -->
            <div class="hbb-page-a">
                <h2>多空信号 <b>?</b> <span>每天下午15:30自动更新</span></h2>
                <div class="btn c" @click="goPage(3)">
                    查询记录
                </div>
                <div class="item item1">
                    <div class="table">
                        <el-table
                            :data="rankBig"
                            style="width: 100%;"
                            border
                        >
                            <el-table-column
                                prop="contract"
                                label="合约代码"
                                align="center"
                            />
                            <el-table-column
                                prop="rank"
                                align="center"
                                label="Rank"
                            />
                            <el-table-column
                                prop="price"
                                align="center"
                                label="今日收盘价"
                            >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.price | money }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="size"
                                align="center"
                                label="交易单位"
                            />
                            <el-table-column
                                prop="num"
                                align="center"
                                label="最大开仓手数"
                            >
                                <template slot-scope="scope">
                                    <span>{{ parseInt(scope.row.num) }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-table
                            :data="rankSmall"
                            border
                            style="width: 100%"
                        >
                            <el-table-column
                                prop="contract"
                                label="合约代码"
                                align="center"
                            />
                            <el-table-column
                                prop="rank"
                                align="center"
                                label="Rank"
                            />
                            <el-table-column
                                prop="price"
                                align="center"
                                label="今日收盘价"
                            >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.price | money }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="size"
                                align="center"
                                label="交易单位"
                            />
                            <el-table-column
                                prop="num"
                                align="center"
                                label="最大开仓手数"
                            >
                                <template slot-scope="scope">
                                    <span>{{ parseInt(scope.row.num) }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <p style="position: relative;margin-top: 10px">
                        <b style="position: absolute;top:3px">?</b>
                        <strong class="one">
                            rank为正表示看多，值越大表示看多越强；rank为负表示看空，值越小表示看空越强；
                        </strong>
                        <strong class="one">
                            今日收盘价的定义：交易日下午未收盘之前为昨日收盘价，收盘后为今日收盘价
                        </strong>
                        <strong class="one">
                            交易单位：也就是说一手多少吨，一手多少kg等
                        </strong>
                        <strong class="one">
                            最大开仓手数=最大资产/(交易单位*今日收盘价)
                        </strong>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import {mul, div} from '@/utils/number.ts';

    @Component({
    })

    export default class extends Vue {
        pageData:any = {
            createTime: '', // 创建时间
            openTime: '', // 开启时间
            dealSignalSettingId: 0, // 多空设置id
            status: false, //  多空信号的状态 是否启用0未启用1已启用
            dealAmount: 0, // 最大资产
            dealRatio: 1, // 平衡系数
            oneFee: 1, // 单词查询
            mouthFee: 0, // 月卡k豆
            mouthDay: 0, // 月卡期限
            listObjectFir: []
        }

        rankBig:any[] = []; // rank为正
        rankSmall:any[] = []; // rank为负

        pickerOptions:any = {
            shortcuts: [{
                text: '今天',
                onClick(picker:any) {
                picker.$emit('pick', new Date());
            }
            }, {
            text: '昨天',
            onClick(picker:any) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
            }
            }, {
                text: '一周前',
                    onClick(picker:any) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                }
            }]
        };

        mounted() {
            this.getDetail();
        }

        async getDetail() {
            // 通过策略id取得查看的数据
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/dealSignal/getSignalMain', {}, {
                paramType: 'form'
            });

            if (resp?.code === '000000') {
                this.pageData.createTime = resp?.data?.dealSignalSetting?.createTime;
                this.pageData.openTime = resp?.data?.dealSignalSetting?.openTime;
                this.pageData.dealSignalSettingId = resp?.data?.dealSignalSetting?.dealSignalSettingId;
                this.pageData.status = resp?.data?.dealSignalSetting?.status === 1;
                this.pageData.dealAmount = resp?.data?.dealSignalSetting?.dealAmount / 10000;
                this.pageData.dealRatio = resp?.data?.dealSignalSetting?.dealRatio;
                this.pageData.mouthFee = resp?.data?.dealSignalSetting?.mouthFee;
                this.pageData.mouthDay = resp?.data?.dealSignalSetting?.mouthDay;
                this.pageData.oneFee = resp?.data?.dealSignalSetting?.oneFee;
                this.pageData.listObjectFir = resp?.data?.listObjectFir || [];
                if (this.pageData.listObjectFir.length > 0) {
                    this.pageData.listObjectFir.forEach((x:any) => {
                        x.price = x.price ? x.price : 1;
                        x.num = Number(div(resp?.data?.dealSignalSetting?.dealAmount, mul(x.price, x.size)));
                    });
                    this.rankBig = this.pageData.listObjectFir.filter((x:any) => x.rank >= 0).sort((a:any, b:any) => b.rank - a.rank);
                    this.rankSmall = this.pageData.listObjectFir.filter((x:any) => x.rank < 0).sort((a:any, b:any) => a.rank - b.rank);
                }
            } else {
                this.$showToast('请求失败');
            }
            this.$closeLoading();
        }

        goPage(t:number) {
            let path;
            switch (t) {
                case 1:
                    path = '/strategy_manage/multIspace/changeParameters';
                    break;
                case 2:
                    path = '/strategy_manage/multIspace/monthlyCardRecord';
                    break;
                case 3:
                    path = '/strategy_manage/multIspace/searchRecord';
                    break;
                default:
                    break;
            }
            this.$router.push({
                path
            });
        }

        async updateSignalSettingStatus() {
            // 通过策略id取得查看的数据
            this.$showLoading();
            const requestObj = {
                status: this.pageData.status ? 1 : 0
            };
            const [err, resp] = await this.$postAsync('/dealSignal/updateSignalSettingStatus', requestObj, {
                paramType: 'form'
            });

            if (resp?.code === '000000') {
                if (resp?.data?.status === 1) {
                    this.$message({
                        type: 'success',
                        message: '已开启'
                    });
                } else {
                    this.$message({
                        type: 'success',
                        message: '已关闭'
                    });
                }
            } else {
                this.$showToast('请求失败');
            }
            this.$closeLoading();
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-page-a{
        display: flex;
        width: 100%;
        padding: 30px 40px;
        background: #F2F2F6;
        flex-direction: column;
        position: relative;
        margin-top: 20px;
        border-radius: 8px;
        .btn{
            display: flex;
            width: 90px;
            height: 30px;
            position: absolute;
            border: 1px solid #0099FF;
            background: #fff;
            color: #999;
            right: 40px;
            top: 20px;
            font-size: 14px;
            cursor: pointer;
            border-radius: 8px;
            justify-content: center;
            align-items: center;
            &.b{
                border: 1px solid #0099FF;
                background: #fff;
                color: #0099FF;
            }
            &.c{
                border: 1px solid #FF0000;
                background: #fff;
                color: #FF0000;
            }

        }
        h2{

            display: flex;
            font-size: 24px;
            margin-left: -20px;
            width: calc(100% + 20px);
            margin-bottom: 20px;
            align-items: center;
            b{
                font-weight: normal;
                display: inline-block;
                margin:0 20px;
                width: 20px;
                height: 20px;
                background: #bbb;
                border-radius: 50%;
                text-align: center;
                line-height: 20px;
                color: #fff;
            }
            span{
                color: #666;
                font-size: 14px;
                font-weight: normal;
            }
        }
        .item{
            display: flex;
            width: 100%;
            margin-top: 20px;
            align-items: center;
            &.item1{
                align-items: normal;
                flex-direction: column;

            }
            &:nth-of-type(1){
                margin-top: 0;
            }
            span{
                width: 100px;
            }
            div{
                width: 180px;
                margin-right: 20px;
                &.table{
                    display: flex;
                    width: 100%;
                    margin: 10px 0;
                }
            }
            p{
                b{
                    font-weight: normal;
                    display: inline-block;
                    margin-right: 10px;
                    width: 20px;
                    height: 20px;
                    background: #bbb;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 20px;
                    color: #fff;
                }
                strong{
                    margin-left: 20px;
                    font-weight: normal;
                    &.one{
                        margin-left:30px;
                        display:inline-block;
                        width:100%;
                        margin-bottom: 10px;
                    }
                }
            }
        }
    }
</style>
