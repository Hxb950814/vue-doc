<template>
    <div>
        <tk-nav-bar>
            {{ questionTitle || '问题' }}
        </tk-nav-bar>
        <div class="container">
            <div v-if="questionListData.length > 0" class="ul-list">
                <template v-for="(item,idx) in questionListData">
                    <div :key="idx" class="problem-item" :class="{active: item.selected}" @click="clickOnProblem(idx)">
                        {{ item.title }}
                    </div>
                    <div :key="idx + 'ppc'" class="content" :class="{show: item.selected}">
                        <div class="main-body" v-html="item.content" />
                    </div>
                </template>
            </div>
            <div v-else>
                <div class="tk-list-nodata">
                    <div class="icon">
                        无相关问题
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {postAsync} from '@/utils/request';

    @Component({
        components: {},
        async asyncData({route}) {
            const [_, resp] = await postAsync('/operate/getProblemList', {
                ArticleCategoryId: route.query.id
            });
            console.log(resp?.data);
            if (resp?.code === '000000') {
                const list: any[] = [];
                const questionTitle = resp.data.problemName;
                (resp?.data?.list || []).forEach((item: any) => {
                    list.push({
                        title: item.title,
                        content: item.content,
                        selected: false
                    });
                });
                return {
                    questionTitle,
                    questionListData: list
                };
            }
        }
    })
    export default class extends Vue {
        questionListData: any[] = [];
        questionTitle = '';

        clickOnProblem(idx: number) {
            // const problem = this.questionListData[idx];
            this.questionListData.forEach((item: any, idx2: number) => {
                if (idx2 === idx) {
                    item.selected = !item.selected;
                } else {
                    item.selected = false;
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
    .problem-item{
        padding: 0 30px;
        height: 90px;
        font-size: 32px;
        line-height: 90px;
        @include thinBorder();
        background-color: #fff;
        position: relative;
        &::before{
            position: absolute;
            left: 0;
            bottom: 0;
            content: '';
            width: 100%;
            height: 1PX;
            transform: scaleY(.5);
            background-color: #eaeaea;
        }
        &::after{
            position: absolute;
            top: 38px;
            right: 5px;
            left: auto;
            content: '';
            @include triangle(30px,#aaa, top);
        }
        &.active::after{
            @include triangle(30px,#aaa);
        }
    }
    /deep/ .content{
        height: 0;
        &.show{
            height: auto;
        }
        background-color: #fff;
        font-size: 30px;
        overflow: hidden;
        position: relative;
        .main-body{
            padding: 30px;
            p,
            strong,
            pre,
            h5,
            u,
            em,
            span{
                line-height: 1.4;
                color: #666;
                font-size: 30px;
            }
            pre{
                line-height: 1.2;
                background-color: #eaeaea;
            }
        }
        &::after{
            position: absolute;
            left: 0;
            bottom: 0;
            content: '';
            width: 100%;
            height: 1PX;
            transform: scaleY(.5);
            background-color: #eaeaea;
        }
    }
</style>
