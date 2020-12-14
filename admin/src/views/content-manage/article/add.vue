<!--添加文章-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                添加文章
            </div>
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
                <el-form-item label="发布时间：" prop="publishTime" label-width="120px">
                    <el-date-picker
                        v-model="editData.publishTime"
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
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import {makeDatePickerLimit} from '@/utils/helper';
    import MyCustomEditor from '@/components/MyCustomEditor.vue';
    import MyImageUpload from '@/components/MyImageUpload.vue';

    let editDataSnapshot = '';
    @Component({
        components: {
            MyImageUpload,
            MyCustomEditor
        },
        mixins: []
    })
    export default class extends Vue {
        editData: any = {
            title: '', // 标题
            origin: '', // 来源
            articleDescribe: '', // 描述
            isQuote: '0', // 是否外调
            details: '', // 详情
            status: '1', // 状态
            isTop: '0', // 是否置顶
            thumbnail: '', // 预览图
            shareTitleImgUrl: '', // 分享预览图
            publishTime: '' // 发布时间
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

        publishTimeOpt: any = {};
        tagsList: any[] = [];

        mounted() {
            // 保存未更改的快照, 用于对比数据是否发生更改
            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            }, 50);
            // this.publishTimeOpt.disabledDate = makeDatePickerLimit(new Date());
            this.getTagsListData();
        }

        @Watch('editData.thumbnail')
        onThumbnailChange(val: string) {
            if (val) {
                (this.$refs.dataForm as ElForm).clearValidate('thumbnail');
            }
        }

        async getTagsListData() {
            const [err, resp] = await this.$postAsync('/dictionaryCtrl/findDictionaryByCode', {
                code: 'article_category'
            }, {
                paramType: 'form'
            });
            if (resp?.code === '000000') {
                this.tagsList = (resp?.data || []).map((item: any) => ({
                    name: String(item.name),
                    value: String(item.value)
                }));
            }
        }

        clickSave() {
            // console.log(this.editData.label);
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
            const data = {
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
                paramType: 'json'
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
            }).catch(() => {
            });
        }

        handleTagClose(tag: string) {
            this.editData.label.splice(this.editData.label.indexOf(tag), 1);
        }

        clickAddLabel() {
            if (this.editData.label[this.editData.label.length - 1] === '') {
                this.$showToast('请完成输入上一个文章标签');
                return;
            }
            if (this.editData.label.length >= 4) {
                this.$showToast('最多只能添加4个标签');
                return;
            }
            this.editData.label.push('');
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .myui-richtext-editor .ql-editor{
        height: 600px;
    }
    .tag-input{
        width: 120px;
        margin-right: 10px;
    }

    .button-new-tag {
        height: 35px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
</style>
