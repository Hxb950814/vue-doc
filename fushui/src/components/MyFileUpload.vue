<template>
    <div class="my-file-upload">
        <el-upload
            ref="uploadFile"
            action="/api/upload/fileUpload"
            :class="{disabled: disabled || fileUploaded}"
            name="fileName"
            :headers="{'manageToken': token}"
            :on-success="uploadSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :before-upload="beforeUpload"
            :accept="accept"
            :show-file-list="false"
            :limit="maxFileNumber"
            :on-exceed="handleExceed"
        >
            <el-button
                size="small"
                type="primary"
                class="up-btn"
                :class="{disabled : disabled}"
                @click="clickStop($event)"
            >
                {{ btnText }}
            </el-button>
            <div slot="tip" class="el-upload__tip">
                {{ tips }}
            </div>
        </el-upload>
        <div v-if="url !== ''" class="filelist-panel">
            <span class="name" @click.stop="preview">{{ fileName || '--' }}</span>
            <i class="icon el-icon-circle-close" @click.stop="removeFile" />
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Getter} from 'vuex-class';

    @Component
    export default class MyFileUpload extends Vue {
        // 接受类型
        @Prop({type: String, default: '', required: false})
        private accept?: string;

        // 文件最多数量
        @Prop({type: Number, default: 1, required: false})
        private maxFileNumber!: number;

        // 文件最大的尺寸，单位为MB，默认10MB
        @Prop({type: Number, default: 50, required: false})
        private maxSize?: number | string;

        // tips
        @Prop({type: String, default: '', required: false})
        private tips?: string;

        // 按钮文字
        @Prop({type: String, default: '点击上传', required: false})
        private btnText?: string;

        // 是否有效false=true 无效
        @Prop({type: Boolean, default: false, required: false})
        private disabled?: boolean;

        // 点击图片是否显示图片预览详情
        @Prop({type: String, default: '', required: true})
        private url!: string;

        fileName = '';
        fileUploaded = false; // 是否有上传的文件

        @Getter('token')
        token?: string;

        @Watch('url')
        onUrlChange(val: string) {
            if (!val) {
                this.fileUploaded = false;
                this.fileName = '';
                (this.$refs.uploadFile as any).clearFiles();
            } else {
                this.fileUploaded = true;
            }
        }

        mounted() {
            if (this.url) {
                // fileName
            }
            // this.fileUploaded = Boolean(this.disabled);
        }

        private clickStop(e: any) {
            if (this.disabled) {
                e.stopPropagation(); // 阻止冒泡
            }
        }

        private uploadSuccess(res: any, data: any) {
            const url = res.data.fileUrl;
            this.fileName = data.name;
            if (url !== '') {
                this.fileUploaded = true;
                this.$emit('update:disabled', true);
            }
            this.$emit('update:url', url);
        }

        private uploadError() {
            this.$message.error('上传失败');
        }

        private handleRemove(file: any, fileList: any[]) {
            // const uid = file.uid;
            // let index = -1;
            // this.fileList.find((item: any, idx: number) => {
            //     if (item.uid === uid) {
            //         index = idx;
            //     }
            // });
            // if (index >= 0) {
            //     this.fileList.splice(index, 1);
            // }
            // if (this.fileList.length < (this.maxFileNumber || 50)) {
            //     // this.disabled = false;
            //     this.$emit('update:disabled', true);
            // }
            // this.$emit('update:fileList', this.fileList);
        }

        private handlePreview(file: any) {
            window.open(file.url, '_blank');
        }

        private preview() {
            window.open(this.url, '_blank');
        }

        private handleExceed(files: any, fileList: any[]) {
            this.$message.warning(`只能选择 ${this.maxFileNumber} 个文件`);
        }

        private beforeUpload(file: any) {
            // console.log('上传之前', file);
            const isLt2M = file.size / 1024 / 1024 < (this.maxSize || 50);
            if (!isLt2M) {
                this.$message.error(`上传的文件大小不能超过${this.maxSize}MB`);
                return false;
            }
            return true;
        }

        private beforeRemove() {
            return true;
        }

        private removeFile() {
            this.fileName = '';
            this.$emit('update:url', '');
            this.fileUploaded = false;
            this.$emit('update:disabled', false);
        }
    }
</script>
