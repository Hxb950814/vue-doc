<template>
    <div>
        <div class="page-cap-title">
            匹配组合
        </div>
        <div class="page-cap-content">
            <div class="hbb-page-top">
                <span>联系方式：{{ pageData.mobile }}</span>
                <span>期货账号：{{ pageData.futureAccount ? pageData.futureAccount : '-' }}</span>
                <span>查询时间：{{ pageData.createTime }}</span>
            </div>
            <!--      查询费用      -->
            <div v-for="(item,index) in dataList" :key="index" class="hbb-page-a">
                <h2>组合{{ item.title }}</h2>
                <div class="item">
                    <el-table
                        :data="item.data"
                        border
                        style="width: 100%"
                    >
                        <el-table-column
                            prop="date"
                            align="center"
                            label=""
                            width="80px"
                        >
                            <template slot-scope="scope">
                                <span>{{ scope.row.rank === 0 ? '看空' : '看多' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="code"
                            align="center"
                            label="合约代码"
                        />
                        <el-table-column
                            prop="comm"
                            align="center"
                            label="合约种类"
                        />
                        <el-table-column
                            prop="size"
                            align="center"
                            label="交易单位"
                        />
                        <el-table-column
                            prop="handCount"
                            align="center"
                            label="合约手数"
                        />
                        <el-table-column
                            align="center"
                            label="收盘价/元"
                        >
                            <template slot-scope="scope">
                                <span>{{ scope.row.price | money }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            label="资产价值/元"
                        >
                            <template slot-scope="scope">
                                <span>{{ scope.row.zcPrice | money }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="leverage"
                            align="center"
                            label="杠杆系数"
                        />
                        <el-table-column
                            align="center"
                            label="操作保证金/元"
                        >
                            <template slot-scope="scope">
                                <span>{{ scope.row.bzj | money }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="hbb-he">
                    合计<span>{{item.amount | money}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import {mul} from '@/utils/number.ts';
    @Component({
    })
    export default class extends Vue {
        id:string = '';
        dealSignalQueryDetail:any[] = []; // 数据源的数组
        dataList:any[] = []; // 用于展示的数组

        pageData:any = {
            futureAccount: '',
            mobile: '',
            createTime: ''
        }

        mounted() {
            this.id = String(this.$route.query.id);
            this.getDetail();
        }

        async getDetail() {
            // 通过策略id取得查看的数据
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/dealSignal/queryDealSignalDetail', {dealSignalQueryId: this.id}, {
                paramType: 'form'
            });
            if (resp?.code === '000000') {
                this.pageData.createTime = resp?.data?.dealSignalQuery.createTime;
                this.pageData.futureAccount = resp?.data?.dealSignalQuery.futureAccount;
                this.pageData.mobile = resp?.data?.dealSignalQuery.mobile;
                this.dealSignalQueryDetail = resp?.data?.dealSignalQueryDetail || [];
                if (this.dealSignalQueryDetail.length > 0) {
                    const map:any[] = [];
                    let middleArr:any[] = [];
                    this.dealSignalQueryDetail.forEach((x:any, index:number) => {
                        x.zcPrice = mul(mul(x.handCount, x.price), x.size);
                        map.push(x.tjorder);
                        middleArr = [...new Set(map)].sort();
                    });
                    middleArr.map((y:any) => {
                        const arr = this.dealSignalQueryDetail.filter((x:any) => x.tjorder === y);
                        let amount = 0;
                        arr.forEach((j:any) => {
                            amount += j.bzj;
                        });
                        this.dataList.push({
                            title: y + 1,
                            data: arr,
                            amount
                        });
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
    .hbb-page-top{
        display: flex;
        width: 100%;
        margin: 20px 0;
        span{
            margin-right: 40px;
            color: #666;
            font-size: 14px;
        }
    }
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
        .hbb-he{
            display: flex;
            width: 100%;
            justify-content: flex-end;
            margin-top: 20px;
            padding-right: 40px;
            font-size: 14px;
            span{
                margin-left: 30px;
                color: #ff2f2f;
                font-weight: bold;
            }
        }
    }
</style>
