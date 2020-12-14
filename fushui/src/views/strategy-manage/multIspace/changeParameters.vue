<template>
    <div>
        <div class="page-cap-title">
            修改参数
        </div>
        <div class="page-cap-content">
            <!--      修改参数      -->
            <div class="hbb-page-a">
                <div class="item">
                    <span>最大资产</span>
                    <div>
                        <el-input v-model="pageData.dealAmount" placeholder="请输入内容" @input="inputCheck($event,1, {}, 1)">
                            <i slot="suffix" class="el-input__icon" style="font-style: normal">万</i>
                        </el-input>
                    </div>
                    <p><b>?</b>输入的资产为1-200之间的正整数</p>
                </div>
                <div class="item">
                    <span>平衡系数</span>
                    <div>
                        <el-input v-model.trim="pageData.dealRatio" type="number" placeholder="请输入内容" @input="inputCheck($event,2, {}, 2)" />
                    </div>
                    <p><b>?</b>输入的系统为0-1之间，不能为0</p>
                </div>
            </div>
            <!--      查询费用      -->
            <div class="hbb-page-a">
                <h2>查询费用</h2>
                <div class="item">
                    <span>单词查询</span>
                    <div>
                        <el-input v-model="pageData.oneFee" placeholder="请输入内容" @input="inputCheck($event,3, {}, 1)" />
                    </div>
                    <p>K豆</p>
                </div>
                <div class="item">
                    <span>多空月卡</span>
                    <div>
                        <el-input v-model="pageData.mouthFee" placeholder="请输入内容" @input="inputCheck($event,4, {}, 1)" />
                    </div>
                    <p>K豆 <strong>有效天数<el-input v-model="pageData.mouthDay" style="margin: 0 10px" placeholder="请输入内容" @input="inputCheck($event,5, {}, 1)" />天</strong></p>
                </div>
                <div class="item">
                    <p><b>?</b>有效天数是自用户购买包月套餐当天开始计算，后推30天；修改前购买的用户不受修改后的影响</p>
                </div>
            </div>
        </div>
        <div class="hbb-save-btn">
            <el-button type="primary" @click="doSave">
                保存
            </el-button>
        </div>
    </div>
</template>
<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';
    import {integer} from '@/utils';

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
            } else {
                this.$showToast('请求失败');
            }
            this.$closeLoading();
        }

        inputCheck(v:any, type:number, item:any, mode:number) {
            // 如果输入框是百分比的话要进行限制不可超过100 否则不做限制
            // type:0 止盈止损 type：1 服务费率 type:2 资金上限 type: 3 违约比例 4：k豆数量
            // mode:1 只能输入整数 2：保留小数点后面2位 3：保留小数点后面1位
            // integer 判断/* 只能输入正整数 or 保留小数点后2位 or 保留小数点后1位 */
            v = integer(v, mode);
            if (type === 1) {
                if (Number(v) >= 200) {
                    v = 200;
                }
                if (Number(v) <= 0) {
                    v = 1;
                }
            }
            if (type === 2) {
                if (Number(v) > 1) {
                    v = 1;
                }
                if (Number(v) <= 0) {
                    v = 0;
                }
            }
            switch (type) {
                case 1:
                    this.pageData.dealAmount = v;
                    break;
                case 2:
                    this.pageData.dealRatio = v;
                    break;
                case 3:
                    this.pageData.oneFee = v;
                    break;
                case 4:
                    this.pageData.mouthFee = v;
                    break;
                case 5:
                    this.pageData.mouthDay = v;
                    break;
                default:
                    break;
            }
        }

        async doSave() {
            const requestObj = {
                dealAmount: this.pageData.dealAmount * 10000,
                dealRatio: this.pageData.dealRatio,
                mouthDay: this.pageData.mouthDay,
                mouthFee: this.pageData.mouthFee,
                oneFee: this.pageData.oneFee
            };
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/dealSignal/updateSignalSetting', requestObj, {
                paramType: 'form'
            });

            if (resp?.code === '000000') {
                this.$message({
                    type: 'success',
                    message: '修改成功'
                });
                setTimeout(() => {
                    this.$router.back();
                }, 2000);
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
    .hbb-save-btn{
        display: flex;
        width: 100%;
        margin-top: 40px;
        justify-content: center;
    }
</style>
