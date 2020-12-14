<template>
    <div class="my-image-upload">
        <el-upload
            v-loading="isLoading"
            action="/api/upload/fileUpload"
            class="avatar-uploader"
            name="fileName"
            :headers="{'manageToken': token}"
            :class="{disabled : disabled}"
            accept="image/jpg,image/jpeg,image/png,image/gif"
            :disabled="url !== '' || disabled"
            :show-file-list="false"
            :before-upload="uploadBefore"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-remove="uploadRemove"
        >
            <span v-if="url" class="del" @click.stop="delUploadPicture">删除</span>
            <img v-if="url" :src="url" class="avatar" @click="onUploadPreview">
            <i v-if="!url && !isLoading" class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
    </div>
</template>

<script lang="ts">
    import {Component, Provide, Prop, Watch, Vue} from 'vue-property-decorator';
    import {Getter} from 'vuex-class';

    @Component
    export default class MyImageUpload extends Vue {
        // 指定服在服务器存放的文件夹
        @Prop({type: String, default: '', required: false})
        serverDir?: string;

        // 服务器图片链接，默认为‘’
        @Prop({type: String, default: '', required: false})
        url?: string;

        // 最大的尺寸，默认20MB
        @Prop({type: Number, default: 20, required: false})
        maxSize?: number;

        // 最大的尺寸，默认20MB
        @Prop({type: Boolean, default: false, required: false})
        disabled?: boolean;

        // 点击图片是否显示图片预览详情
        @Prop({type: Boolean, default: true, required: false})
        showPicPreview?: boolean;

        //  限制宽高 比如‘>100*100’, ‘<100*100’,‘=200*200’
        @Prop({type: String, default: '', required: false})
        limitRect?: string;

        // dialogVisible = false;
        // dialogImageUrl = false;
        isLoading = false;

        @Getter('token')
        token?: string;

        mounted() {
            if (this.url === null) {
                console.log('警告: MyImageUpload组件参数[url]不能为null');
            }
        }

        //  async uploadOss(file: any) {
        //     // debugger
        //     // 判断扩展名
        //     const fileName = file.file.name;
        //     // const uid = file.file.uid;
        //     const tmpcnt = fileName.lastIndexOf('.');
        //     // const fileNameBody = fileName.slice(0, tmpcnt);
        //     let exname = fileName.substring(tmpcnt + 1);
        //     exname = exname.toLowerCase();
        //     let dirPath = '';
        //     // 指定了文件夹就用文件夹
        //     if (!this.serverDir) {
        //         dirPath = 'pic';
        //     } else {
        //         dirPath = this.serverDir;
        //     }
        //     const fileNameStore = dirPath + '/' + Date.now() + (Math.floor(Math.random() * 10000)) + '.' + exname;
        //
        //     // api.getOssInfo().then(res => {
        //     //     if (res.code != 0) {
        //     //         console.log('获取oss信息失败');
        //     //         return;
        //     //     }
        //     //     const ossConf = res.data;
        //     //     if (ossConf.accessKeyId == '' || ossConf.accessKeySecret == '' ||
        //     //         ossConf.accessKeySecret == '' || ossConf.accessKeySecret == '') {
        //     //         console.error('获取oss信息有错误', ossConf);
        //     //     }
        //     //
        //     //     let client = new OSS(ossConf);
        //     //     client.multipartUpload(fileNameStore, file.file, {
        //     //         progress: function (p) { // 获取进度条的值
        //     //             // console.log(p);
        //     //             // that.progress = p * 100;
        //     //         }
        //     //     }).then(result => {
        //     //         const url = `http://rs.jinxianghuangjin.com/${fileNameStore}`;
        //     //         this.uploadSuccess({
        //     //             data: url
        //     //         }, {
        //     //             raw: file.file
        //     //         });
        //     //     }).catch(() => {
        //     //         this.uploadError();
        //     //     });
        //     // }, () => {
        //     //     this.isLoading = false;
        //     //     // console.log('获取oss信息失败2');
        //     // });
        //     // const [err, resp] = await this.$postAsync('/upload/fileUpload', {fileName : file.file},{
        //     //     paramType: 'file'
        //     // });
        //     // console.log(err);
        // }

        uploadSuccess(res: any, file: any) {
            // this.url = res.data.fileUrl;
            this.$emit('update:url', res.data.fileUrl);
            this.isLoading = false;
            this.$emit('uploadSuccess', res); // 通知父页面
        }

        uploadError() {
            this.isLoading = false;
            this.$showToast('图片上传失败');
            // this.$emit('imageUploadStatusChange', {
            //     errCode: 1,
            //     id: this.id,
            //     errMsg: '图片上传失败'
            // });
        }

        uploadRemove() {

        }

        uploadBefore(file: any) {
            const limit = this.limitRect || '';
            if (limit === '') {
                return true;
            }
            const prefix = limit[0];
            const realStr = limit.slice(1);
            const wh = realStr.split('*');
            const w = parseInt(wh?.[0]) || 0;
            const h = parseInt(wh?.[1]) || 0;
            console.log(prefix, w, h);
            return new Promise((resolve, reject) => {
                // resolve();
                const isValidType = file.type === 'image/png' ||
                    file.type === 'image/jpeg' ||
                    file.type === 'image/jpg' ||
                    file.type === 'image/gif' ||
                    file.type === 'image/webp';
                const isLt2M = file.size / 1024 / 1024 < (this.maxSize || 20); // 默认必须小于20M
                if (!isValidType) {
                    this.$showToast('请上传图片类型文件');
                    return Promise.reject();
                }
                if (!isLt2M) {
                    this.$showToast(`上传的图片大小不能超过${this.maxSize}MB`);
                    return Promise.reject();
                }
                if (w > 0 || h > 0) {
                    const img = new Image();
                    img.onload = () => {
                        let valid = false;
                        let errStr = '';
                        if (prefix === '=') {
                            valid = img.width === w && img.height === h;
                            errStr = `上传图片的尺寸必须是${w}×${h}`;
                        } else if (prefix === '<') {
                            valid = img.width < w && img.height < h;
                            errStr = `上传图片的尺寸必须小于${w}×${h}`;
                        } else if (prefix === '>') {
                            valid = img.width > w && img.height > h;
                            errStr = `上传图片的尺寸必须大于${w}×${h}`;
                        }
                        valid ? resolve() : reject(errStr);
                    };
                    img.src = (window.URL || window.webkitURL).createObjectURL(file);
                } else {
                    resolve();
                }
            }).then(() => {
                this.isLoading = true;
                return file;
            }, (errStr) => {
                this.$showToast(errStr);
                return Promise.reject();
            });
        }

        delUploadPicture() {
            if (this.disabled) {
                return;
            }
            this.$emit('update:url', '');
            this.$emit('uploadRemove');
        }

        onUploadPreview() {
            if (this.showPicPreview === false) {

            }
            // this.$alert(`<div class="custom-imgwrap"><img src="${this.url}" alt="没有预览"/></div>`, '查看', {
            //     dangerouslyUseHTMLString: true,
            //     customClass: 'image-preview',
            //     center: true
            // });
        }
    }
</script>

<style>
</style>
