<!-- 添加问题分类-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                添加问题分类
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item label="类型名称：" prop="name" label-width="120px">
                    <el-input
                        v-model.trim="editData.name"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入类型名称"
                        maxlength="10"
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
            <div style="width: 100%;text-align: center">
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

    let editDataSnapshot = '';
    @Component({
        components: {
        },
        mixins: [commonTable]
    })
    export default class extends Vue {
         editData: any = {
            name: '', // 名称
            status: '1' // 状态
        };

         dataRule: any = {
            name: [{required: true, message: '请输入类型名称', trigger: 'blur'}]
        };

        mounted() {
            // 保存未更改的快照, 用于对比数据是否发生更改
            editDataSnapshot = JSON.stringify(this.editData);
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
                deleted: this.editData.status === '1' ? '0' : '1', // 是否显示
                name: this.editData.name // 名称
            };
            const [err, resp] = await this.$postAsync('/contentCtrl/saveDictionary', data, {
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
