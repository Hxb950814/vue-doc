<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                会员管控
            </div>
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                style="width: 600px;margin-left:100px"
                :rules="rules"
                label-width="120px"
                class="demo-ruleForm"
            >
                <el-form-item label="管控类型" prop="controlType">
                    <div style="width: 100%;position: relative">
                        <el-select v-model="ruleForm.controlType" style="margin-right: 15px;width: 80%" placeholder="请选择管控类型">
                            <el-option v-for="(item,index) in controlList" :key="index" :label="item.title" :value="item.id" />
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="学员查询" prop="studentNo">
                    <div>
                        <el-input v-model="ruleForm.studentNo" style="width: 300px;margin-right: 20px" placeholder="输入学号查询" />
                        <el-button type="primary" @click="queryStudentNo">
                            查询
                        </el-button>
                    </div>
                    <template v-if="studentData">
                        <div class="hbb-table-content">
                            <span>会员学号: <b>{{ studentData.studentNo }}</b></span>
                            <span>联系方式:<b>{{ studentData.mobile }}</b></span>
                            <span>账号状态:<b>{{ ['正常', '锁定', '注销'][studentData.status] }}</b></span>
                            <span>职业认证:<b>{{ ['无', '班主任', '律师'][studentData.workType] }}</b></span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="hbb-table-content" style="height: 100px;justify-content:center;align-items: center;display: flex">
                            暂无数据
                        </div>
                    </template>
                </el-form-item>
                <template v-if="ruleForm.controlType === '1'">
                    <el-form-item label="职业类型" prop="workType">
                        <div style="width: 100%;position: relative">
                            <el-select v-model="ruleForm.workType" style="margin-right: 15px;width: 80%" placeholder="请选择管控类型">
                                <el-option label="无" value="0" />
                                <el-option label="班主任" value="1" />
                                <el-option label="律师" value="2" />
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="工作单位">
                        <div>
                            <el-input v-model="ruleForm.work" style="width:80%;margin-right: 20px" placeholder="请输入工作单位" />
                        </div>
                    </el-form-item>
                    <el-form-item label="单位介绍">
                        <div>
                            <el-input v-model="ruleForm.simplyIntroduce" type="textarea" rows="4" style="width:80%;margin-right: 20px" placeholder="请输入工作单位" />
                        </div>
                    </el-form-item>
                    <el-form-item label="微信账号">
                        <div>
                            <el-input v-model="ruleForm.wechatNo" style="width:80%;margin-right: 20px" placeholder="请输入微信账号" />
                        </div>
                    </el-form-item>
                    <el-form-item v-viewer label="微信二维码" label-width="120px">
                        <div class="dis-flex">
                            <my-image-upload :url.sync="ruleForm.wechatCode" class="small" />
                            <div style="padding: 80px 0 0 10px">
                                (100*100px)
                            </div>
                        </div>
                    </el-form-item>
                </template>
                <template v-if="ruleForm.controlType === '2'">
                    <el-form-item label="操作类型：" prop="status" label-width="120px">
                        <el-radio-group v-model="ruleForm.status">
                            <el-radio v-if="studentData.status === 0" label="1" disabled>
                                锁定
                            </el-radio>
                            <el-radio v-if="studentData.status === 1" label="0" disabled>
                                解锁
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button type="primary" @click="saveClick('ruleForm')">
                        确认
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import MyImageUpload from '@/components/MyImageUpload.vue';
    @Component({
        components: {
            MyImageUpload
        }
    })
    export default class extends Vue {
        ruleForm:any= {
            controlType: '1', // 会员管控类型
            studentNo: '', // 学号
            workType: '0', // 职业类型0=无；1=班主任；2=律师
            work: '', // 工作单位
            simplyIntroduce: '', // 简单介绍
            wechatNo: '', // 微信账号
            wechatCode: '', // 微信二维码
            userId: 0
        };

        controlList:any[] = [
            {id: '1', title: '职业认证'},
            {id: '2', title: '限制登录'}
        ]; // 管控类型

        studentData= '' // 查询的学员

        rules:any= {
            controlType: [
                { required: true, message: '请输入活动名称', trigger: 'blur' }
            ],
            studentNo: [
                { required: true, message: '请输入学号查询', trigger: 'change' }
            ],
            workType: [
                { required: true, message: '请选择职业类型', trigger: 'change' }
            ]
        }

        async queryStudentNo() {
            // 根据学号获取用户
                this.$showLoading();
                const [err, resp] = await this.$postAsync('/user/selectByStudentNo', {
                    studentNo: this.ruleForm.studentNo
                });

                this.$closeLoading();
                if (resp?.code === '000000') {
                    this.studentData = resp?.data;
                    this.ruleForm.userId = resp?.data?.userId;
                } else {
                    this.$showToast(resp?.message || '添加失败');
                }
        }

        saveClick(formName:any) {
            (this.$refs[formName] as any).validate((valid:any) => {
                if (valid) {
                    if (this.ruleForm.controlType === '1') {
                        this.doSave();
                    } else {
                        this.doSave1();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }

        async doSave() {
            this.$showLoading();
            const data: any = {
                userId: this.ruleForm.userId,
                wechatCode: this.ruleForm.wechatCode,
                wechatNo: this.ruleForm.wechatNo,
                simplyIntroduce: this.ruleForm.simplyIntroduce,
                work: this.ruleForm.work,
                workType: this.ruleForm.workType
            };

            this.$closeLoading();
            const [err, resp] = await this.$postAsync('/user/userAuth', data, {paramType: 'form'});
            if (resp?.code === '000000') {
                this.$showToast('保存成功');
                setTimeout(() => {
                    location.reload();
                }, 200);
            } else {
                this.$showToast(resp?.message || '保存失败');
            }
        }

        async doSave1() {
            this.$showLoading();
            const data: any = {
                userId: this.ruleForm.userId
            };

            this.$closeLoading();
            const [err, resp] = await this.$postAsync('/user/lockUser', data, {paramType: 'form'});
            if (resp?.code === '000000') {
                this.$showToast('操作成功');
                setTimeout(() => {
                    location.reload();
                }, 200);
            } else {
                this.$showToast(resp?.message || '操作失败');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .line-h{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
    }
    .hbb-table-content{
        float: left;
        width: 80%;
        border-bottom: 1px solid #ddd;
        border-right:1px solid #ddd;
        background:#F2F2F2;
        margin: 20px 0 10px 0;
        padding: 10px;
        span{
            float: left;
            width: 100%;
            height: 30px;
            text-align: left;
            line-height: 30px;
            color: #333;
            b{
                margin-left: 20px;
                font-weight: normal;
            }
        }
    }
</style>
