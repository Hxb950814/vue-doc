<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                查看班级
            </div>
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                style="width: 600px"
                :rules="rules"
                label-width="120px"
                class="demo-ruleForm"
            >
                <el-form-item label="班级名称" prop="className">
                    <el-input v-model="ruleForm.className" />
                </el-form-item>
                <el-form-item label="配置课程" prop="courseTypeId">
                    <div style="width: 100%;position: relative">
                        <el-select v-model="ruleForm.courseId" style="margin-right: 15px;width: 145px" placeholder="请选择课程" @change="queryNoListenCourseById">
                            <el-option v-for="(item,index) in queryCourseListPageList" :key="index" :label="item.courseTypeName" :value="item.courseId" />
                        </el-select>
                        <el-select v-model="ruleForm.courseLevel" style="margin-right: 15px;width: 145px" placeholder="请选择级别" @change="queryCourseType">
                            <el-option v-for="(item,index) in queryNoListenCourseByIdList" :key="index" :label="item.title" :value="item.id" />
                        </el-select>
                        <el-select v-model="ruleForm.courseTypeId" style="margin-right: 15px;width: 145px" placeholder="请选择" @change="courseTypeIdChange">
                            <el-option v-for="(item,index) in queryCourseTypeList" :key="index" :label="item.courseName" :value="item.courseTypeId" />
                        </el-select>
                        <el-button style="width: 100px;position: absolute;right: -100px" @click="lookRule">
                            查看规则
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item label="原定班级人数" prop="studentMax">
                    <el-input v-model="ruleForm.studentMax" />
                </el-form-item>
                <el-form-item label="已入班人数" prop="student">
                    <el-input v-model="ruleForm.student" disabled readonly />
                </el-form-item>
                <el-form-item label="任命班主任" prop="studentNo">
                    <div>
                        <el-input v-model="ruleForm.studentNo" style="width: 300px;margin-right: 20px" />
                        <el-button type="primary" @click="queryStudentNo">
                            查询
                        </el-button>
                        <p style="color: #4e9fe1;margin: 10px 0">
                            仅查询认证职业为班主任的会员
                        </p>
                    </div>
                    <template v-if="studentData">
                        <div class="hbb-table-content" style="background: #f3f3f3">
                            <span>会员学号</span>
                            <span>{{ studentData.studentNo }}</span>
                            <span>微信账号</span>
                            <span>{{ studentData.wechatNo }}</span>
                            <span>职业认证</span>
                            <span>{{ ['无', '班主任', '律师'][studentData.workType] }}</span>
                            <span>微信二维码</span>
                            <span><el-image
                                style="width: 20px; height: 20px;margin-top: 5px"
                                :src="studentData.wechatCode"
                                :preview-src-list="srcList"
                            /></span>
                            <span>会员姓名</span>
                            <span>{{ studentData.realityName }}</span>
                            <span>联系方式</span>
                            <span>{{ studentData.mobile }}</span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="hbb-table-content" style="background: #f3f3f3;height: 100px;justify-content:center;align-items: center;display: flex">
                            暂无数据
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="任职期间" required>
                    <el-col :span="11">
                        <el-form-item prop="teacherStartDate">
                            <el-date-picker v-model="ruleForm.teacherStartDate" type="date" placeholder="选择日期" style="width: 100%;" />
                        </el-form-item>
                    </el-col>
                    <el-col class="line line-h" :span="2">
                        -
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="teacherEndDate">
                            <el-date-picker v-model="ruleForm.teacherEndDate" type="date" placeholder="选择时间" style="width: 100%;" />
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="开班周期" required>
                    <el-col :span="11">
                        <el-form-item prop="startDate">
                            <el-date-picker v-model="ruleForm.startDate" type="date" placeholder="选择日期" style="width: 100%;" />
                        </el-form-item>
                    </el-col>
                    <el-col class="line line-h" :span="2">
                        -
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="endDate">
                            <el-date-picker v-model="ruleForm.endDate" type="date" placeholder="选择时间" style="width: 100%;" />
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="奖励规则">
                    <p style="margin-top: 10px;">
                        班主任根据如下课程的设置获得此班学院在其任职期间内的课程费用奖励
                    </p>
                    <div class="hbb-table-content hbb-table-content1">
                        <div class="header">
                            <span>课程名称</span>
                            <span>奖励比例%</span>
                        </div>
                        <div v-for="(item, index) in ruleForm.classAwardlist" :key="index" :class="item.isShow ? 'group' : 'group isShow'">
                            <span>{{ item.courseName }}</span>
                            <span><el-input v-model="item.awardRatio" style="text-align: center" /></span>
                        </div>
                    </div>
                    <p style="color: #ff2f2f">
                        这里的课程调用的创建的股票丶基金课程，不包含此班开班的课程
                    </p>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveClick('ruleForm')">
                        保存
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import MembersView from '../components/members.vue';
    @Component({
        components: {
            MembersView
        }
    })
    export default class extends Vue {
        isFirst: boolean = true; // 是否为第一次进来
        id:string = '';
        ruleForm:any= {
            courseId: '', // 课程设置id
            courseTypeId: '', // 课程设置id
            className: '', // 班级名称
            courseLevel: '', // 课程级别
            studentMax: '', // 限制学生人数
            student: 0, // 学生人数
            studentNo: '', // 班主任学号
            endDate: '', // 开班结束时间
            startDate: '', // 开班开始时间
            teacherEndDate: '', // 开班开始时间
            teacherStartDate: '', // 开班开始时间
            teacherId: '', // 教师id
            wechatCode: '', // 微信二维码
            classAwardlist: [] // 奖励设置
        }

        srcList:any = [
        ]

        rules:any= {
            className: [{required: true, message: '请输入班级名称', trigger: 'blur'}],
            courseTypeId: [{required: true, message: '请选择课程', trigger: 'change'}],
            studentMax: [{required: true, message: '请输入原定班级人数', trigger: 'blur'}],
            studentNo: [{required: true, message: '请输入班主任学号', trigger: 'blur'}],
            endDate: [{required: true, message: '填写日期', trigger: 'blur'}],
            startDate: [{required: true, message: '填写日期', trigger: 'blur'}],
            teacherEndDate: [{required: true, message: '填写日期', trigger: 'blur'}],
            teacherStartDate: [{required: true, message: '填写日期', trigger: 'blur'}]

        }

        studentData = '';

        queryCourseListPageList:any[] = [];
        queryNoListenCourseByIdList:any[] = [];
        queryCourseTypeList:any[] = [];

        courseData:any[] = [
            {id: '0', title: '初级'},
            {id: '1', title: '进阶'},
            {id: '2', title: '小白'},
            {id: '3', title: '其他'}
        ]; // 课程级别数据源

        mounted() {
            this.id = String(this.$route.query.id);
            this.queryCourseListPage();
            this.getDetail();
        }

        async getDetail() {
            // 取得详情
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/class/getClassDetail', {
                classId: this.id
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.ruleForm.courseId = resp?.data.courseId;
                this.ruleForm.courseLevel = String(resp?.data.courseLevel);
                this.queryNoListenCourseById();
                setTimeout(() => { this.queryStudentNo(); }, 0);
                setTimeout(() => { this.ruleForm.courseTypeId = Number(resp?.data.courseTypeId); }, 500);

                // alert(this.ruleForm.courseTypeId)
                this.ruleForm.studentMax = resp?.data.studentMax;
                this.ruleForm.className = resp?.data.className;
                this.ruleForm.student = resp?.data.student;
                this.ruleForm.studentNo = resp?.data.user.studentNo;
                this.ruleForm.endDate = resp?.data.endDate;
                this.ruleForm.startDate = resp?.data.startDate;
                this.ruleForm.teacherEndDate = resp?.data.teacherEndDate;
                this.ruleForm.teacherStartDate = resp?.data.teacherStartDate;
                this.ruleForm.teacherId = resp?.data.teacherId;
                this.ruleForm.classAwardlist = resp?.data.classAwardlist;
                this.ruleForm.classAwardlist.forEach((x:any) => {
                    x.isShow = true;
                });
            } else {
                this.$showToast(resp?.message || '请求异常');
            }
        }

        async queryStudentNo() {
            // 根据学号获取用户
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/user/getTeacherByStudentNo', {
                studentNo: this.ruleForm.studentNo
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.studentData = resp?.data;
                this.ruleForm.teacherId = resp?.data?.userId;
                this.srcList.push(resp?.data?.wechatCode);
            } else {
                this.$showToast(resp?.message || '添加失败');
            }
        }

        async queryCourseListPage () {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/course/queryCourseListPage ', {
                page: 1
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.queryCourseListPageList = (resp.data.result || []).filter((x:any) => x.courseId !== 5);
                this.isFirst = false;
            } else {
            }
        }

        async queryNoListenCourseById () {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/course/queryNoListenCourseById ', {
                courseId: this.ruleForm.courseId
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                let arr:any[] = [];
                this.queryNoListenCourseByIdList = [];
                (resp?.data || []).forEach((item: any) => {
                    arr = this.courseData.filter((x:any) => {
                        return x.id === item;
                    });
                    this.queryNoListenCourseByIdList.push(arr[0]);
                });
                this.isFirst = false;
                this.queryCourseType(1);
            } else {
            }
        }

        async queryCourseType (t:number) {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/course/queryCourseType', {
                courseId: this.ruleForm.courseId,
                courseLevel: this.ruleForm.courseLevel
            }, {
                paramType: 'form'
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.queryCourseTypeList = resp?.data || [];

                if (this.isFirst) { return false; }
                this.ruleForm.courseTypeId = '';
            } else {
            }
        }

        courseTypeIdChange() {
            this.ruleForm.classAwardlist.forEach((x:any) => {
                if (x.courseTypeId === Number(this.ruleForm.courseTypeId)) {
                    x.isShow = false;
                } else {
                    x.isShow = true;
                }
            });
        }

        saveClick(formName:any) {
            (this.$refs[formName] as any).validate((valid:any) => {
                if (valid) {
                    this.doSave();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }

        async doSave() {
            this.$showLoading();
            const classAwardlistArr = this.ruleForm.classAwardlist.map((x:any) => {
                return {
                    awardRatio: x.awardRatio,
                    courseTypeId: x.courseTypeId
                };
            });
            const data: any = {
                classId: this.id,
                classAwardlist: classAwardlistArr,
                courseTypeId: this.ruleForm.courseTypeId,
                className: this.ruleForm.className,
                endDate: this.ruleForm.endDate,
                startDate: this.ruleForm.startDate,
                student: this.ruleForm.student,
                studentMax: this.ruleForm.studentMax,
                teacherEndDate: this.ruleForm.teacherEndDate,
                teacherId: this.ruleForm.teacherId,
                teacherStartDate: this.ruleForm.teacherStartDate
            };
            this.$closeLoading();
            const [err, resp] = await this.$postAsync('/class/editClass', data, {paramType: 'json'});
            if (resp?.code === '000000') {
                this.$showToast('保存成功');
                setTimeout(() => {
                    this.$router.back();
                }, 200);
            } else {
                this.$showToast(resp?.message || '保存失败');
            }
        }

        lookRule() {
            this.$router.push({
                path: '/user_manage/memberClass/lookRule',
                query: {
                    id: this.id,
                    kid: this.ruleForm.courseTypeId
                }
            });
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
        width: 100%;
        border-bottom: 1px solid #ddd;
        border-right:1px solid #ddd;
        span{
            float: left;
            width: 25%;
            height: 30px;
            border: 1px solid #ddd;
            text-align: center;
            line-height: 30px;
            border-bottom: 0;
            border-right: 0;
        }
        &.hbb-table-content1{
            margin: 20px 0 10px 0;
            span{
                width:50%
            }
            .group{
                &.isShow{
                    display: none !important;
                }
                span{
                    &:nth-of-type(1){
                        text-align: left;
                        padding-left: 20px;
                    }

                }
            }
        }
    }
</style>
