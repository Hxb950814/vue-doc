<!-- 查看公告 -->
<template>
    <div>
        <div class="page-cap-title">
            查看文章
        </div>

        <div class="form-input-area">
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                    <el-form-item label="文章标题：" prop="title" label-width="120px">
                        <el-input
                            v-model.trim="editData.title"
                            type="text"
                            autocomplete="off"
                            placeholder="请输入文章标题"
                            maxlength="50"
                            style="width:730px"
                        />
                    </el-form-item>
                    <el-form-item label="文章来源：" prop="origin" label-width="120px">
                        <el-input
                            v-model.trim="editData.origin"
                            type="text"
                            autocomplete="off"
                            placeholder="请输入文章来源"
                            maxlength="10"
                            style="width:730px"
                        />
                    </el-form-item>
                    <el-form-item label="文章描述：" prop="articleDescribe" label-width="120px">
                        <el-input
                            v-model.trim="editData.articleDescribe"
                            type="text"
                            autocomplete="off"
                            placeholder="请输入文章描述"
                            maxlength="10"
                            style="width:730px"
                        />
                    </el-form-item>
                    <el-form-item label="外部调用：" prop="isQuote" label-width="120px">
                        <el-radio-group v-model="editData.isQuote">
                            <el-radio label="1">
                                是
                            </el-radio>
                            <el-radio label="0">
                                否
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="文章详情：" prop="details" label-width="120px">
                        <my-custom-editor :content.sync="editData.details" />
                    </el-form-item>
                    <el-form-item label="发布时间：" prop="publishTimeStart" label-width="120px">
                        <el-date-picker
                            v-model="editData.publishTimeStart"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="请选择"
                            :picker-options="publishTimeOpt"
                            style="width:200px"
                        />
                    </el-form-item>
                    <el-form-item label="缩略图：" prop="thumbnail" label-width="120px">
                        <div class="dis-flex">
                            <my-image-upload :url.sync="editData.thumbnail" />
                        </div>
                    </el-form-item>
                    <el-form-item label="分享缩略图：" prop="shareTitleImgUrl" label-width="120px">
                        <div class="dis-flex">
                            <my-image-upload :url.sync="editData.shareTitleImgUrl" />
                        </div>
                    </el-form-item>
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
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import commonTable from '@/mixins/commonTable';
    import MyCustomEditor from '@/components/MyCustomEditor.vue';
    import MyImageUpload from '@/components/MyImageUpload.vue';
    import { makeDatePickerRelationLimit} from '@/utils/helper';

    let editDataSnapshot = '';
    @Component({
        components: {MyCustomEditor, MyImageUpload},
        mixins: [commonTable]
    })
    export default class extends Vue {
        id = ''; // id
        editData: any = {
            origin: '', // 文章来源
            title: '', // 标题
            details: '', // 详情
            isQuote: '0', // 是否外调
            status: '', // 状态
            articleDescribe: '', // 描述
            isTop: '', // 是否置顶
            thumbnail: '', // 缩略图
            shareTitleImgUrl: '', // 分享预览图
            publishTimeStart: '', // 发布时间起始值
            publishTimeEnd: '' // 发布时间结束
        };

        dataRule: any = {
            title: [{required: true, message: '请输入文章标题', trigger: 'blur'}],
            articleDescribe: [{required: true, message: '请输入文章描述', trigger: 'blur'}],
            origin: [{required: true, message: '请输入文章来源', trigger: 'blur'}],
            publishTime: [{required: true, message: '请选择发布时间', trigger: 'blur'}],
            thumbnail: [{required: true, message: '请上传缩略图', trigger: 'change'}],
            shareTitleImgUrl: [{required: true, message: '请上传分享缩略图', trigger: 'change'}],
            details: [{required: true, message: '请输入文章详情', trigger: 'change'}],
            isQuote: [{required: true, message: '请选择是否为外部调用', trigger: 'change'}]
        };

        publishTimeOpt1: any = {};
        publishTimeOpt2: any = {};

        mounted() {
            this.searchDateTimeLimit();
            if (!this.$route.query.id || this.$route.query.id === 'undefined') {
                this.$showToast('id不正确');
                return;
            }
            this.id = String(this.$route.query.id);

            // 保存未更改的快照, 用于对比数据是否发生更改
            this.getData();
        }

        searchDateTimeLimit() {
            const limitFuns = makeDatePickerRelationLimit(this.editData, [
                'publishTimeStart', /* 第一个输入框 */
                'publishTimeEnd' /* 第二个输入框 */
            ]);

            this.publishTimeOpt1.disabledDate = limitFuns[0];
            this.publishTimeOpt2.disabledDate = limitFuns[1];
        }

        async getData() {
            // 获得数据
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/article/findArticleById', {
                articleId: this.id
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.editData.details = resp.data.content; // 内容
                this.editData.title = resp.data.title; // 标题
                this.editData.articleDescribe = resp.data.articleDescribe; // 标题
                this.editData.publishTimeStart = resp.data.publishTime || ''; // 位置
                this.editData.publishTimeEnd = resp.data.endTime || ''; // 位置
                this.editData.thumbnail = resp.data.imgName;
                this.editData.shareTitleImgUrl = resp.data.shareTitleImgUrl;
                this.editData.isTop = resp.data.isTop ? '1' : '0'; // 是否置顶
                this.editData.status = resp.data.display ? '1' : '0'; // 显示
                this.editData.origin = resp.data.articleFrom;
                this.editData.isQuote = resp.data.isQuote ? '1' : '0';
            } else {
                this.$showToast(resp?.message || '数据获取失败');
            }

            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            }, 50);
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
                articleId: this.id,
                title: this.editData.title, // 标题
                publishTime: this.editData.publishTime, // 结束时间
                isQuote: this.editData.isQuote, // 标签
                articleFrom: this.editData.origin, // 文章来源
                content: this.editData.details, // 文章内容
                imgName: this.editData.thumbnail, // 缩略图
                isTop: this.editData.isTop, // 是否置顶
                articleDescribe: this.editData.articleDescribe, // 文章描述
                shareTitleImgUrl: this.editData.shareTitleImgUrl, // 缩略图 - 分享
                display: this.editData.status // 是否显示
            };
            const [err, resp] = await this.$postAsync('/article/addArticle', data, {
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

        clickCancel() {
            const editDataNewSnapshot = JSON.stringify(this.editData);
            if (editDataSnapshot === '' || editDataNewSnapshot === editDataSnapshot) {
                this.$router.back();
                return;
            }
            this.$showMessageBox('内容未保存，是否关闭?').then(() => {
                this.$router.back();
            });
        }
    }
</script>
