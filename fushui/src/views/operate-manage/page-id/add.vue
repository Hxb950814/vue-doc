<!-- 添加页面ID-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                添加页面ID
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item label="页面名称：" prop="name" label-width="120px">
                    <el-input
                        v-model.trim="editData.name"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入页面名称"
                        maxlength="12"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="页面ID：" prop="id" label-width="120px">
                    <el-input
                        v-model.trim="editData.id"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入页面ID"
                        maxlength="15"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="key名称：" prop="keyName" label-width="120px">
                    <el-input
                        v-model.trim="editData.keyName"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入key名称"
                        maxlength="12"
                        style="width:300px"
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
            <div class="form-submit-line" style="max-width: 450px">
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
    import {Component, Mixins, Vue, Watch} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import commonTable from '@/mixins/commonTable';
    import leaveCheck from '@/mixins/leaveCheck';

    @Component({
        components: {
        },
        mixins: [commonTable]
    })
    export default class extends Mixins(leaveCheck) {
        editData: any = {
            name: '', // 名称
            id: '', // id
            keyName: '', // key
            status: '1' // 状态
        };

        dataRule: any = {
            name: [{required: true, message: '请输入页面名称', trigger: 'blur'}],
            id: [{required: true, message: '请输入页面ID', trigger: 'blur'}]
            // keyName: [{required: true, message: '请输入key名称', trigger: 'blur'}]
        };

        async mounted() {
            this.setDataKeep(this.editData);
        }

        clickClose() {
            this.checkSaveDataBack(this.editData); // 检查合格再推出
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
                pageKey: this.editData.keyName,
                pageName: this.editData.name,
                pageValue: this.editData.id,
                display: this.editData.status === '1'
            };
            const [err, resp] = await this.$postAsync('/icon/savePage', data, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('添加成功');
                setTimeout(() => {
                    this.$router.back();
                }, 300);
            } else {
                this.$showToast(resp?.message || '添加失败');
            }
        }
    }
</script>
