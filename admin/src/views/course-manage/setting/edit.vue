<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                查看课程
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item label="课程类型" prop="courseTypeName" label-width="120px">
                    <el-input
                        v-model.trim="editData.courseTypeName"
                        disabled
                        type="text"
                        autocomplete="off"
                        placeholder="请输入名称"
                        maxlength="8"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="课程级别：" prop="courseLevel" label-width="120px">
                    <el-checkbox-group v-model="editData.courseLevel">
                        <el-checkbox label="0">
                            初级
                        </el-checkbox>
                        <el-checkbox label="1">
                            进阶
                        </el-checkbox>
                        <el-checkbox label="2">
                            小白
                        </el-checkbox>
                        <el-checkbox label="3">
                            其他
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="主页导航：" prop="isHomePage" label-width="120px">
                    <el-radio-group v-model="editData.isHomePage">
                        <el-radio label="0">
                            显示
                        </el-radio>
                        <el-radio label="1">
                            隐藏
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="求知导航：" prop="isSeekKnowledge" label-width="120px">
                    <el-radio-group v-model="editData.isSeekKnowledge">
                        <el-radio label="0">
                            显示
                        </el-radio>
                        <el-radio label="1">
                            隐藏
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="展示顺序：" prop="sort" label-width="120px">
                    <el-input
                        v-model.trim="editData.sort"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入顺序（1~99数字）"
                        maxlength="50"
                        style="width:300px"
                    />
                </el-form-item>
            </el-form>
            <div class="form-submit-line" style="width: 600px">
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
    import {Component, Vue} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import * as validator from '@/utils/validate';

    @Component({})
    export default class extends Vue {
        id:string = '';
        editData: any = {
            courseTypeName: '', // 课程类型
            courseLevel: ['0'], // 类型
            isHomePage: '0', // 主页导航
            isSeekKnowledge: '0', // 求知导航
            sort: '' // 展示顺序
        };

        dataRule: any = {
            courseLevel: [{required: true, message: '请选择显示渠道', trigger: 'change'}],
            sort: [
                {required: true, message: '请输入顺序', trigger: 'blur'},
                {required: true, validator: validator.getValidateInteger(), trigger: 'blur'},
                {
                    required: true,
                    validator: validator.getValidateSpecialNumber({number: '0', compareType: '>='}),
                    trigger: 'blur'
                },
                {
                    required: true,
                    validator: validator.getValidateSpecialNumber({number: '99', compareType: '<='}),
                    trigger: 'blur'
                }
            ]
        };

        mounted() {
            this.id = String(this.$route.query.id);
            this.getDetail();
        }

        async getDetail() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/course/queryCourseInfoById', {
                courseId: this.id
            }, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                const {data} = resp;
                if (!data) {
                    return;
                }
                this.editData.courseTypeName = data.courseTypeName;
                this.editData.courseLevel = (data.courseLevel || '').split(',') || [];
                this.editData.isHomePage = String(data.isHomePage);
                this.editData.isSeekKnowledge = String(data.isSeekKnowledge);
                this.editData.sort = data.sort;
            }
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
            const data: any = {
                courseId: this.id,
                courseTypeName: this.editData.courseTypeName,
                isHomePage: this.editData.isHomePage,
                isSeekKnowledge: this.editData.isSeekKnowledge,
                sort: this.editData.sort,
                courseLevel: this.editData.courseLevel.join(',')
            };
            this.$closeLoading();
            const [err, resp] = await this.$postAsync('/course/updateCourseInfoById', data, {paramType: 'form'});
            if (resp?.code === '000000') {
                this.$showToast('修改成功');
                setTimeout(() => {
                    this.$router.back();
                }, 200);
            } else {
                this.$showToast(resp?.message || '修改失败');
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
