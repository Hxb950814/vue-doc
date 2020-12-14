<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                添加{{ $route.query.title }}小节
            </div>
            <el-form
                ref="ruleForm"
                :model="ruleForm"
                style="width: 800px;margin-left:100px"
                :rules="rules"
                label-width="120px"
                class="demo-ruleForm"
            >
                <el-form-item label="小节标题" prop="sectionTitle">
                    <div style="width: 100%;position: relative">
                        <el-input v-model="ruleForm.sectionTitle" max-length="20" style="width:80%;margin-right: 20px" placeholder="请输入小节标题" />
                    </div>
                </el-form-item>
                <el-form-item label="课程小节" prop="sectionNo">
                    <el-select v-model="ruleForm.sectionNo" style="margin-right: 15px;width: 80%" placeholder="请选择课程小节">
                        <el-option v-for="(item, index) in sectionNoList" :key="index" :label="item.title" :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="课程作者">
                    <div style="width: 100%;position: relative">
                        <el-input v-model="ruleForm.author" style="width:80%;margin-right: 20px" placeholder="请输入课程作者" />
                    </div>
                </el-form-item>
                <el-form-item label="小节描述" prop="sectionDescribe">
                    <div>
                        <el-input v-model="ruleForm.sectionDescribe" max-length="20" style="width:80%;margin-right: 20px" placeholder="请输入小节描述" />
                    </div>
                </el-form-item>
                <el-form-item label="课程名称" prop="courseTypeId">
                    <div>
                        <el-select v-model="ruleForm.courseTypeId" style="margin-right: 15px;width: 80%" placeholder="请选择课程名称" @change="queryAllNoListenCourseType">
                            <el-option v-for="(item, index) in nolistenCourse" :key="index" :label="item.courseName" :value="item.courseTypeId" />
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="课程目录" prop="courseChapterId">
                    <div>
                        <el-select v-model="ruleForm.courseChapterId" style="margin-right: 15px;width: 80%" placeholder="请选择课程目录">
                            <el-option v-for="(item, index) in noListenCourseType" :key="index" :label="item.chapterNo + '-' + item.chapterTitle" :value="item.courseChapterId" />
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="支持试听" prop="isAudition">
                    <el-radio-group v-model="ruleForm.isAudition">
                        <el-radio label="1">
                            是
                        </el-radio>
                        <el-radio label="0">
                            否
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="讲课形式" prop="courseFrom">
                    <div>
                        <el-select v-model="ruleForm.courseFrom" style="margin-right: 15px;width: 80%" placeholder="请选择讲课形式">
                            <el-option label="视频" value="0" />
                            <el-option label="音频" value="1" />
                            <el-option label="视频+音频" value="2" />
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="视频链接" prop="contentUrl" v-if="ruleForm.courseFrom !== '1'">
                    <div>
                        <el-input v-model="ruleForm.contentUrl" style="width:80%;margin-right: 20px" placeholder="请输入内容链接" />
                    </div>
                </el-form-item>
                <el-form-item label="音频链接" prop="contentSoundUrl"  v-if="ruleForm.courseFrom !== '0'">
                    <div>
                        <el-input v-model="ruleForm.contentSoundUrl" style="width:80%;margin-right: 20px" placeholder="请输入内容链接" />
                    </div>
                </el-form-item>
                <el-form-item label="当前状态" prop="display">
                    <el-radio-group v-model="ruleForm.display">
                        <el-radio label="1">
                            显示
                        </el-radio>
                        <el-radio label="0">
                            隐藏
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-viewer label="小节介绍" prop="sectionImgUrl" label-width="120px">
                    <div class="dis-flex">
                        <my-custom-editor :content.sync="ruleForm.sectionImgUrl" :disabled="false" />
                    </div>
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
    import MyCustomEditor from '@/components/MyCustomEditor.vue';
    @Component({
        components: {
            MyImageUpload,
            MyCustomEditor
        }
    })
    export default class extends Vue {
        id:string = '';
        ruleForm:any= {
            sectionTitle: '', // 小节标题
            sectionNo: '', // 小节号
            author: '', // 作者
            sectionDescribe: '', // 描述
            courseTypeId: '', // 课程章节
            courseChapterId: '', // 课程章节
            courseFrom: '0', // 讲课形式
            isAudition: '0', // 是否试听
            contentUrl: '', // 内容链接
            contentSoundUrl: '', // 内容链接
            sectionImgUrl: '', // 小节介绍地址
            display: '1' // 当前状态 0=隐藏 1=显示
        }

        rules:any= {
            sectionTitle: [
                { required: true, message: '请输入小节标题', trigger: 'blur' }
            ],
            sectionNo: [
                { required: true, message: '请输入小节号', trigger: 'blur' }
            ],
            sectionDescribe: [
                { required: true, message: '请输入描述', trigger: 'blur' }
            ],
            courseTypeId: [
                { required: true, message: '请选择课程章节', trigger: 'change' }
            ],
            courseChapterId: [
                { required: true, message: '请选择课程章节目录', trigger: 'change' }
            ],
            courseFrom: [
                { required: true, message: '请选择讲课形式', trigger: 'blur' }
            ],
            isAudition: [
                { required: true, message: '请选择是否试听', trigger: 'blur' }
            ],
            sectionImgUrl: [
                { required: true, message: '请输入小节介绍地址', trigger: 'blur' }
            ],
            display: [
                { required: true, message: '请选择展示状态', trigger: 'blur' }
            ]
        }

        nolistenCourse:any[] = []; // 所有课程
        noListenCourseType:any[] = []; // 所有章节
        sectionNoList:any[] = []; // 所有章节

        mounted() {
            this.id = String(this.$route.query.mode);
            this.queryAllNoListenCourse();
            this.queryAllNoListenCourseType();
            this.getsectionNoList();
        }

        saveClick(formName:any) {
            if(this.ruleForm.courseFrom === '0') {
                if(!this.ruleForm.contentUrl){
                    this.$message({
                        type: 'warning',
                        message: '请填写视频链接'
                    })
                    return false;
                }
            };

            if(this.ruleForm.courseFrom === '1') {
                if(!this.ruleForm.contentSoundUrl){
                    this.$message({
                        type: 'warning',
                        message: '请填写音频链接'
                    })
                    return false;
                }
            };

            if(this.ruleForm.courseFrom === '2') {
                if(!this.ruleForm.contentUrl){
                    this.$message({
                        type: 'warning',
                        message: '请填写视频链接'
                    })
                    return false;
                }
                if(!this.ruleForm.contentSoundUrl){
                    this.$message({
                        type: 'warning',
                        message: '请填写音频链接'
                    })
                    return false;
                }
            };
            (this.$refs[formName] as any).validate((valid:any) => {
                if (valid) {
                    this.doSave();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }

        getsectionNoList() {
            let obj = {};
           for (let i = 0; i < 20; i++) {
               obj = {
                   id: i + 1,
                   title: '第' + (i + 1) + '节'
               };
               this.sectionNoList.push(obj);
           }
        }

        async queryAllNoListenCourse() {
            const [err, resp] = await this.$postAsync('/course/queryAllNoListenCourse', {courseId: this.id});
            if (resp?.code === '000000') {
                this.nolistenCourse = resp?.data;
            }
        }

        async queryAllNoListenCourseType() {
            const [err, resp] = await this.$postAsync('/course/queryAllNoListenCourseType',
                {
                    courseId: this.id,
                    courseTypeId: this.ruleForm.courseTypeId
                });
            if (resp?.code === '000000') {
                this.noListenCourseType = resp?.data;
            }
        }

        async doSave() {
            this.$showLoading();
            const data: any = {
                courseId: this.id, //  // 课程设置id
                sectionTitle: this.ruleForm.sectionTitle, // 小节标题
                sectionNo: this.ruleForm.sectionNo, // 小节号
                author: this.ruleForm.author, // 作者
                sectionDescribe: this.ruleForm.sectionDescribe, // 描述
                courseTypeId: this.ruleForm.courseTypeId, // 课程章节
                courseChapterId: this.ruleForm.courseChapterId, // 课程章节
                courseFrom: this.ruleForm.courseFrom, // 讲课形式
                isAudition: this.ruleForm.isAudition, // 是否试听
                contentUrl: this.ruleForm.contentUrl, // 内容链接
                contentSoundUrl: this.ruleForm.contentSoundUrl, // 内容链接
                sectionImgUrl: this.ruleForm.sectionImgUrl, // 小节介绍地址
                display: this.ruleForm.display // 当前状态 0=隐藏 1=显示
            };

            this.$closeLoading();
            const [err, resp] = await this.$postAsync('/course/addOrUpdateNoListenCourseChapterSection', data, {paramType: 'form'});
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
