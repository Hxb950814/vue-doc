<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script lang="ts" scope>
    import {Component, Vue, Watch, Mixins} from "vue-property-decorator";
    import {setUserInfo} from "@/utils";
    import {HomeModule} from "@/store/modules/user/home";
    import {appweixin} from "@/utils/wechart";
    import config from "@/utils/config";
    @Component({components: {}})
    export default class extends Vue {
        created() {
            if(!HomeModule.getToken){
                setUserInfo();
            }
        }
        mounted() {
            let url = HomeModule.getUId ? config.url + '?abcde=' + HomeModule.getUId : config.url;
            appweixin.onMenuShare({
                title: '求知财堂',
                desc: '认知决定财富',
                link: url,
                show: location.href,
                imgUrl: "https://rs.qiuzhicaitang.com/static/images/qiuzhicaitangicon.png"
            });
        }

    }
</script>

<style lang="scss" scoped>
</style>
