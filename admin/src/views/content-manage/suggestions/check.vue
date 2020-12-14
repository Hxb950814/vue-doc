<!-- 查看意见反馈 -->
<template>
    <div>
        <div class="page-cap-title">
            查看意见反馈
        </div>

        <div class="form-input-area">
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule" disabled>
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
                        <img v-for="(item,index) in editData.images" :key="index" alt="" :src="item">
                    </div>
                    <template v-else>
                        无
                    </template>
                </el-form-item>
                <el-form-item label="反馈时间：" prop="" label-width="120px">
                    {{ editData.feedbackTime || '--' }}
                </el-form-item>
                <el-form-item label="回复：" prop="reply" label-width="120px">
                    <my-custom-editor :content.sync="editData.reply" :disabled="true" />
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
                <el-button @click="clickExit">
                    关闭
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import MyCustomEditor from '@/components/MyCustomEditor.vue';

    const editDataSnapshot = '';
    @Component({
        components: {
            MyCustomEditor
        },
        mixins: []
    })
    export default class extends Vue {
         id = ''; // id
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
                this.editData.images = resp.data.suggestionFile || []; // 图片
                this.editData.reply = resp.data.replyContent; // 回复
                this.editData.status = resp.data.status + ''; // 状态
            } else {
                this.$showToast(resp?.message || '数据获取失败');
            }
        }

         clickExit() {
            this.$router.back();
        }
    }
</script>

<style lang="scss" scoped>
    .suggestion-frame{
        border: 1px solid #ccc;
        background-color: #eee;
        border-radius: 5px;
        max-width: 500px;
        padding: 10px;
    }
    .images-frame{
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        max-width: 500px;
        img{
            width: 200px;
            height: 150px;
            margin-right: 20px;
            object-fit: contain;
        }
    }
</style>
