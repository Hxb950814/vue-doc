<template>
    <div>
        <div class="hbb-page-footer">
            <div :class="{active: activeIndex === item.id}"
                 v-for="(item,index) in navList" :key="index" @click="goPage(item)">
                <span :class="'footer'+(index+1)"></span>
                <p>{{item.title}}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
        @Prop({type: Number, required: true})
        activeIndex!: number;

        navList: any = [
            {id: 1, title: '主页', path: '/home'},
            {id: 2, title: '求知', path: '/knowledge'},
            {id: 3, title: '我的', path: '/personal'},
        ]; // 导航的数据源

        goPage(item: any) {
            if (this.$route.path === item.path) return false;
            this.$router.push({
                path: item.path
            });
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-page-footer {
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        height: 100px;
        background: #f6f6f6;
        width: 100%;
        left: 0;
        z-index: 50;
        align-items: center;
        padding: 0 60px;
        border-radius: 20px 20px 0px 0px;
        transform-origin: 0% 0% 0px;

        div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            height: 100%;
            color: $base-font-color;
            font-size: 24px;
            padding: 0 20px;

            img {
                width: 40px;
                height: 40px;
                margin-top: 5px;
                border-radius: 10px;
            }

            span{
                width: 40px;
                height: 40px;
                margin-top: 5px;
                border-radius: 10px;
                background-color: #999;
                &.footer1{
                    -webkit-mask: url(../../assets/images/home.svg) center center / contain no-repeat;
                }
                &.footer2{
                    -webkit-mask: url(../../assets/images/qiuzhi.svg) center center / contain no-repeat;
                }
                &.footer3{
                    -webkit-mask: url(../../assets/images/my.svg) center center / contain no-repeat;
                }
            }

            p {
                margin-top: 5px;
            }

            &.active {
                p {
                    color: $color-ff9600;
                }
                span{
                    background-color: $color-ff9600;;
                }
            }
        }
    }
</style>
