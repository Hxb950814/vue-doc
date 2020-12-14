<template>
    <div>
        <div class="hbb-index-nav">
            <div v-for="(item, index) in navList" :key="index" @click="goPage(item)">
                <img :src="item.src" alt=""/>
                <p :class="page === 'my' ? 'p': ''">{{ item.title }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {HomeModule} from "@/store/modules/user/home";
    import config from "@/utils/config";
    import {designatedSite} from "@/utils";

    @Component({})
    export default class extends Vue {
        @Prop({ type: Array, default: [], required: false })
        navList!: [];
        @Prop({ type: String, default: '', required: false })
        page!:string;

        goPage(item:any) {
            // 跳转路由页面
          if(item.path === '') {
            this.$toast('敬请期待！')
            return false;
            }
            // power:0 无权限 并且是在我没有登录前提下
            if(HomeModule.getToken || item.power === 0){
                // 登录了或者后台没有配置icon权限
                this.$nextTick(()=> {
                    // this.$router.push({
                    //     path: item.path
                    // });
                    window.location.href = item.path;
                })
            } else {
                if(designatedSite(item.path)) {
                    location.href=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appId}&redirect_uri=${encodeURIComponent(item.path)}&response_type=code&scope=snsapi_userinfo&state=STATE`;
                    return false;
                } else {
                    window.location.href = item.path;
                    return false
                }
            }

        }
    }
</script>

<style lang="scss" scoped>
    .hbb-index-nav {
        display: flex;
        width: 100%;
        margin-top: 20px;

        div {
            width: 25%;
            float: left;
            text-align: center;

            p {
                color: $base-font-color;
                font-size: 26px;
                &.p{
                    color: #fff;
                }
            }

            img {
                width: 75px;
                height: 75px;
                margin: 10px auto;
            }
        }
    }
</style>
