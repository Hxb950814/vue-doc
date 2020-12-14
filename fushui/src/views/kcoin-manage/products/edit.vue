<!--查看K豆产品-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                查看K豆产品
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item label="产品名称：" prop="name" label-width="120px">
                    <el-input
                        v-model.trim="editData.name"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入产品名称"
                        maxlength="10"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="产品价格：" prop="price" label-width="120px">
                    <el-input
                        v-model.trim="editData.price"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入产品价格"
                        maxlength="10"
                        style="width:280px;margin-right: 5px"
                    />
                    元
                </el-form-item>
                <el-form-item label="K豆数量：" prop="number" label-width="120px">
                    <el-input
                        v-model.trim="editData.number"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入K豆数量"
                        maxlength="10"
                        style="width:280px;margin-right: 5px"
                    />
                    个
                </el-form-item>
                <div class="dis-flex">
                    <el-form-item label="购买次数：" prop="" label-width="120px">
                        {{ editData.time }}次
                    </el-form-item>
                    <el-form-item label="销售金额：" prop="" label-width="120px">
                        {{ editData.amount | money }}元
                    </el-form-item>
                </div>
                <el-form-item label="状态：" prop="status" label-width="120px">
                    <el-radio-group v-model="editData.status">
                        <el-radio label="1">
                            已上架
                        </el-radio>
                        <el-radio label="0">
                            已下架
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div class="form-submit-line" style="max-width:500px">
                <el-button @click="clickCancel">
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
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import * as validator from '@/utils/validate';

    let editDataSnapshot = '';
    @Component({
        components: {},
        mixins: []
    })
    export default class extends Vue {
        id = '';
        editData: any = {
            name: '', // 名称
            price: '', // 价格
            number: '', // k豆价格
            status: '', // 状态
            amount: '-',
            time: '-'
        };

        dataRule: any = {
            name: [{required: true, message: '请输入产品名称', trigger: 'blur'}],
            price: [
                {required: true, message: '请输入产品价格', trigger: 'blur'},
                {
                    required: true,
                    validator: validator.getValidateFloat({allowNegative: false, percision: 2}),
                    trigger: 'blur'
                }
            ],
            number: [
                {required: true, message: '请输入K豆价格', trigger: 'blur'},
                {required: true, validator: validator.getValidateInteger(), trigger: 'blur'}
            ]
        };

        mounted() {
            if (!this.$route.query.id || this.$route.query.id === 'undefined') {
                this.$showToast('id不正确');
                return;
            }
            this.id = String(this.$route.query.id);
            this.getData();
        }

        async getData() {
            this.$showLoading();
            const data = {
                productId: this.id // id
            };
            const [err, resp] = await this.$postAsync('/beanProductCtrl/findBeanProductById', data, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.editData.name = resp.data.title;
                this.editData.price = resp.data.price || '';
                this.editData.number = resp.data.number || '';
                this.editData.status = resp.data.putaway ? '1' : '0';
                this.editData.amount = resp.data.amount;
                this.editData.time = resp.data.time;
            }

            // 保存未更改的快照, 用于对比数据是否发生更改
            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            }, 50);
        }

        clickSave() {
            (this.$refs.dataForm as ElForm).validate((valid: boolean) => {
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
                productId: this.id,
                title: this.editData.name, // 产品名称
                price: this.editData.price, // 产品价格
                number: this.editData.number, // k豆数量
                putaway: this.editData.status === '1' ? 1 : 0 // 1=上架  0=下架
            };
            const [err, resp] = await this.$postAsync('/beanProductCtrl/saveBeanProduct', data, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('修改成功');
                setTimeout(() => {
                    this.$router.back();
                }, 300);
            } else {
                this.$showToast(resp?.message || '修改失败');
            }
        }

        clickCancel() {
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
    }
</script>
