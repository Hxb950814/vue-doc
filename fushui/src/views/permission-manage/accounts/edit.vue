<!-- 查看账号-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                查看账号
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item label="系统账号：" prop="" label-width="120px">
                    <el-input
                        v-model.trim="editData.account"
                        type="text"
                        disabled
                        placeholder="请输入系统账号"
                        maxlength="10"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="操作人名称：" prop="name" label-width="120px">
                    <el-input
                        v-model.trim="editData.name"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入操作人名称"
                        maxlength="8"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="联系方式：" prop="phone" label-width="120px">
                    <el-input
                        v-model.trim="editData.phone"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入联系方式"
                        maxlength="11"
                        style="width:300px"
                    />
                </el-form-item>
                <!--                <el-form-item label="初始密码：" prop="password" label-width="120px">-->
                <!--                    <el-input type="text" v-model.trim="editData.password" placeholder="请输入初始密码"-->
                <!--                              maxlength="10" style="width:300px"/>-->
                <!--                </el-form-item>-->
            </el-form>
            <div class="form-submit-line" style="width: 500px;margin-top: 20px">
                <el-button @click="clickClose">
                    关闭
                </el-button>
                <el-button v-permission="'09010103'" type="primary" @click="clickSave">
                    保存
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import commonTable from '@/mixins/commonTable';
    import * as validator from '@/utils/validate';

    let editDataSnapshot = '';
    @Component({
        components: {},
        mixins: [commonTable]
    })
    export default class extends Vue {
        id = '';
        editData: any = {
            account: '', // 账号
            name: '', // 操作人名称
            phone: '', // 联系方式
            password: '' // 初始密码
        };

        dataRule: any = {
            name: [{required: true, message: '请输入操作人名称', trigger: 'blur'}],
            phone: [
                {required: true, message: '请输入联系方式', trigger: 'blur'},
                {required: true, validator: validator.getValidateMobile(), trigger: 'blur'}
            ],
            password: [
                {required: true, message: '请输入初始密码', trigger: 'blur'}
            ]
        };

        async mounted() {
            // 保存未更改的快照, 用于对比数据是否发生更改
            if (!this.$route.query.id || this.$route.query.id === 'undefined') {
                this.$showToast('id不正确');
                return;
            }
            this.id = String(this.$route.query.id);

            this.$showLoading();
            const [err, resp] = await this.$postAsync('/admin/findSupervisorId', {
                supervisorId: this.id
            }, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.editData.account = resp.data.name || '';
                this.editData.name = resp.data.name || '';
                this.editData.name = resp.data.realityName || '';
                this.editData.phone = resp.data.telephone || '';
            }
            // 保存未更改的快照, 用于对比数据是否发生更改
            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            }, 40);
        }

        clickClose() {
            const editDataNewSnapshot = JSON.stringify(this.editData);
            if (editDataSnapshot === '' || editDataNewSnapshot === editDataSnapshot) {
                this.$router.back();
                return;
            }
            this.$showMessageBox('内容未保存，是否关闭?').then(() => {
                this.$router.back();
            });
        }

        clickSave() {
            (this.$refs.dataForm as ElForm).validate((valid: boolean) => {
                if (valid) {
                    this.$showMessageBox('是否保存?').then(() => {
                        this.doSave();
                    });
                }
            });
        }

        async doSave() {
            this.$showLoading();
            const data = {
                supervisorId: this.id,
                realityName: this.editData.name,
                telephone: this.editData.phone
            };
            const [err, resp] = await this.$postAsync('/admin/updateAdmin', data, {
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
    }
</script>
