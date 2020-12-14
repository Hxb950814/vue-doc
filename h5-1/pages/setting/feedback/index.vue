<template>
    <div>
        <tk-nav-bar>意见反馈</tk-nav-bar>

        <div class="container">
            <div class="main-wrapper">
                <van-field
                    v-model="message"
                    class="input-area"
                    rows="10"
                    autosize
                    type="textarea"
                    maxlength="200"
                    placeholder="请输入您的问题，感谢您的反馈"
                    show-word-limit
                />
                <div class="upload-wrap">
                    <van-uploader
                        v-model="fileList"
                        max-count="3"
                        accept="image/*"
                        multiple
                    />
                </div>

                <div class="theme-button-wrap">
                    <button class="theme-button" @click="clickSubmit">
                        提交
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {postAsync} from '@/utils/request';
    import config from '@/utils/config';

    @Component({
        middleware: 'auth',
        components: {},
        async asyncData(context) {
        }
    })
    export default class extends Vue {
        message = '';
        fileList = [];

        mounted() {
        }

        async clickSubmit() {
            // console.log(this.fileList);
            // 校验数据
            if (this.message === '') {
                this.$showToast('请输入留言内容');
                return;
            }
            if (this.message.length < 4) {
                this.$showToast('留言内容太短');
                return;
            }

            const formData = new FormData();
            this.fileList.forEach((item: any) => {
                formData.append('fileName', item.file);
            });
            this.$showLoading('正在提交...');
            const [err, resp1] = await postAsync('/upload/fileBatchUpload', formData, {
                paramType: 'file'
            });
            if (err || (resp1 && resp1.code !== '000000')) {
                this.$closeLoading();
                this.$showToast('提交失败');
                return;
            }
            const urlImages = (resp1?.data || []).map((item: any) => {
                return item.fileUrl;
            }).join(',');

            // 读取文件
            const [_, resp] = await postAsync('/operate/addSuggestion', {
                appVersion: config.version,
                content: this.message,
                deviceInfo: 'h5',
                fileUrl: urlImages
            });
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showMessageBox('温馨提示', '您反馈的内容已经提交<br><span class="sub">感谢您的支持</span>').catch(() => {
                });
                // 清空数据
                this.message = '';
                this.fileList = [];
            } else {
                this.$showToast(resp?.message || '');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container{
        background-color: #fff;
    }
    .main-wrapper{
        padding: 25px;
    }
    /deep/ .input-area{
        padding: 0;
    }

    .upload-wrap{
        margin-top: 20px;
    }
</style>
