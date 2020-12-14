<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts" scope>
    import {Component, Vue, Watch, Mixins} from "vue-property-decorator";
    import {HomeModule} from "@/store/modules/user/home";
    import {setUserInfo, getParameter, funcUrlDel} from "@/utils";

    @Component({components: {}})
    export default class extends Vue {
        created() {
            if(!HomeModule.getToken){
                setUserInfo();
            }
        }
        mounted() {

            // 判断如果没有从缓存读取到当前用户的id 直接删除缓存数据  让用户冲新区登录
            if(!HomeModule.getUId) {
                localStorage.removeItem('vuexPersistedData')
            }

            // 网站所有页面带上邀请者id  通用
            if(getParameter('abcde')) {
                let str = String(getParameter('abcde'));
                localStorage.setItem('abcde', str)
            } else {
                localStorage.setItem('abcde', '')
            }
        }
    }
</script>

<style lang="scss"></style>
