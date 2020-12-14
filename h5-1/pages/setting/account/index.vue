<template>
    <div>
        <tk-nav-bar>账号设置</tk-nav-bar>
        <div class="container">
            <van-cell-group class="normal-menu-list">
                <van-cell title="头像" is-link @click="clickShowUpload">
                    <template>
                        <img class="right-icon" alt="" :src="photo">
                    </template>
                </van-cell>
                <van-cell title="手机号码">
                    <template>
                        <a class="right-text">{{ mobile }}</a>
                    </template>
                </van-cell>
                <van-cell title="交易密码" is-link @click="clickOnTradePassword">
                    <template #title>
                        <span>交易密码</span>
                        <span class="small">用于K豆的主动性消费</span>
                    </template>
                    <template>
                        <a class="right-text">{{ isTradePassword ? '去修改' : '未设置' }}</a>
                    </template>
                </van-cell>
                <van-cell title="登录密码" is-link @click="clickOnLoginPassword">
                    <template #title>
                        <span>登录密码</span>
                        <span class="small">APP密码登录模式</span>
                    </template>
                    <template>
                        <a class="right-text">{{ isPassword ? '去修改' : '未设置' }}</a>
                    </template>
                </van-cell>
                <van-cell title="实名认证" is-link @click="clickOnRealName">
                    <template>
                        <a class="right-text">{{ isReal ? realNameInfo : '未添加' }}</a>
                    </template>
                </van-cell>
            </van-cell-group>
            <van-action-sheet v-model="showHeadPanel"
                              :round="false"
                              title="请操作"
            >
                <van-uploader
                    v-model="headFileList"
                    max-count="1"
                    accept="image/*"
                    :preview-image="false"
                    :after-read="afterHeadRead"
                >
                    <div class="upload-btn">
                        上传文件
                    </div>
                </van-uploader>
            </van-action-sheet>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {postAsync} from '@/utils/request';

    @Component({
        middleware: 'auth',
        components: {},
        async asyncData(context) {
           // console.log(+new Date());
            const [_, resp] = await postAsync('/systemInstall/queryAccountInstallInfo', {});

            if (resp?.code === '000000') {
                const data = resp?.data || {};
                return {
                    mobile: data.mobile,
                    photo: data.photo || 'https://rs.tanxingk.com/images/head.png',
                    isPassword: Number(data.isPassword) === 1,
                    isTradePassword: Number(data.isTradePassword) === 1,
                    isReal: Number(data.isReal) === 1,
                    realNameInfo: data.realNameInfo
                };
            }
        }
    })
    export default class extends Vue {
        currentSkinType = 0; // 1是白色 2是黑色 0是未定
        mobile = '';
        photo = '';
        isPassword = false;
        isTradePassword = false;
        isReal = false;

        headFileList: any[] = [];
        showHeadPanel = false;
        headActions = [
            { name: '选择图片' }
        ];

        mounted() {
            this.currentSkinType = +(localStorage.getItem('currentSkinType') || 1);
        }

        clickShowUpload() {
            this.showHeadPanel = true;
        }

        async onHeadSelect() {

        }

        async afterHeadRead(fileObj: any) {
            console.log(fileObj.file);
            this.showHeadPanel = false;
            this.$showLoading('正在上传...');
            const formData = new FormData();
            formData.append('fileName', fileObj.file);
            const [err, resp1] = await postAsync('/upload/fileBatchUpload', formData, {
                paramType: 'file'
            });
            if (err || (resp1 && resp1.code !== '000000')) {
                this.$closeLoading();
                this.$showToast('上传失败');
                return;
            }
            this.headFileList.length = 0;
            const urlImages = (resp1?.data || []).map((item: any) => {
                return item.fileUrl;
            }).join(',');
            const [err2, resp2] = await postAsync('/systemInstall/updateHeadPhotoInfo', {
                photo: urlImages
            });
            this.$closeLoading();
            if (resp2?.code === '000000') {
                this.$showToast('头像上传成功');
                this.showHeadPanel = false;
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            } else {
                this.$showToast(resp2?.message || '');
            }
        }

        clickTheme(type: number) {
            if (this.currentSkinType === type) {
                return;
            }
            this.currentSkinType = type;
            localStorage.setItem('currentSkinType', String(type));
        }

        clickWait() {
            this.$showToast('功能开发中，敬请期待！');
        }

        clickOnLoginPassword() {
            if (this.isPassword) {
                this.$router.push('/setting/account/modidy_password_check?type=login');
            } else {
                this.$router.push('/setting/account/login_password?mode=' + (this.isPassword ? 'modify' : 'set'));
            }
        }

        clickOnTradePassword() {
            if (this.isPassword) {
                this.$router.push('/setting/account/modidy_password_check?type=trade');
            } else {
                this.$router.push('/setting/account/trade_password?mode=' + (this.isTradePassword ? 'modify' : 'set'));
            }
        }

        clickOnRealName() {
            this.$router.push('/setting/account/realname_auth?mode=' + (this.isReal ? 'modify' : 'set'));
        }
    }
</script>

<style lang="scss" scoped>
    .skin-btn {
        display: inline-block;
        line-height: 60px;
        height: 60px;
        background-color: #eee;
        color: #333;
        font-size: 28px;
        margin-top: 10px;
        padding: 0 10px;
        cursor: pointer;

        &.active {
            background-color: $color-main;
            color: #fff;
        }
    }

    .right-icon{
        width: 80px;
        height: 80px;
        margin-right: 10px;
        background-color: #eaeaea;
        border-radius: 100%;
    }

    /deep/ .van-action-sheet__content{
        text-align: center;
    }
    .van-uploader{
        margin: 0 auto;
    }
    .upload-btn{
        height: 100px;
        line-height: 100px;
        text-align: center;
        display: inline-block;
        font-size: 30px;
        margin: 0 auto;
        width: 200px;
        justify-content: center;
    }
</style>
