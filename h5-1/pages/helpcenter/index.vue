<template>
    <div>
        <tk-nav-bar>
            帮助中心
        </tk-nav-bar>
        <div class="container">
            <div class="topban">
                <p class="title">
                    <span class="yellow">弹性K线</span>帮助中心
                </p>
            </div>
            <div class="ul-list">
                <van-cell-group class="normal-menu-list">
                    <van-cell v-for="(item,idx) in questionList" :key="idx" :title="item.name" is-link :url="`/helpcenter/problem_list?id=${item.value}`" />
                </van-cell-group>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {postAsync} from '@/utils/request';

    @Component({
        components: {},
        async asyncData() {
            const [_, resp] = await postAsync('/operate/getHelpList');
            if (resp?.code === '000000') {
                const list: any[] = [];
                (resp?.data || []).forEach((item: any) => {
                    list.push({
                        name: item.name,
                        value: item.value
                    });
                });
                return {
                    questionList: list
                };
            }
        }
    })
    export default class extends Vue {
        questionList: any[] = [];
    }
</script>

<style lang="scss" scoped>
    .topban{
        background: url(https://rs.tanxingk.com/images/help_bg.png) top /100% 100% no-repeat;
        width: 100%;
        height: 180px;
        .title{
            text-align: center;
            font-size: 48px;
            font-weight: bold;
            color: #fff;
            line-height: 70px;
            padding-top: 50px;
            .yellow{
                font-size: 48px;
                color: #ffff63;
            }
        }
    }

    /deep/ .normal-menu-list{
        .van-cell{
            margin-bottom: 0;
            height: 90px;
            padding-top: 0;
            padding-bottom: 0;
        }
        .van-cell__title{
            line-height: 90px;
            font-size: 32px;
        }
        .van-cell__right-icon{
            height: 90px;
            line-height: 90px;
        }
        .van-cell:not(:last-child)::after{
            left: 0;
        }
        .van-cell:last-child::after{
            border: none;
        }
    }
</style>
