<!--查看K豆产品-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                查看K豆产品
            </div>
            <el-form
                ref="dataForm"
                class="form-data form-style"
                label-position="left"
                :model="editData"
                :rules="dataRule"
                style="padding-left: 50px"
            >
                <el-form-item label="客户名称：" prop="" label-width="120px">
                    {{ editData.name }}
                </el-form-item>
                <el-form-item label="联系方式：" prop="" label-width="120px">
                    {{ editData.phone }}
                </el-form-item>
                <el-form-item label="购买产品：" prop="" label-width="120px">
                    {{ editData.number }}K豆
                </el-form-item>
                <el-form-item label="交易时间：" prop="" label-width="120px">
                    {{ editData.time }}
                </el-form-item>
                <el-form-item label="支付金额：" prop="" label-width="120px">
                    {{ editData.amount | money }}元
                </el-form-item>
                <el-form-item label="支付通道：" prop="" label-width="120px">
                    {{ editData.channel }}
                </el-form-item>
                <el-form-item label="商户号：" prop="" label-width="120px">
                    {{ editData.storeCode }}
                </el-form-item>
                <el-form-item label="当前状态：" prop="" label-width="120px">
                    {{ editData.statusName }}
                </el-form-item>
                <el-form-item label="返回日志：" prop="status" label-width="120px">
                    <div class="log-content">
                        {{ editData.log || '无' }}
                    </div>
                </el-form-item>
            </el-form>
            <div class="form-submit-line" style="max-width:700px">
                <el-button @click="clickCancel">
                    关闭
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';

    const editDataSnapshot = '';
    @Component({
        components: {},
        mixins: []
    })
    export default class extends Vue {
        id = '';
        editData: any = {
            name: '', // 名称
            phone: '', // 联系方式
            number: '', // 购买产品数量
            time: '', // 交易时间
            channel: '', // 支付通道
            storeCode: '', // 商户号
            amount: '', // 支付金额
            log: '', // 返回日志
            status: '', // 状态
            statusName: '' // 状态名
        };

        dataRule: any = {};
        statusList: any = [];

        async mounted() {
            if (!this.$route.query.id || this.$route.query.id === 'undefined') {
                this.$showToast('id不正确');
                return;
            }
            this.id = String(this.$route.query.id);
            this.$showLoading();
            await this.getTagsListData();
            await this.getData();
            this.$closeLoading();
        }

        async getData() {
            const data = {
                orderId: this.id // id
            };
            const [err, resp] = await this.$postAsync('/beanOrderCtrl/findBeanOrderById', data, {
                paramType: 'form'
            });

            if (resp?.code === '000000') {
                const data = resp.data;

                const find = this.statusList.find((item: any) => {
                    return item.value === String(data.status);
                });
                this.editData.name = data.userName || '-';
                this.editData.phone = data.mobile;
                this.editData.number = data.count || '';
                this.editData.statusName = find?.name || '--';
                this.editData.amount = resp.data.amount;
                this.editData.time = data.createTime;
                this.editData.channel = data.passagewayName || '-';
                this.editData.storeCode = data.orderNumber || '-';
                this.editData.log = data.logContent;
            }
        }

        async getTagsListData() {
            const [err, resp] = await this.$postAsync('/dictionaryCtrl/findDictionaryByCode', {
                code: 'status'
            }, {
                paramType: 'form'
            });
            if (resp?.code === '000000') {
                this.statusList = (resp?.data || []).map((item: any) => ({
                    name: String(item.name),
                    value: String(item.value)
                }));
            }
        }

        clickCancel() {
            this.$router.back();
        }
    }
</script>

<style lang="scss" scoped>
    .log-content {
        border: 1px solid #eaeaea;
        border-radius: 5px;
        padding: 10px;
        min-height: 144px;
        max-width: 550px;
    }

    .form-input-area .el-form-item {
        margin-bottom: 10px;
    }
</style>
