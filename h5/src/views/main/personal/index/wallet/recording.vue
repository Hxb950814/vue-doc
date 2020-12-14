<template>
    <div class="pageBox">
        <div class="hbb-wallet-page">
            <div class="hbb-setting-top">
                <VueScroller ref="myScroll" :requestObj="requestObj" pageMode="6" @getData="getData"
                >
                    <div class="group" v-for="(item,index) in dataList" :key="index" @click="goDetail(item)">
                            <div>
                                <h2 :style="{color: item.status === -1 ? '#999' : '#ff2c27'}">提现 {{item.amount | money}}</h2>
                                <p>提现时间：{{item.createTime}}</p>
                            </div>
                            <div>
                                <h2 v-if="item.status === -1">失败</h2>
                                <h2 v-else>{{['处理中', '处理中', '成功'][item.status]}}</h2>
                                <p>{{item.bankName}}（{{item.bankNo}}）</p>
                            </div>
                    </div>
                </VueScroller>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import VueScroller from "@/components/vantScroll/scrollVue.vue";

    @Component({
        components:{
            VueScroller
        }
    })
    export default class extends Vue {

        dataList:any = [];
        requestObj = {};
        created() {
            this.requestObj = {
                page: 1
            }
        }

        getData(res: any) {
            this.dataList = res;
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-wallet-page{
        .hbb-setting-top{
            display: flex;
            width: 100%;
            flex-direction: column;
            align-items: center;
            .group{
                display: flex;
                width: 100%;
                height: 130px;
                align-items: center;
                background-color: #fff;
                justify-content: space-between;
                border-bottom: 2px solid #eee;
                div{
                    display: flex;
                    flex-direction: column;
                    h2{
                        font-size: 30px;
                        margin-bottom: 10px;
                    }
                    &:nth-of-type(2){
                        justify-content: flex-end;
                        text-align: right;

                        h2{
                            color: #666;
                            font-weight: normal;
                            font-size: 26px;
                        }
                    }
                    p{
                        font-size: 24px;
                        color: #999;
                    }

                }
            }
        }
    }
</style>
