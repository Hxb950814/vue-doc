<template>
    <div>
        <div class="hbb-content">
            <VueScroller ref="myScroll" :requestObj="requestObj" pageMode="3" @getData="getData"
            >
                <van-collapse v-model="activeNames" accordion>
                    <van-collapse-item v-for="(item,index) in dataList" :key="index" :title="item.questionName" :name="String(item.questionId)">
                        <DetailView :questionId="item.questionId"></DetailView>
                    </van-collapse-item>
                </van-collapse>
            </VueScroller>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import VueScroller from "@/components/vantScroll/scrollVue.vue";
    import DetailView from "./detail.vue";
    import {tabIndexFn} from "@/utils";
    @Component({
        components:{
            VueScroller,
            DetailView
        }
    })
    export default class extends Vue {
        activeNames:any = ['1'];

        dataList:any = [];

        requestObj = {};

        created() {
            this.requestObj = {
                page: 1,
                questionTypeId: this.$route.query.id
            }
        }

        mounted() {
            // 处理体验问题
            this.$nextTick(() => {

            })
        }

        getData(res: any) {
            this.dataList = res;
            tabIndexFn('van-collapse-item__title');

        }

    }
</script>

<style lang="scss" scoped>
.hbb-content{
    height: 100vh;
}
</style>
