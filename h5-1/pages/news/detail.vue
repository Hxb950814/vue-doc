<template>
    <div>
        <tk-nav-bar>
            弹K资讯
            <template #right />
        </tk-nav-bar>
        <div class="container">
            <div class="main-body">
                <div class="title">
                    {{ title }}
                </div>
                <div class="sub-line">
                    <span class="time">{{ time }}</span>
                    <span class="from">来源：{{ from || '--' }}</span>
                    <span v-for="(tag,idx) in tags" :key="idx" class="tag">{{ tag }}</span>
                </div>
                <div class="content" v-html="content" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {formatTime} from '@common/src/utils/format';
    import {Getter} from 'vuex-class';
    import {postAsync} from '@/utils/request';
    import {setShareConfig} from '@/utils';

    @Component({
        async asyncData({route}) {
            console.log(111);
            const [_, resp] = await postAsync('/operate/findArticleById', {
                articleId: route.query.id + ''
            });
            // console.log(resp.data);
            if (resp?.code === '000000') {
                const data = resp?.data || {};
                const date = new Date(data.publishTime);
                let dateStr = '';
                if (date.getFullYear() === new Date().getFullYear()) {
                    dateStr = formatTime(date, 'MM-dd hh:mm');
                } else {
                    dateStr = formatTime(date, 'yyyy-MM-dd hh:mm');
                }
                return {
                    title: data.title,
                    time: dateStr,
                    from: data.articleFrom,
                    content: data.content,
                    tags: (data.label || '').split(',')
                };
            }
        }
    })
    export default class extends Vue {
        id = '';
        title = '';
        time = '';
        from = '';
        content = '';
        tags: any[] = [];

        @Getter('isInApp')
        isInApp!: boolean

        @Getter('token')
        token!: boolean

        mounted() {
            console.log('是否在app：', this.isInApp);
            console.log('token：', this.token);
            setShareConfig({
                title: this.title,
                desc: '弹性K线，透视量化',
                url: location.origin + location.pathname + location.search
            });
        }
    }
</script>

<style lang="scss" scoped>
    .container {
        background-color: #fff;
    }
    .main-body{
        padding: 35px;
        .title{
            font-weight: bold;
            font-size: 40px;
            line-height: 1.5;
            margin-bottom: 20px;
        }
        .sub-line{
             color: #666;
             margin-bottom: 50px;
             .time{
                 display: inline-block;
                 color: #666;
                 font-size: 24px;
                 margin-right: 20px;
                 line-height: 32px;
             }
             .from{
                 margin-right: 20px;
                 display: inline-block;
                 color: #666;
                 font-size: 24px;
                 line-height: 32px;
             }
             .tag{
                 display: inline-block;
                 color: #333;
                 line-height: 32px;
                 font-size: 22px;
                 background-color: #FFD9D7;
                 margin-right: 16px;
                 padding: 0 5px;
             }
         }
        /deep/ .content{
            p{
                font-size: 28px;
                color: #666;
                line-height: 1.6;
            }
            strong{
                color: #666;
                font-size: 28px;
            }
            img{
                width: 100%;
            }
        }
    }
</style>
