<!-- 查看问题分类 -->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                查看问题分类
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
                            显示
                        </el-radio>
                        <el-radio label="0">
                            隐藏
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="展示顺序：" prop="order" label-width="120px">
                    <el-input
                        v-model.trim="editData.order"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入icon顺序（1~99数字）"
                        maxlength="50"
                        style="width:300px"
                    />
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
        id = ''; // id
        editData: any = {
            name: '', // 名称
            status: '', // 状态
            order: '' // 顺序
        };

        dataRule: any = {
            name: [{required: true, message: '请输入类型名称', trigger: 'blur'}],
            order: [{required: true, message: '请输入展示顺序', trigger: 'blur'}]
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
            // 获得数据
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/question/queryQuestionTypeById', {
                questionTypeId: this.id
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.editData.name = resp.data.typeName; // 类型名称
                this.editData.status = resp.data.display ? '1' : '0'; // 状态 0 = 可用，1 = 禁用
                this.editData.order = resp.data.sort; // 顺序
            } else {
                this.$showToast(resp?.message || '数据获取失败');
            }
            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            }, 50);
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
                questionTypeId: this.id,
                display: this.editData.status === '1' ? '1' : '0', // 是否显示
                typeName: this.editData.name, // 名称
                sort: this.editData.order
            };
            const [err, resp] = await this.$postAsync('/question/addOrUpdateQuestionType', data, {
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
