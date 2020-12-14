<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                查看{{ $route.query.title }}目录
            </div>
            <el-form
                ref="dataForm"
                :model="editData"
                style="width: 700px;margin-left:100px"
                :rules="rules"
                label-width="120px"
                class="demo-ruleForm"
            >
                <el-form-item label="课程名称" prop="courseName">
                    <div style="width: 100%;position: relative">
                        <el-input v-model="editData.courseName" type="text" max-length="20" style="width:100%" placeholder="课程名称" />
                    </div>
                </el-form-item>
                <el-form-item label="课程级别" prop="courseLevel">
                    <el-select v-model="editData.courseLevel" style="width: 100%" placeholder="请选择课程级别">
                        <el-option v-for="(item,index) in courseDataShow" :key="index" :label="item.title" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="课程描述" prop="courseDescribe">
                    <div style="width: 100%;position: relative">
                        <el-input v-model="editData.courseDescribe" max-length="20" type="text" style="width:100%;" placeholder="课程描述" />
                    </div>
                </el-form-item>
                <el-form-item label="课程章节" prop="courseChapterList">
                    <div style="position: relative">
                        <el-table
                            :data="editData.courseChapterList"
                            border
                            style="width: 100%"
                        >
                            <el-table-column
                                prop="chapterNo"
                                label="课程章节号"
                                align="center"
                                width="180"
                            />
                            <el-table-column
                                prop="chapterTitle"
                                label="章节标题"
                                align="center"
                                width="180"
                            >
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.chapterTitle" max-length="10" type="text" style="width:100%;border: none" placeholder="课程描述" />
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                label="操作"
                            >
                                <template slot-scope="scope">
                                    <a v-if="scope.$index === editData.courseChapterList.length - 1" style="cursor: pointer;color: #ff2f2f" @click="deleteCourseChapter(scope.row,scope.$index)">删除</a>
                                    <a v-else>--</a>
                                </template>
                            </el-table-column>
                        </el-table>
                        <span class="hbb-add" @click="addCourseChapter">+</span>
                    </div>
                </el-form-item>
                <el-form-item v-viewer label="课程封面" prop="courseImgUrl" label-width="120px">
                    <div class="dis-flex">
                        <my-image-upload :url.sync="editData.courseImgUrl" class="small" />
                        <div style="padding: 80px 0 0 10px">
                            (100*100px)
                        </div>
                    </div>
                </el-form-item>
                <el-form-item v-viewer label="课程介绍" prop="courseDescribeUrl" label-width="120px">
                    <div class="dis-flex">
                        <my-image-upload :url.sync="editData.courseDescribeUrl" class="small" />
                        <div style="padding: 80px 0 0 10px">
                            (100*100px)
                        </div>
                    </div>
                </el-form-item>
                <el-form-item v-viewer label="分享图标" prop="shareTitleImgUrl" label-width="120px">
                    <div class="dis-flex">
                        <my-image-upload :url.sync="editData.shareTitleImgUrl" class="small" />
                        <div style="padding: 80px 0 0 10px">
                            (100*100px)
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="课程标签">
                    <div>
                        <el-input v-model="editData.label1" type="text" style="width:30%;margin-right: 20px" placeholder="标签1" />
                        <el-input v-model="editData.label2" type="text" style="width:30%;margin-right: 20px" placeholder="标签2" />
                        <el-input v-model="editData.label3" type="text" style="width:30%;" placeholder="标签3" />
                    </div>
                </el-form-item>

                <el-form-item label="是否推荐" prop="isRecommend">
                    <el-radio-group v-model="editData.isRecommend">
                        <el-radio label="1">
                            是
                        </el-radio>
                        <el-radio label="0">
                            否
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否热销" prop="isHotSale">
                    <el-radio-group v-model="editData.isHotSale">
                        <el-radio label="1">
                            是
                        </el-radio>
                        <el-radio label="0">
                            否
                        </el-radio>
                    </el-radio-group>
                    <template v-if="editData.isHotSale === '1'">
                        <div class="dis-flex">
                            <my-image-upload :url.sync="editData.hotSaleUrl" class="small" />
                            <div style="padding: 80px 0 0 10px">
                                (100*100px)
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="市场价格" prop="markPrice">
                    <div>
                        <el-input v-model="editData.markPrice" style="width:100%;" placeholder="请输入市场价格" />
                    </div>
                </el-form-item>
                <el-form-item label="优惠券" prop="isSupportCoupon">
                    <el-radio-group v-model="editData.isSupportCoupon">
                        <el-radio label="1">
                            支持
                        </el-radio>
                        <el-radio label="0">
                            不支持
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="限时优惠" prop="isLimitTimeDiscount">
                    <el-radio-group v-model="editData.isLimitTimeDiscount">
                        <el-radio label="1">
                            启用
                        </el-radio>
                        <el-radio label="0">
                            禁用
                        </el-radio>
                    </el-radio-group>
                    <div v-if="editData.isLimitTimeDiscount === '1'" class="hbb-yh">
                        <div class="group">
                            <div class="l" style="width: 80px">
                                <span>优惠时间：</span>
                            </div>
                            <div class="r">
                                <el-radio v-model="editData.discountTimeType" label="0">
                                    永久
                                </el-radio>
                                <div>
                                    <el-radio v-model="editData.discountTimeType" label="1">
                                        范围
                                    </el-radio>
                                    <el-date-picker
                                        v-model="editData.discountStartTime"
                                        type="datetime"
                                        style="width:180px"
                                        :disabled="editData.discountTimeType !== '1'"
                                        placeholder="选择日期时间"
                                    />
                                    <span style="width:30px;text-align: center;font-size: 30px;color: #ccc"> - </span>
                                    <el-date-picker
                                        v-model="editData.discountEndTime"
                                        type="datetime"
                                        :disabled="editData.discountTimeType !== '1'"
                                        style="width:180px"
                                        placeholder="选择日期时间"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="group">
                            <div class="l">
                                <span>优惠价格：</span>
                            </div>
                            <div class="r" style="display: flex;align-items: center">
                                <el-form-item prop="discountPrice" label-width="120px" style="margin-bottom: 0;">
                                    <el-input v-model="editData.discountPrice" style="width:70%;" placeholder="请输入优惠价格" />
                                </el-form-item>
                                <span>（减免价格）</span>
                            </div>
                        </div>
                    </div>
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
                    <p style="margin-top: 5px;color: #666">
                        用于控制前端课程显示顺序
                    </p>
                </el-form-item>
                <el-form-item label="顶部色号：" prop="topColour" label-width="120px">
                    <el-input
                        v-model.trim="editData.topColour"
                        type="text"
                        autocomplete="off"
                        placeholder="如#FFFFFF"
                        maxlength="7"
                        style="width:300px"
                    />
                    <p style="margin-top: 5px;color: #666">
                        用于控制前端课程详情顶部背景色
                    </p>
                </el-form-item>
                <el-form-item label="当前状态" prop="display">
                    <el-radio-group v-model="editData.display">
                        <el-radio label="1">
                            显示
                        </el-radio>
                        <el-radio label="0">
                            隐藏
                        </el-radio>
                    </el-radio-group>
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
    import {ElForm} from 'element-ui/types/form';
    import dayjs from 'dayjs';
    import MyImageUpload from '@/components/MyImageUpload.vue';
    import * as validator from '@/utils/validate';
    @Component({
        components: {
            MyImageUpload
        }
    })
    export default class extends Vue {
        id: string = '';
        courseTypeId: string = '';
        editData:any= {
            courseName: '', // 课程名称
            courseLevel: '', // 课程等级
            courseDescribe: '', // 课程描述
            courseChapterList: [], // 课程章节
            courseImgUrl: '', // 课程封面
            courseDescribeUrl: '', // 课程介绍
            shareTitleImgUrl: '', // 分享图标
            label1: '', // 标签1
            label2: '', // 标签2
            label3: '', // 标签3
            isRecommend: '0', // 是否推荐 0=否 1=是
            isHotSale: '0', // 是否热销 0=否 1=是
            markPrice: '', // 市场价格
            isSupportCoupon: '0', // 是否支持优惠券 0=不支持 1=支持
            isLimitTimeDiscount: '0', // 限时优惠是否开启 0=禁止 1=开启
            discountTimeType: '0', // 优惠时间类型 0=永久 1=时间范围
            discountEndTime: '', // 打折结束时间
            discountStartTime: '', // 打折开始时间
            discountPrice: '', // 优惠价格
            sort: '', // 展示顺序
            display: '1', // 展示状态 0=隐藏 1=展示
            topColour: '', // 顶部色号
            hotSaleUrl: ''
        }

        time:string = ''; // 时间桥接

        rules:any= {
            courseName: [
                { required: true, message: '请输入课程名称', trigger: 'blur' },
                { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
            ],
            courseLevel: [
                { required: true, message: '请选择课程等级', trigger: 'change' }
            ],
            courseDescribe: [
                { required: true, message: '请输入课程名称', trigger: 'blur' },
                { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
            ],
            courseImgUrl: [
                { required: true, message: '请设置课程封面', trigger: 'change' }
            ],
            shareTitleImgUrl: [
                { required: true, message: '请设置分享图标', trigger: 'change' }
            ],
            courseDescribeUrl: [
                { required: true, message: '请设置课程介绍', trigger: 'change' }
            ],
            isRecommend: [
                { required: true, message: '请选择是否推荐', trigger: 'change' }
            ],
            isHotSale: [
                { required: true, message: '请选择是否热销', trigger: 'change' }
            ],
            markPrice: [
                { required: true, message: '请输入市场价格', trigger: 'change' }
            ],
            isSupportCoupon: [
                { required: true, message: '请选择是否支持优惠券', trigger: 'change' }
            ],
            isLimitTimeDiscount: [
                { required: true, message: '请选择是否开启限时优惠', trigger: 'change' }
            ],
            discountTimeType: [
                { required: true, message: '请选择时间类型', trigger: 'change' }
            ],
            display: [
                { required: true, message: '请选择是否显示', trigger: 'change' }
            ],
            topColour: [
                { required: true, message: '请选择顶部色号', trigger: 'change' }
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

        courseData:any[] = [
            {id: '0', title: '初级'},
            {id: '1', title: '进阶'},
            {id: '2', title: '小白'},
            {id: '3', title: '其他'}
        ]; // 课程级别数据源

        textArr:any[] = [
            {name: 0, value: '十'},
            {name: 1, value: '一'},
            {name: 2, value: '二'},
            {name: 3, value: '三'},
            {name: 4, value: '四'},
            {name: 5, value: '五'},
            {name: 6, value: '六'},
            {name: 7, value: '七'},
            {name: 8, value: '八'},
            {name: 9, value: '九'}
        ]

        courseDataShow:any[] = []; // 课程级别数据源

        mounted() {
            this.id = String(this.$route.query.mode);
            this.courseTypeId = String(this.$route.query.id);
            this.getDetail();
            this.queryNoListenCourseById();
        }

       async getDetail() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/course/queryNoListenCourseInfoById', {courseTypeId: this.courseTypeId});
            if (resp?.code === '000000') {
                const data = resp?.data;
                this.editData.courseName = data.courseName;
                this.editData.courseLevel = String(data.courseLevel);
                this.editData.courseDescribe = data.courseDescribe;
                this.editData.courseChapterList = data.courseChapterList;
                this.editData.courseImgUrl = data.courseImgUrl;
                this.editData.courseDescribeUrl = data.courseDescribeUrl;
                this.editData.shareTitleImgUrl = data.shareTitleImgUrl;
                this.editData.label1 = data.label1;
                this.editData.label2 = data.label2;
                this.editData.label3 = data.label3;
                this.editData.isRecommend = String(data.isRecommend);
                this.editData.isHotSale = String(data.isHotSale);
                this.editData.markPrice = data.markPrice;
                this.editData.isSupportCoupon = String(data.isSupportCoupon);
                this.editData.isLimitTimeDiscount = String(data.isLimitTimeDiscount);
                this.editData.discountTimeType = String(data.discountTimeType);
                this.editData.discountEndTime = data.discountEndTime;
                this.editData.discountStartTime = data.discountStartTime;
                this.editData.discountPrice = data.discountPrice;
                this.editData.sort = data.sort;
                this.editData.display = String(data.display);
                this.editData.topColour = data.topColour;
                this.editData.hotSaleUrl = data.hotSaleUrl;
            }
            this.$closeLoading();
        }

        saveClick() {
            (this.$refs.dataForm as ElForm).validate((valid: boolean) => {
                if (valid) {
                    this.$showMessageBox('是否保存?').then(() => {
                        this.doSave();
                    });
                }
            });
        }

        async queryNoListenCourseById() {
            const [err, resp] = await this.$postAsync('/course/queryNoListenCourseById', {courseId: this.id});
            if (resp?.code === '000000') {
                let arr:any[] = [];
                (resp?.data || []).forEach((item: any) => {
                    arr = this.courseData.filter((x:any) => {
                        return x.id === item;
                    });
                    this.courseDataShow.push(arr[0]);
                });
            }
        }

        addCourseChapter() {
            const obj = {
                chapterNo: '',
                courseChapterId: '',
                chapterTitle: ''
            };
            this.editData.courseChapterList.push(obj);
            this.editData.courseChapterList.forEach((x:any, i:number) => {
                x.chapterNo = '第' + this.numText(i + 1) + '章';
            });
        }

        deleteCourseChapter(row:any, i:number) {
            if (row.courseChapterId) {
                this.deleteFn(row.courseChapterId, i);
            } else {
                this.editData.courseChapterList.splice(i, 1);
            }
        }

        async deleteFn(id: number, i:number) {
            // debugger
            this.$showMessageBox('是否确定删除?').then(() => {
                (async () => {
                    const [err, resp] = await this.$postAsync('/course/deleteNoListenCourseChapterById', {
                        courseChapterId: id
                    }, {
                        paramType: 'form'
                    });
                    this.editData.courseChapterList.splice(i, 1);
                })();
            }).catch(() => {
            });
        }

        numText(num:any) {
            const numArr = num.toString().split('');
            const that = this;
            const result:any[] = [];
            numArr.forEach((res:any) => {
                that.textArr.forEach((item) => {
                    if (item.name === Number(res)) { result.push(item.value); }
                });
            });
            return result.join('');
        }

        async doSave() {
            if (this.editData.courseChapterList.length === 0) {
                this.$message({
                    type: 'warning',
                    message: '请至少添加一个章节课程'
                });
                return false;
            }
            if (this.editData.isHotSale === '1') {
                if (this.editData.hotSaleUrl === '') {
                    this.$message({
                        type: 'warning',
                        message: '请上传热销的封面图'
                    });
                    return false;
                }
            }
            this.$showLoading();
            const data: any = {
                courseId: this.id, //  // 课程设置id
                courseTypeId: this.courseTypeId,
                courseName: this.editData.courseName, // 课程名称
                courseLevel: this.editData.courseLevel, // 课程等级
                courseDescribe: this.editData.courseDescribe, // 课程描述
                courseChapterList: this.editData.courseChapterList, // 课程章节
                courseImgUrl: this.editData.courseImgUrl, // 课程封面
                courseDescribeUrl: this.editData.courseDescribeUrl, // 课程介绍
                shareTitleImgUrl: this.editData.shareTitleImgUrl, // 分享图标
                label1: this.editData.label1, // 标签1
                label2: this.editData.label2, // 标签2
                label3: this.editData.label3, // 标签3
                isRecommend: this.editData.isRecommend, // 是否推荐 0=否 1=是
                isHotSale: this.editData.isHotSale, // 是否热销 0=否 1=是
                markPrice: this.editData.markPrice, // 市场价格
                isSupportCoupon: this.editData.isSupportCoupon, // 是否支持优惠券 0=不支持 1=支持
                isLimitTimeDiscount: this.editData.isLimitTimeDiscount, // 限时优惠是否开启 0=禁止 1=开启
                discountTimeType: this.editData.discountTimeType, // 优惠时间类型 0=永久 1=时间范围
                discountEndTime: this.editData.discountEndTime ? dayjs(this.editData.discountEndTime).format('YYYY-MM-DD HH:mm:ss') : '', // 打折结束时间
                discountStartTime: this.editData.discountStartTime ? dayjs(this.editData.discountStartTime).format('YYYY-MM-DD HH:mm:ss') : '', // 打折开始时间
                discountPrice: this.editData.discountPrice, // 优惠价格
                sort: this.editData.sort, // 展示顺序
                display: this.editData.display, // 展示状态 0=隐藏 1=展示
                topColour: this.editData.topColour, // 顶部色号
                hotSaleUrl: this.editData.isHotSale === '1' ? this.editData.hotSaleUrl : ''
            };
            this.$closeLoading();
            const [err, resp] = await this.$postAsync('/course/addOrUpdateNoListenCourseChapter', data, {paramType: 'json'});
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
    .hbb-yh{
        display: flex;
        width: 100%;
        padding: 10px;
        background: #F2F2F2;

        flex-direction: column;
        .group{
            display: flex;
            margin-top: 10px;
            &:nth-of-type(2){align-items: center;}
            .l{
                width: 80px;
            }
            .r{

                div{
                    display: flex;
                    align-items: center;
                }
            }
        }
    }
</style>
