<template>
    <div class="hbb-detail-page">
        <h2 class="title">{{pageData && pageData.title}}</h2>
        <p class="info">
            <span>{{pageData && pageData.publishTime}}</span>
            <span>{{pageData && pageData.articleFrom}}</span>
        </p>
        <div class="con" v-html="pageData && pageData.content">
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import {KnowledgeModule} from "@/store/modules/user/knowledge.ts";

    @Component({
        components:{}
    })
    export default class extends Vue {
        id:string = '';
        pageData:any = {};

        mounted() {
            // 初始化
            this.id = String(this.$route.query.id);
            this.getDetail();
        }

        getDetail() {
            KnowledgeModule.getQueryArticleInfoByIde(this.id).then((res:any) => {
                this.pageData = res?.data || {};
            })
        }
    }
</script>

<style lang="scss">
    .hbb-detail-page{
        padding:30px;
        h2{
            @include ellipsis(2);
            color: #333;
            font-size: 40px;
        }
        .info{
            display: flex;
            width: 100%;
            margin: 30px 0;
            span{
                color: #999;
                font-size: 26px;
                &:nth-of-type(2){
                    color: #009aff;
                    margin-left: 30px;
                }
            }
        }
        .con{
            width: 100%;
            color: #666;
            font-size: 26px;
            line-height: 45px;
            margin-bottom: 100px;
            img{
                width: 100%;
            }
        }
    }
</style>
