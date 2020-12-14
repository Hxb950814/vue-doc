<template>
    <div>
        <div class="page-cap-title page-cap-titleH">
            创建任务
        </div>

        <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
            <el-form-item label="任务名称：" prop="taskName" label-width="120px">
                <el-input
                    v-model.trim="editData.taskName"
                    type="text"
                    autocomplete="off"
                    placeholder="请输入任务名称"
                    maxlength="12"
                    style="width:500px"
                />
            </el-form-item>
            <el-form-item label="任务类型：" prop="taskTypeId" label-width="120px">
                <el-select disabled v-model="editData.taskTypeId" style="margin-right: 15px;width:500px" placeholder="请选择课程任务类型">
                    <el-option v-for="(item, index) in taskTypeList" :key="index" :label="item.taskType" :value="item.taskTypeId" />
                </el-select>
            </el-form-item>
            <el-form-item label="奖励次数：" prop="rewardCount" label-width="120px">
                <el-input
                    disabled
                    v-model.trim="editData.rewardCount"
                    type="number"
                    autocomplete="off"
                    placeholder="请输入奖励次数"
                    style="width:500px"

                />
            </el-form-item>
            <el-form-item label="单次积分：" prop="oneScore" label-width="120px">
                <el-input
                    v-model.trim="editData.oneScore"
                    type="number"
                    autocomplete="off"
                    placeholder="请输入单次积分"
                    style="width:500px"
                    @input="editData.dayScore = editData.oneScore"
                />
            </el-form-item>
            <el-form-item label="单日上限：" prop="dayScore" label-width="120px">
                <el-input
                    disabled
                    v-model.trim="editData.dayScore"
                    type="number"
                    autocomplete="off"
                    placeholder="请输入单日上限"
                    style="width:500px"
                />
            </el-form-item>
            <el-form-item label="选择课程：" label-width="120px">
                <p style="color: #ff2f2f;margin: 15px 0">
                    仅展示上架状态的课程，单选
                </p>
                <el-table
                    :data="courseList"
                    border
                    style="width: 700px"
                >
                    <el-table-column
                        prop="courseTypeName"
                        label="课程类型"
                        align="center"
                    />
                    <el-table-column
                        prop="courseName"
                        align="center"
                        label="课程名称"
                    />
                    <el-table-column
                        prop="checked"
                        align="center"
                        width="80px"
                        label="选择"
                    >
                        <template slot-scope="scope">
                            <el-checkbox :disabled="scope.row.isSelect" v-model="scope.row.checked" @change="checkClick(scope.row)" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="任务描述：" prop="description" label-width="120px">
                <el-input
                    v-model.trim="editData.description"
                    type="textarea"
                    autocomplete="off"
                    rows="4"
                    placeholder="请输入任务描述"
                    style="width:500px"
                />
            </el-form-item>
            <el-form-item label="任务摘要：" prop="taskAbstract" label-width="120px">
                <el-input
                    v-model.trim="editData.taskAbstract"
                    type="textarea"
                    autocomplete="off"
                    rows="4"
                    placeholder="请输入任务摘要"
                    style="width:500px"
                />
            </el-form-item>

            <el-form-item v-viewer label="任务图标：" prop="taskImg" label-width="120px">
                <div class="dis-flex">
                    <my-image-upload :url.sync="editData.taskImg" class="small" />
                    <div style="padding: 80px 0 0 10px">
                        (100*100px)
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="展示顺序：" prop="sortby" label-width="120px">
                <el-input
                    v-model.trim="editData.sortby"
                    type="number"
                    autocomplete="off"
                    placeholder="请输入展示顺序"
                    style="width:500px"
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
</template>

<script lang="ts">
    import {Component, Mixins, Vue} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import * as validator from '@/utils/validate';
    import MyImageUpload from '@/components/MyImageUpload.vue';

    @Component({
        components: {
            MyImageUpload
        }
    })
    export default class extends Vue {
        editData: any = {
            taskTypeId: 9, // 课程任务id
            taskName: '', // 任务名称
            rewardCount: 1, // 奖励次数
            oneScore: '', // 单次积分
            dayScore: '', // 单日上限积分
            description: '', // 任务描述
            taskImg: '', // 任务图标
            taskAbstract: '', // 任务摘要
            sortby: '', // 展示顺序
            courseTypeId: 0 // 选择的课程id
        };

        taskTypeList:any[] = [
            {taskTypeId: 9, taskType: "课程"}
        ];

        courseList:any[] = []

        dataRule: any = {
            taskName: [{required: true, message: '请输入任务名称', trigger: 'blur'}],
            taskTypeId: [{required: true, message: '请选择任务', trigger: 'blur'}],
            rewardCount: [{required: true, message: '请输入奖励次数', trigger: 'blur'}],
            oneScore: [{required: true, message: '请输入单次积分', trigger: 'blur'}],
            dayScore: [{required: true, message: '请输入单日上限积分', trigger: 'blur'}],
            description: [{required: true, message: '请输入任务描述', trigger: 'blur'}],
            taskAbstract: [{required: true, message: '请输入任务摘要', trigger: 'blur'}],
            taskImg: [{required: true, message: '请上传任务图标', trigger: 'change'}],
            sortby: [
                {required: true, message: '请输入顺序', trigger: 'blur'},
                {required: true, validator: validator.getValidateInteger(), trigger: 'blur'},
                {
                    required: true,
                    validator: validator.getValidateSpecialNumber({number: '1', compareType: '>='}),
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
            // 选择课程的列表
            this.queryAllCourseList();
        }

        async queryAllCourseList() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/taskScore/queryAllCourseList', {});
            if (resp?.code === '000000') {
                const data = resp?.data;
                this.courseList = data;
                this.courseList.forEach((x:any) => {
                    x.checked = x.isSelect === 1 ? true : false;
                });
            }
            this.$closeLoading();
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
            if(this.editData.courseTypeId === 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择一门课程'
                });
                return false;
            }
            this.$showLoading();
            const data: any = {
                taskTypeId: this.editData.taskTypeId, // 课程任务id
                taskName: this.editData.taskName, // 任务名称
                rewardCount: this.editData.rewardCount, // 奖励次数
                oneScore: this.editData.oneScore, // 单次积分
                dayScore: this.editData.dayScore, // 单日上限积分
                description: this.editData.description, // 任务描述
                taskImg: this.editData.taskImg, // 任务图标
                taskAbstract: this.editData.taskAbstract, // 任务摘要
                courseTypeId: this.editData.courseTypeId,
                sortby: this.editData.sortby
            };
            this.$closeLoading();
            const [err, resp] = await this.$postAsync('/taskScore/addTaskSetting', data, {paramType: 'form'});
            if (resp?.code === '000000') {
                this.$showToast('添加成功');
                setTimeout(() => {
                    this.$router.back();
                }, 200);
            } else {
                this.$showToast(resp?.message || '添加失败');
            }
        }

        clickCancel() {
            this.$router.back();
        }

        checkClick(item:any) {
            this.courseList.forEach((x:any) => {
                if(x.isSelect !== 1) {
                    x.checked = false;
                } else {
                    x.checked = true;
                };
            });
            this.editData.courseTypeId = item.courseTypeId;
            item.checked = !item.checked;
            let index = this.courseList.indexOf(item);
            this.$set(this.courseList, index, item)
        }
    }
</script>

<style lang="scss" scoped>
    .page-cap-titleH{
        margin-bottom: 40px;
    }
    .el-form-item{
        margin-bottom: 20px;
    }
</style>
