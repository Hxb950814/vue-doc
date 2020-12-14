<template>
    <div>
        <div class="conBox">
            <van-field
                v-model="message"
                rows="15"
                autosize
                style="border: 1px solid #eee"
                type="textarea"
                maxlength="50"
                placeholder="请输入您的意见"
                show-word-limit
            />
        </div>
        <div class="hbb-uploader">
            <van-uploader  v-model="fileList" multiple :after-read="afterRead" />
        </div>
        <div  class="hbb-footer">
            <div class="hbb-vanbutton" @click="sureClick">
                确认提交
            </div>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {

        message = '';
        fileList:any[] = [];

        afterRead(file:any) {
            // 此时可以自行将文件上传至服务器
            console.log(file);
        }

        sureClick() {
            this.$toast({
                forbidClick: true,
                message: '提交中...'
            })
            setTimeout(() => {
                this.$toast({
                    type: 'success',
                    message: '提交成功'
                });
                this.$router.back();
            }, 1000)
        }
    }
</script>

<style lang="scss">
.conBox{
    display: flex;
    width: 100%;
    padding: 30px;

}
.hbb-uploader{
    display: flex;
    width: 100%;
    padding: 30px;
}
    .van-uploader{
        display: flex;
        width: 100%;
        .van-uploader__wrapper,{
            width: 100%;
        }
        .van-uploader__upload,.van-uploader__preview-image{
            width: 200px;
            height: 200px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .van-uploader__preview-delete-icon{
            font-size:32px
        }
        .van-uploader__preview-delete{
            width: 30px;
            height: 30px;
            display: flex;
            right: 0;
            top: 0;
            justify-content: center;
            align-items: center;
        }

    }
    .hbb-footer{
        position: fixed;
        bottom: 0;
        display: flex;
        width: 100%;
        height: 120px;
        justify-content: center;
        border-top: 2px solid #eee;
        padding: 20px 0;
        .hbb-vanbutton{


            width: 80% !important;
            justify-content: center;
            align-items: center;
            font-size: 30px;

            color: #fff;

        }
    }


</style>
