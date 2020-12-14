0<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                听书课程查看
            </div>
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                style="width: 800px;margin-left:100px"
                :rules="rules"
                label-width="120px"
                class="demo-ruleForm"
            >
                <el-form-item label="书本名称" prop="courseName">
                    <div style="width: 100%;position: relative">
                        <el-input v-model="ruleForm.courseName" max-length="20" style="width:80%;margin-right: 20px" placeholder="请输入小节标题" />
                    </div>
                </el-form-item>

                <el-form-item label="书本作者">
                    <div style="width: 100%;position: relative">
                        <el-input v-model="ruleForm.author" style="width:80%;margin-right: 20px" placeholder="请输入课程作者" />
                    </div>
                </el-form-item>

                <el-form-item label="推荐星级" prop="start">
                    <div style="display: flex;align-items: center;height: 40px">
                        <el-rate
                            v-model="ruleForm.start"
                            text-color="red"
                        />
                    </div>
                </el-form-item>
                <el-form-item v-viewer label="书本封面" prop="courseImgUrl" label-width="120px">
                    <div class="dis-flex">
                        <my-image-upload :url.sync="ruleForm.courseImgUrl" class="small" />
                        <div style="padding: 80px 0 0 10px">
                            (100*100px)
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="书本介绍" prop="courseDescribe">
                    <div>
                        <el-input v-model="ruleForm.courseDescribe" style="width:80%;margin-right: 20px" placeholder="请输入内容链接" />
                    </div>
                </el-form-item>
                <el-form-item v-viewer label="书本简介" prop="courseDescribeUrl" label-width="120px">
                    <div class="dis-flex">
                        <my-image-upload :url.sync="ruleForm.courseDescribeUrl" class="small" />
                        <div style="padding: 80px 0 0 10px">
                            (100*100px)
                        </div>
                    </div>
                </el-form-item>
                <el-form-item v-viewer label="分享图标" prop="shareTitleImgUrl" label-width="120px">
                    <div class="dis-flex">
                        <my-image-upload :url.sync="ruleForm.shareTitleImgUrl" class="small" />
                        <div style="padding: 80px 0 0 10px">
                            (100*100px)
                        </div>
                    </div>
                </el-form-item>
                <el-form-item v-viewer label="书本小节" label-width="120px">
                    <div style="position: relative">
                        <el-table
                            :data="ruleForm.courseListenSectionList"
                            border
                            style="width: 100%"
                        >
                            <el-table-column
                                label="书本小节"
                                align="center"
                                width="80px"
                            >
                                <template slot-scope="scope">
                                    <span>{{ scope.row.sectionNo }}</span>
                                </template>
                            </el-table-column>>
                            <el-table-column
                                prop="sectionTitle"
                                label="小节标题"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.sectionTitle" max-length="20" type="text" style="width:100%;border: none" placeholder="小节标题" />
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="contendUrl"
                                label="内容链接"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.contendUrl" type="text" style="width:100%;border: none" placeholder="内容链接" />
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="unlockIntegral"
                                label="解锁积分"
                                align="center"
                                width="80px"
                            >
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.unlockIntegral" type="text" style="width:100%;border: none" placeholder="积分" @input="unlockIntegralInput(scope.row)" />
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="unlockMoney"
                                label="解锁金额"
                                align="center"
                                width="80px"
                            >
                                <template slot-scope="scope">
                                    <el-input
                                        v-model="scope.row.unlockMoney"
                                        max-length="10"
                                        type="text"
                                        style="width:100%;border: none"
                                        placeholder="金额"
                                        @input="unlockMoneyInput(scope.row)"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                width="80px"
                                fixed="right"
                                label="操作"
                            >
                                <template slot-scope="scope">
                                    <a v-if="scope.$index === ruleForm.courseListenSectionList.length - 1" style="cursor: pointer;color: #ff2f2f" @click="deleteCourseChapter(scope.row,scope.$index)">删除</a>
                                    <a v-else>--</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <span class="hbb-add" @click="addCourseChapter">+</span>
                    </div>
                </el-form-item>
                <el-form-item label="展示状态" prop="display">
                    <el-radio-group v-model="ruleForm.display">
                        <el-radio label="1">
                            显示
                        </el-radio>
                        <el-radio label="0">
                            隐藏
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="展示顺序：" prop="sort" label-width="120px">
                    <el-input
                        v-model.trim="ruleForm.sort"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入icon顺序（1~99数字）"
                        maxlength="50"
                        style="width:300px"
                    />
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
    import dayjs from 'dayjs';
    import MyImageUpload from '@/components/MyImageUpload.vue';
    import * as validator from '@/utils/validate';
    @Component({
        components: {
            MyImageUpload
        }
    })
    export default class extends Vue {
        id:string = '';
        courseListenId:string = '';
        ruleForm:any= {
            courseName: '', // 书本名称
            author: '', // 书本作者
            start: 0, // 推荐星级
            courseDescribeUrl: '', // 书本简介
            shareTitleImgUrl: '', // 分享图标
            courseDescribe: '', // 书本介绍
            courseImgUrl: '', // 书本封面
            courseListenSectionList: [], // 讲课形式
            sort: '', // 展示顺序
            display: '1' // 当前状态 0=隐藏 1=显示
        }

        rules:any= {
            courseName: [
                { required: true, message: '请输入书本名称', trigger: 'blur' }
            ],
            start: [
                { required: true, message: '请选择推荐星级', trigger: 'blur' }
            ],
            courseDescribe: [
                { required: true, message: '请输入书本介绍', trigger: 'blur' }
            ],
            courseDescribeUrl: [
                { required: true, message: '请上传书本简介', trigger: 'blur' }
            ],
            shareTitleImgUrl: [
                { required: true, message: '请上传分享图标', trigger: 'blur' }
            ],
            courseImgUrl: [
                { required: true, message: '请选择书本封面', trigger: 'blur' }
            ],
            display: [
                { required: true, message: '请选择展示状态', trigger: 'blur' }
            ],
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
        }

        mounted() {
            this.id = String(this.$route.query.mode);
            this.courseListenId = String(this.$route.query.id);
            this.getDetail();
        }

        async getDetail() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/course/queryCourseListenInfoById', {courseListenId: this.courseListenId});
            if (resp?.code === '000000') {
                const data = resp?.data;
                this.ruleForm.courseName = data.courseName;
                this.ruleForm.author = data.author;
                this.ruleForm.start = data.start;
                this.ruleForm.courseDescribeUrl = data.courseDescribeUrl;
                this.ruleForm.shareTitleImgUrl = data.shareTitleImgUrl;

                this.ruleForm.courseDescribe = data.courseDescribe;
                this.ruleForm.courseImgUrl = data.courseImgUrl;
                this.ruleForm.courseListenSectionList = data.courseListenSectionList;
                this.ruleForm.sort = data.sort;
                this.ruleForm.display = String(data.display);
            }
            this.$closeLoading();
        }

        addCourseChapter() {
            const obj = {
                courseListenId: '',
                courseListenSectionId: '',
                sectionNo: '',
                sectionTitle: '',
                unlockIntegral: '',
                unlockMoney: ''
            };
            this.ruleForm.courseListenSectionList.push(obj);
            this.ruleForm.courseListenSectionList.forEach((x:any, i:number) => {
                x.sectionNo = i + 1;
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

        unlockIntegralInput(row:any) {
            row.unlockMoney = 0;
        }

        unlockMoneyInput(row:any) {
            row.unlockIntegral = 0;
        }

        deleteCourseChapter(row:any, i:number) {
            if (row.courseListenSectionId) {
                this.deleteFn(row.courseListenSectionId, i);
            } else {
                this.ruleForm.courseListenSectionList.splice(i, 1);
            }
        }

        async deleteFn(id: number, i:number) {
            // debugger
            this.$showMessageBox('是否确定删除?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/course/deleteCourseListenSectionInfoById', {
                        courseListenSectionId: id
                    }, {
                        paramType: 'form'
                    });
                    this.ruleForm.courseListenSectionList.splice(i, 1);
                })();
            }).catch(() => {
            });
        }

        async doSave() {
            if (this.ruleForm.courseListenSectionList.length === 0) {
                this.$message({
                    type: 'warning',
                    message: '请至少添加一个小节'
                });
                return false;
            }
            this.$showLoading();
            const data: any = {
                courseId: this.id, //  // 课程设置id
                courseListenId: this.courseListenId, // 课程小节id
                courseName: this.ruleForm.courseName, // 书本名称
                author: this.ruleForm.author, // 作者
                start: this.ruleForm.start, // 推荐星级
                courseDescribeUrl: this.ruleForm.courseDescribeUrl, // 书本简介
                shareTitleImgUrl: this.ruleForm.shareTitleImgUrl, // 分享图标
                courseDescribe: this.ruleForm.courseDescribe, // 书本介绍
                courseImgUrl: this.ruleForm.courseImgUrl, // 书本封面
                courseListenSectionList: this.ruleForm.courseListenSectionList, // 是否试听
                sort: this.ruleForm.sort, // 展示顺序
                display: this.ruleForm.display // 当前状态 0=隐藏 1=显示
            };
            this.$closeLoading();
            const [err, resp] = await this.$postAsync('/course/addOrUpdateCourseListen', data, {paramType: 'json'});
            if (resp?.code === '000000') {
                this.$showToast('添加成功');
                setTimeout(() => {
                    this.$router.back();
                }, 200);
            } else {
                this.$showToast(resp?.message || '添加失败');
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
    .hbb-add{
        position: absolute;
        width: 30px;
        border: 1px solid #0ca2ff;
        height: 30px;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #0ca2ff;
        right: -30px;
        bottom: 0;
        font-size: 20px;
        cursor: pointer;
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
        }
    }
</style>
