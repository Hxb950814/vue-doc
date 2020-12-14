<!-- 行情种类 -->
<template>
    <div>
        <div v-if="dataDayList.length>0" class="hbb-box">
            <div class="hbb-group">
                <div class="left">
                    凌晨
                </div>
                <div class="right">
                    {{ dataDayList[0] && dataDayList[0].nightAmStart }} - {{ dataDayList[0] && dataDayList[0].nightAmEnd }}
                </div>
            </div>
            <div class="hbb-group">
                <div class="left">
                    上午
                </div>
                <div class="right">
                    {{ dataDayList[0] && dataDayList[0].dayAmStart }} - {{ dataDayList[0] && dataDayList[0].dayAmEnd }}
                </div>
            </div>
            <div class="hbb-group">
                <div class="left">
                    下午
                </div>
                <div class="right">
                    {{ dataDayList[0] && dataDayList[0].dayPmStart }} - {{ dataDayList[0] && dataDayList[0].dayPmEnd }}
                </div>
            </div>
            <div class="hbb-group">
                <div class="left">
                    晚上
                </div>
                <div class="right">
                    {{ dataDayList[0] && dataDayList[0].nightPmStart }} - {{ dataDayList[0] && dataDayList[0].nightPmEnd }}
                </div>
            </div>
        </div>
        <div v-else class="hbb-noData">
            暂无数据
        </div>
        <p v-if="notice !== '成功'" class="hbb-desc">
            注意：{{ notice }}
        </p>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins, Prop} from 'vue-property-decorator';

    @Component({
        components: {}
    })
    export default class extends Vue {
        @Prop({type: Array, default: [], required: false})
        dataDayList!: any[]; // 交易所交易数据源

        @Prop({type: String, default: '', required: false})
        notice!:string; // 交易所交易数据源 描述

        mounted() {
            console.log(this.dataDayList);
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-box{
        border: 1px solid #ddd;
        border-bottom: 0;
        &>.hbb-group{
            display: flex;
            align-items: center;
            border-bottom: 1px solid #ddd;
            box-sizing: border-box;
            padding: 0;
            &>.left{
                width: 170px;
                height: 35px;
                line-height: 35px;
                border-right: 1px solid #ddd;
                padding-left: 10px;
                color: #666;
            }
            &>.right{
                width: calc(100% - 170px);
                height: 35px;
                line-height: 35px;
                padding-left: 10px;

            }
        }
    }
    .hbb-noData{
        display: flex;
        width: 100%;
        height: 150px;
        align-items: center;
        border: 1px solid #ddd;
        color: #cccccc;
        justify-content: center;
    }
    .hbb-desc{
        display: flex;
        width: 100%;
        margin-top: 30px;
        justify-content: center;
        color: #0ca2ff;
    }
</style>
