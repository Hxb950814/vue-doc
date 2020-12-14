<template>
    <div class="pageBox">
        <div class="hbb-setting-top">
            <div class="group">
                <span>联系人</span>
                <van-field style="width: 100%" v-model="name" placeholder="姓名" />
            </div>
            <div class="group">
                <span></span>
                <div class="sex">
                    <b :class="sex === '0' ? 'active' : ''"  @click="setSex(0)">先生</b>
                    <b :class="sex === '1' ? 'active' : ''"   @click="setSex(1)">女士</b>
                </div>
            </div>
            <div class="group">
                <span>电话</span>
                <van-field style="width: 100%"  v-model="mobile" placeholder="手机号码" />
            </div>
            <div class="group">
                <span>地址</span>
                <van-field style="width: 100%" rows="1" autosize v-model="addressDetail" type="textarea" placeholder="请输入地址" />
            </div>
            <div class="group">
                <span>设为默认</span>
                <van-switch size="20px" active-color="#07c160" inactive-color="#ccc" v-model="isDefault" />
            </div>
        </div>
        <p class="hbb-tip">为确保地址正确，请详细填写收货地址</p>
        <div class="hbb-vanbutton" @click="sureClick">
            确定
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {PersonalModule} from "@/store/modules/user/personal";

    @Component({})
    export default class extends Vue {
        id = '';
        did = '';
        addressDetail = '';
        mobile = '';
        name = '';
        sex  = '0';
        isDefault = false;
        pageMode = '';

        mounted() {
            this.id = String(this.$route.query.id);
            // 取得来源页面
            this.pageMode = this.$route.query.page ? String(this.$route.query.page) : '';
            if(this.pageMode) {
                this.did = this.$route.query.did ? String(this.$route.query.did) : '';
            }
            // id 0 代表新增地址 则  代表编辑地址
            if(this.id === '0') {
                PersonalModule.getUserMoblie().then((res:any) => {
                    this.name = res?.data.realityName;
                    this.mobile = res?.data.mobile;
                })
            } else {
                let requestObj = {
                    addressId: this.id
                }
                PersonalModule.getaddressDetail(requestObj).then((res:any) => {
                    this.addressDetail = res?.data.addressDetail;
                    this.mobile = res?.data.mobile;
                    this.name = res?.data.name;
                    this.sex = String(res?.data.sex);
                    this.isDefault = res?.data.isDefault;
                })

            }
        }

        setSex(t:number) {
            this.sex = String(t);
        }

        sureClick() {
            this.$toast({
                forbidClick: true,
                message: '提交中...'
            })
            let requestObj = {
                addressId: this.id,
                addressDetail: this.addressDetail,
                mobile: this.mobile,
                name: this.name,
                sex: this.sex,
                isDefault: this.isDefault
            }
            if(this.id === '0') {
                delete requestObj.addressId
            }
            PersonalModule.addAddressDetail(requestObj).then((res:any) => {
                this.$toast({
                    type: 'success',
                    message: '保存成功'
                });
                this.$router.back();
            }).catch((err:any) => {
                this.$toast('保存失败');
            })
        }
    }
</script>

<style lang="scss" scoped>
    .pageBox{
        background-color: #f6f6f6;
    }
    .hbb-setting-top{
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        background-color: #fff;
       .group {
            display: flex;
            width: 100%;
            min-height: 100px;
            align-items: center;
            justify-content: space-between;
            padding: 0 30px;
            border-bottom: 2px solid #eee;

            span {
                font-size: 30px;
                color: #333;
                width: 160px;
                display: flex;
                align-items: center;
            }
           .sex{
               width: calc(100% - 100px);
               display: flex;
               b{
                   display: flex;
                   margin-right: 16px;
                   width: 108px;
                   align-items: center;
                   justify-content: center;
                   height: 52px;
                   font-size: 24px;
                   color: #666;
                   border-radius: 8px;
                   border: 2px solid #eee;
                   &.active{
                       border: 2px solid #ff2c27;
                       color: #ff2c27;
                   }
               }
           }
        }
    }
    .hbb-tip{
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        font-size: 26px;
        color: #999;
        margin-top: 40px;
        font-weight: bold;
    }
    .hbb-vanbutton{
        display: flex;
        width: 80% !important;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        color: #fff;
        margin: 40px auto;
    }
</style>
