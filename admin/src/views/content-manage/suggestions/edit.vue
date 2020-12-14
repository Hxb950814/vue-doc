<!-- 处理意见反馈 -->
<template>
    <div>
        <div class="page-cap-title">
            处理意见反馈
        </div>

        <div class="form-input-area">
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule" :disabled="!canEdit">
                <div class="dis-flex">
                    <el-form-item label="反馈人：" prop="" label-width="120px">
                        {{ editData.feedbackPerson }}
                    </el-form-item>
                    <el-form-item label="设备信息：" prop="" label-width="160px">
                        {{ editData.deviceInfo }}
                    </el-form-item>
                </div>

                <el-form-item label="意见内容：" prop="" label-width="120px">
                    <div class="suggestion-frame">
                        {{ editData.suggestionContent || '--' }}
                    </div>
                </el-form-item>
                <el-form-item label="相关材料：" prop="" label-width="120px">
                    <div v-if="editData.images.length > 0" v-viewer class="images-frame">
                        <img v-for="(item,index) in editData.images" :key="index" alt="材料图片" :src="item">
                    </div>
                    <template v-else>
                        无
                    </template>
                </el-form-item>
                <el-form-item label="反馈时间：" prop="" label-width="120px">
                    {{ editData.feedbackTime || '--' }}
                </el-form-item>
                <el-form-item label="回复：" prop="reply" label-width="120px">
                    <my-custom-editor :content.sync="editData.reply" :disabled="!canEdit" />
                </el-form-item>
                <el-form-item label="处理状态：" prop="status" label-width="120px">
                    <el-radio-group v-model="editData.status">
                        <el-radio label="1">
                            处理中
                        </el-radio>
                        <el-radio label="2">
                            已处理
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div style="width: 800px;text-align: center">
                <el-button @click="clickCancel">
                    关闭
                </el-button>
                <el-button v-permission="'03070102'" type="primary" @click="clickSave">
                    {{ canEdit? '保存' : '编辑' }}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import MyCustomEditor from '@/components/MyCustomEditor.vue';

    let editDataSnapshot = '';
    @Component({
        components: {
            MyCustomEditor
        },
        mixins: []
    })
    export default class extends Vue {
        id = ''; // id
        canEdit = false;
        editData: any = {
            feedbackPerson: '', // 反馈人
            suggestionContent: '', // 意见内容
            images: [], // 图片
            feedbackTime: '', //  反馈时间
            deviceInfo: '', // 设备信息
            reply: '', // 回复
            status: '' // 处理状态
        };

        dataRule: any = {
            reply: [{required: true, message: '请输入回复', trigger: 'blur'}],
            status: [{required: true, message: '请选择状态', trigger: 'change'}]
        };

        mounted() {
            if (!this.$route.query.id || this.$route.query.id === 'undefined') {
                this.$showToast('id不正确');
                return;
            }
            this.id = String(this.$route.query.id);

            this.getData();
        }

        async getData() {
            // 获得数据
            this.$showLoading();
            const [err, resp] = await this.$getAsync('/suggestion/getSuggestionDetail', {
                suggestionId: this.id
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                if (!resp.data) {
                    return;
                }

                this.editData.feedbackPerson = resp.data.userMobile; // 反馈人
                this.editData.feedbackTime = resp.data.createTime || '--'; // 反馈时间
                this.editData.deviceInfo = resp.data.deviceInfo + ' ' + (resp.data.appInfo || ''); // 设备信息
                this.editData.suggestionContent = resp.data.content; // 意见内容
                this.editData.images = (resp.data.suggestionFile || []).map((item: any) => {
                    return item.fileUrl;
                }); // 图片
                this.editData.reply = resp.data.replyContent || ''; // 回复
                this.editData.status = resp.data.status + ''; // 状态
            } else {
                this.$showToast(resp?.message || '数据获取失败');
            }

            // 保存未更改的快照, 用于对比数据是否发生更改
            setTimeout(() => {
                editDataSnapshot = JSON.stringify(this.editData);
            }, 50);
        }

        clickSave() {
            if (!this.canEdit) {
                this.canEdit = true;
                return;
            }
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
                suggestionId: this.id,
                replyContent: this.editData.reply,
                status: this.editData.status
            };
            const [err, resp] = await this.$postAsync('/suggestion/processReply', data, {
                paramType: 'form'
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('保存成功');
                setTimeout(() => {
                    this.$router.back();
                }, 300);
            } else {
                this.$showToast(resp?.message || '保存失败');
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

<style lang="scss" scoped>
    .suggestion-frame {
        border: 1px solid #ccc;
        border-radius: 5px;
        max-width: 500px;
        padding: 10px;
    }

    .images-frame {
        /*border: 1px solid #ccc;*/
        border-radius: 5px;
        padding-top: 10px;
        max-width: 500px;

        img {
            width: 150px;
            height: 120px;
            border-radius: 10px;
            display: inline-block;
            margin-right: 20px;
            object-fit: contain;
            border: 1px solid #ccc;
        }
    }
</style>
