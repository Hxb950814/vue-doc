<!-- 查看银行 -->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                查看银行
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule" :disabled="!canEdit">
                <el-form-item label="银行名称：" prop="bankName" label-width="120px">
                    <el-input
                        v-model.trim="editData.bankName"
                        type="text"
                        placeholder="请输入银行名称"
                        clearable
                        maxlength="20"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="Bank ID：" prop="bankShortName" label-width="120px">
                    <el-input
                        v-model.trim="editData.bankShortName"
                        type="text"
                        placeholder="请输入BankID"
                        clearable
                        maxlength="15"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item v-viewer label="银行图标：" prop="bankImage" label-width="120px">
                    <my-image-upload :url.sync="editData.bankImage" :disabled="!canEdit" />
                </el-form-item>
                <el-form-item label="查询条件：" prop="queryCondition" label-width="120px">
                    <el-select
                        v-model.trim="editData.queryCondition"
                        placeholder="请选择"
                        clearable
                        maxlength="20"
                        style="width:300px"
                    >
                        <el-option value="1" label="资金密码" />
                        <el-option value="2" label="银行密码" />
                        <el-option value="3" label="资金+银行（密码）" />
                    </el-select>
                </el-form-item>
                <el-form-item label="入金条件：" prop="inCondition" label-width="120px">
                    <el-select
                        v-model.trim="editData.inCondition"
                        placeholder="请选择"
                        clearable
                        maxlength="20"
                        style="width:300px"
                    >
                        <el-option value="1" label="资金密码" />
                        <el-option value="2" label="银行密码" />
                        <el-option value="3" label="资金+银行（密码）" />
                    </el-select>
                </el-form-item>
                <el-form-item label="出金条件：" prop="outCondition" label-width="120px">
                    <el-select
                        v-model.trim="editData.outCondition"
                        placeholder="请选择"
                        clearable
                        maxlength="20"
                        style="width:300px"
                    >
                        <el-option value="1" label="资金密码" />
                        <el-option value="2" label="银行密码" />
                        <el-option value="3" label="资金+银行（密码）" />
                    </el-select>
                </el-form-item>
                <el-form-item label="当前状态：" prop="status" label-width="120px">
                    <el-radio-group v-model="editData.status">
                        <el-radio label="0">
                            正常
                        </el-radio>
                        <el-radio label="1">
                            维护
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="移动端链接：" prop="link1" label-width="120px">
                    <el-input
                        v-model.trim="editData.link1"
                        type="text"
                        placeholder="请输入移动端链接介绍银期开通流程"
                        clearable
                        maxlength="200"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="电脑端链接：" prop="link2" label-width="120px">
                    <el-input
                        v-model.trim="editData.link2"
                        type="text"
                        placeholder="请输入电脑端链接介绍银期开通流程"
                        clearable
                        maxlength="200"
                        style="width:300px"
                    />
                </el-form-item>
            </el-form>
            <div class="form-submit-line" style="width: 500px;margin-top: 20px">
                <el-button @click="clickClose">
                    关闭
                </el-button>
                <el-button v-if="!canEdit" v-permission="'05070101'" type="primary" @click="clickSave">
                    编辑
                </el-button>
                <el-button v-if="canEdit" v-permission="'05070101'" type="primary" @click="clickSave">
                    保存
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import MyImageUpload from '@/components/MyImageUpload.vue';

    let editDataSnapshot = '';
    @Component({
        components: {MyImageUpload},
        mixins: []
    })
    export default class extends Vue {
        canEdit = false;
        id = '';
        editData: any = {
            bankName: '', // 银行公司
            bankShortName: '', // 银行id
            bankImage: '', // 图片
            queryCondition: '', // 查询条件
            inCondition: '', // 入金条件
            outCondition: '', // 出金条件
            status: '0',
            link1: '', // link1
            link2: '' // link2
        };

        dataRule: any = {
            bankName: [{required: true, message: '请输入银行名称', trigger: 'blur'}],
            bankShortName: [{required: true, message: '请输入BankID', trigger: 'blur'}],
            bankImage: [{required: true, message: '请上传图片', trigger: 'change'}],
            queryCondition: [{required: true, message: '请选择查询条件', trigger: 'change'}],
            inCondition: [{required: true, message: '请选择入金条件', trigger: 'change'}],
            outCondition: [{required: true, message: '请选择出金条件', trigger: 'change'}]
        };

        async mounted() {
            // 保存未更改的快照, 用于对比数据是否发生更改
            if (!this.$route.query.id || this.$route.query.id === 'undefined') {
                this.$showToast('id不正确');
                return;
            }
            this.id = String(this.$route.query.id);
            this.getData();
        }

        async getData() {
            const [_, resp] = await this.$postAsync('/bank/queryBankInfo', {
                bankId: this.id
            });
            if (resp?.code === '000000') {
                this.editData.bankName = resp.data.bankName; // 银行公司
                this.editData.bankShortName = resp.data.bankShortName; // 银行id
                this.editData.bankImage = resp.data.bankPictureUrl; // 图片
                this.editData.queryCondition = resp.data.queryCondition + ''; // 查询条件
                this.editData.inCondition = resp.data.inGoldCondition + ''; // 入金条件
                this.editData.outCondition = resp.data.outGoldCondition + ''; // 出金条件
                this.editData.status = resp.data.status + '';
                this.editData.link1 = resp.data.mobileUrl; // link1
                this.editData.link2 = resp.data.pcUrl; // link2
            }

            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            });
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
            if (!this.canEdit) {
                this.canEdit = true;
                return;
            }
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
                bankId: this.id,
                bankName: this.editData.bankName, // 银行公司
                bankShortName: this.editData.bankShortName, // 银行id
                bankPictureUrl: this.editData.bankImage, // 银期转账
                queryCondition: this.editData.queryCondition, // 银期转账
                inGoldCondition: this.editData.inCondition, // 银期转账
                outGoldCondition: this.editData.outCondition, // 银期转账
                status: this.editData.status,
                mobileUrl: this.editData.link1, // link1
                pcUrl: this.editData.link2 // link2
            };
            const [err, resp] = await this.$postAsync('/bank/addOrUpdateBankInfo', data);
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
    }
</script>
