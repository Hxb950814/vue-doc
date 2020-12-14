<!-- 查看短信场景-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                查看短信场景
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item label="场景名称：" prop="name" label-width="120px">
                    <el-input
                        v-model.trim="editData.name"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入场景名称"
                        maxlength="20"
                        style="width:300px"
                    />
                </el-form-item>

                <el-form-item label="模板内容：" prop="content" label-width="120px">
                    <el-input
                        v-model="editData.content"
                        type="textarea"
                        rows="7"
                        maxlength="500"
                        style="max-width:500px"
                        placeholder="请输入模板内容"
                    />
                </el-form-item>
                <el-form-item label="状态：" prop="status" label-width="120px">
                    <el-radio-group v-model="editData.status">
                        <el-radio label="1">
                            启用
                        </el-radio>
                        <el-radio label="0">
                            禁用
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div class="form-submit-line" style="width: 680px">
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
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import commonTable from '@/mixins/commonTable';
    import * as validator from '@/utils/validate';

    let editDataSnapshot = '';
    @Component({
        components: {
        },
        mixins: [commonTable]
    })
    export default class extends Vue {
         id = '';
         editData: any = {
            name: '', // 场景名
            content: '', // 模板内容
            status: '1' // 状态
        };

         dataRule: any = {
            name: [{required: true, message: '请输入场景名称', trigger: 'blur'}],
            content: [
                {required: true, message: '请输入模板内容', trigger: 'blur'},
                {required: true, validator: validator.getValidateStringLength({minLength: 5}), trigger: 'blur'}
            ]
        };

        mounted() {
            if (!this.$route.query.id || this.$route.query.id === 'undefined') {
                this.$showToast('id不正确');
                return;
            }
            this.id = String(this.$route.query.id);

            // 保存未更改的快照, 用于对比数据是否发生更改
            this.getData();
        }

         async getData() {
            // 获得数据
            this.$showLoading();
            const [err, resp] = await this.$getAsync('/message/getMessageTemplateDetail', {
                id: this.id
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.editData.name = resp.data.title; // 联系方式
                this.editData.content = '' + resp.data.content; // 详情
                this.editData.status = resp.data.enable ? '1' : '0'; // 状态
            } else {
                this.$showToast(resp?.message || '数据获取失败');
            }

            // 保存未更改的快照, 用于对比数据是否发生更改
            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            }, 50);
        }

         clickClose() {
            const editDataNewSnapshot = JSON.stringify(this.editData);
            // console.log(1,editDataNewSnapshot,editDataSnapshot);
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
                    }).catch(() => {});
                }
            });
        }

         async doSave() {
            this.$showLoading();
            const data = {
                messageTemplateId: this.id,
                title: this.editData.name, // 场景名称
                content: this.editData.content, // 模板内容
                enable: this.editData.status // 是否启用
            };
            const [err, resp] = await this.$postAsync('/message/updateOrAddMessageTemplate', data, {
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
