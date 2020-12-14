<template>
    <div>
        <tk-nav-bar>404</tk-nav-bar>
        <div class="container">
            <div v-if="error.statusCode === 404" class="page-404">
                <img src="https://rs.tanxingk.com/images/404.png" alt="404" class="pic">
                <p class="words">
                    抱歉，页面找不到了
                </p>
            </div>
            <h2 v-else>
                500 - 服务器错误
            </h2>
            <div class="theme-button-wrap">
                <button class="theme-button" @click="clickGoHome">
                    返回
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Provide, Prop} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
        @Prop({type: Object, required: true})
        error?: any;

        mounted() {
            // console.log('title', this.error);
        }

        clickGoHome() {
            history.go(-1);
        }
    }
</script>

<style lang="scss" scoped>
    .theme-button-wrap{
        margin: 0 100px;
    }
</style>
