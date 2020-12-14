<!-- 添加公告 -->
<template>
    <div>
        <div class="page-cap-title">
            添加公告
        </div>

        <div class="form-input-area">
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item label="公告标题：" prop="title" label-width="120px">
                    <el-input
                        v-model.trim="editData.title"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入公告标题"
                        maxlength="50"
                        style="width:400px"
                    />
                </el-form-item>
                <el-form-item label="公告详情：" prop="details" label-width="120px">
                    <my-custom-editor :content.sync="editData.details" :disabled="false" />
                </el-form-item>
                <div class="dis-flex">
                    <el-form-item label="发布时间：" prop="publishTimeStart" label-width="120px">
                        <el-date-picker
                            v-model="editData.publishTimeStart"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="请选择"
                            :picker-options="publishTimeOpt1"
                            style="width:185px"
                        />
                    </el-form-item>
                    <span class="connecting-line">-</span>
                    <el-form-item label="" prop="publishTimeEnd" label-width="0">
                        <el-date-picker
                            v-model="editData.publishTimeEnd"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="请选择"
                            :picker-options="publishTimeOpt2"
                            style="width:185px"
                        />
                    </el-form-item>
                </div>

                <el-form-item label="是否置顶：" prop="isTop" label-width="120px">
                    <el-radio-group v-model="editData.isTop">
                        <el-radio label="1">
                            是
                        </el-radio>
                        <el-radio label="0">
                            否
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="展示状态：" prop="status" label-width="120px">
                    <el-radio-group v-model="editData.status">
                        <el-radio label="1">
                            显示
                        </el-radio>
                        <el-radio label="0">
                            隐藏
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div style="width: 100%;text-align: center">
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
    import commonTable from '@/mixins/commonTable';
    import MyCustomEditor from '@/components/MyCustomEditor.vue';
    import {makeDatePickerRelationLimit} from '@/utils/helper';

    let editDataSnapshot = '';
    @Component({
        components: {MyCustomEditor},
        mixins: [commonTable]
    })
    export default class extends Vue {
         id = ''; // id
         editData: any = {
            title: '', // 标题
            details: '', // 详情
            status: '1', // 状态
            isTop: '0', // 是否置顶
            publishTimeStart: '', // 发布时间起始值
            publishTimeEnd: '' // 发布时间结束
        };

         dataRule: any = {
            title: [{required: true, message: '请输入公告标题', trigger: 'blur'}],
            details: [{required: true, message: '请输入公告详情', trigger: 'change'}],
            publishTimeStart: [{required: true, message: '请选择发布起始时间', trigger: 'blur'}],
            publishTimeEnd: [{required: true, message: '请选择发布结束时间', trigger: 'blur'}]
        };

         publishTimeOpt1: any = {};
         publishTimeOpt2: any = {};

        mounted() {
            this.searchDateTimeLimit();
            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            }, 50);
        }

         searchDateTimeLimit() {
            const limitFuns = makeDatePickerRelationLimit(this.editData, [
                'publishTimeStart', /* 第一个输入框 */
                'publishTimeEnd' /* 第二个输入框 */
            ]);

            this.publishTimeOpt1.disabledDate = limitFuns[0];
            this.publishTimeOpt2.disabledDate = limitFuns[1];
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
                title: this.editData.title, // 标题
                content: this.editData.details, // 详情
                publishTime: this.editData.publishTimeStart, // 发布时间
                endTime: this.editData.publishTimeEnd, // 发布时间截止
                display: this.editData.status, // 是否显示
                isTop: this.editData.isTop // 是否置顶
            };
            const [err, resp] = await this.$postAsync('/affiche/updateOrAddAffiche', data, {
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

         clickCancel() {
            const editDataNewSnapshot = JSON.stringify(this.editData);
            if (editDataSnapshot === '' || editDataNewSnapshot === editDataSnapshot) {
                this.$router.back();
                return;
            }
            this.$showMessageBox('内容未保存，是否关闭?').then(() => {
                this.$router.back();
            }).catch(() => {});
        }
    }
</script>
