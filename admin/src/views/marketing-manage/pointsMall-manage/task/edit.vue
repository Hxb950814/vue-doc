<template>
    <div>
        <div class="page-cap-title page-cap-titleH">
            查看任务
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
                <template v-if="editData.taskTypeId === 6">
                    <el-input
                        disabled
                        v-model.trim="editData.rewardCount"
                        type="number"
                        autocomplete="off"
                        placeholder="请输入奖励次数"
                        style="width:500px"

                    />
                </template>
                <template v-else>
                    <el-input
                        v-model.trim="editData.rewardCount"
                        type="number"
                        autocomplete="off"
                        placeholder="请输入奖励次数"
                        style="width:500px"

                    />
                </template>
            </el-form-item>
            <el-form-item label="单次积分：" prop="oneScore" label-width="120px">
                <template v-if="editData.taskTypeId === 5">
                    <el-input
                        disabled
                        v-model.trim="editData.oneScore"
                        type="number"
                        autocomplete="off"
                        placeholder="请输入单次积分"
                        style="width:500px"
                        @input="editData.dayScore = editData.oneScore"
                    />
                </template>
                <template v-else>
                    <el-input
                        v-model.trim="editData.oneScore"
                        type="number"
                        autocomplete="off"
                        placeholder="请输入单次积分"
                        style="width:500px"
                        @input="inputChange"
                    />
                </template>
            </el-form-item>
            <el-form-item label="单日上限：" prop="dayScore" label-width="120px">
                <template v-if="editData.taskTypeId === 6">
                    <el-input
                        disabled
                        v-model.trim="editData.dayScore"
                        type="number"
                        autocomplete="off"
                        placeholder="请输入单日上限"
                        style="width:500px"
                    />
                </template>
                <template  v-else>
                    <el-input
                        v-model.trim="editData.dayScore"
                        type="number"
                        autocomplete="off"
                        placeholder="请输入单日上限"
                        style="width:500px"
                    />
                </template>

            </el-form-item>
            <template v-if="editData.taskTypeId === 9">
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
                                <el-checkbox disabled v-model="scope.row.checked" @change="checkClick(scope.row)" />
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </template>
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
    import {div} from "@/utils/number";

    @Component({
        components: {
            MyImageUpload
        }
    })
    export default class extends Vue {
        id = '';
        editData: any = {
            taskTypeId: '', // 课程任务id
            taskName: '', // 任务名称
            rewardCount: '', // 奖励次数
            oneScore: '', // 单次积分
            dayScore: '', // 单日上限积分
            description: '', // 任务描述
            taskImg: '', // 任务图标
            taskAbstract: '', // 任务摘要
            sortby: '', // 展示顺序
            courseTypeName: '',
            courseTypeId: 0 // 选择的课程id
        };

        taskTypeList:any[] = [
            {taskTypeId: 9, taskType: "课程"},
            {taskTypeId: 6, taskType: "手机号"},
            {taskTypeId: 8, taskType: "阅读"},
            {taskTypeId: 7, taskType: "收藏"},
            {taskTypeId: 10, taskType: "听书"},
            {taskTypeId: 5, taskType: "邀请"},
            {taskTypeId: 12, taskType: "打卡"}
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
            this.id = String(this.$route.query.id);
            this.getDetail();
        }

        async getDetail() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/taskScore/getTaskSettingDetail', {taskSettingId: this.id});
            if (resp?.code === '000000') {
                const data = resp?.data;
                this.courseList = data.list || [];
                this.courseList.forEach((x:any) => {
                    x.checked = x.isSelect === 1 ? true : false;
                });
                this.editData.taskTypeId = data.taskSetting.taskTypeId;
                this.editData.taskName = data.taskSetting.taskName;
                this.editData.rewardCount = data.taskSetting.rewardCount;
                this.editData.oneScore = data.taskSetting.oneScore;
                this.editData.dayScore = data.taskSetting.dayScore;
                this.editData.description = data.taskSetting.description;
                this.editData.taskImg = data.taskSetting.taskImg;
                this.editData.courseTypeName = data.taskSetting.courseTypeName;
                this.editData.taskAbstract = data.taskSetting.taskAbstract;
                this.editData.sortby = data.taskSetting.sortby;

            }
            this.$closeLoading();
        }

        inputChange() {
            if(this.editData.taskTypeId === 9 ||  this.editData.taskTypeId === 6) {
                this.editData.dayScore = this.editData.oneScore;
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
            if(this.editData.taskTypeId !== 6) {
                let flag = Number.isInteger(div(this.editData.dayScore,this.editData.oneScore));
                if(!flag) {
                    this.$showToast('单日积分上限为单次积分上限的整数倍');
                    return false;
                }
            }
            this.$showLoading();
            const data: any = {
                taskSettingId: this.id,
                taskTypeId: this.editData.taskTypeId, // 课程任务id
                taskName: this.editData.taskName, // 任务名称
                rewardCount: this.editData.rewardCount, // 奖励次数
                oneScore: this.editData.oneScore, // 单次积分
                dayScore: this.editData.dayScore, // 单日上限积分
                description: this.editData.description, // 任务描述
                taskImg: this.editData.taskImg, // 任务图标
                taskAbstract: this.editData.taskAbstract, // 任务摘要
                courseTypeId: this.editData.courseTypeId,
                courseTypeName: this.editData.courseTypeName,
                sortby: this.editData.sortby
            };
            this.$closeLoading();
            const [err, resp] = await this.$postAsync('/taskScore/updateTaskSetting', data, {paramType: 'form'});
            if (resp?.code === '000000') {
                this.$showToast('修改成功');
                setTimeout(() => {
                    this.$router.back();
                }, 200);
            } else {
                this.$showToast(resp?.message || '修改失败');
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
