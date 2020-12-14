<template>
    <div class="hbb-help-box">
       <div class="help">
           <p style="margin-top: 30px">客服微信： <b @click="copyCon">{{weChartNumber}} <div class="copy"></div></b></p>
           <p>服务时间：工作日9:00-18:30</p>
       </div>
        <div class="hbb-content">
            <VueScroller ref="myScroll" :requestObj="requestObj" pageMode="2" @getData="getData"
            >
                <div class="group" v-for="(item,index) in dataList" :key="index" @click="goDetail(item)">
                    <span>{{item.typeName}}</span>
                    <van-icon name="arrow" size="15" color="rgb(187, 187, 187)"/>
                </div>
            </VueScroller>
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
        weChartNumber = 'qiuzhicaitang';
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

        goDetail(item:any) {
            this.$router.push({
                path: '/personal/help/list',
                query:{
                    id: item.questionTypeId
                }
            })
        }

        copyCon() {
            // 点击复制
            let that = this;
            this.$copyText(this.weChartNumber).then(function (e) {
                that.$toast('复制成功')
            }, function (e) {
                that.$toast('复制失败')
            })
        }

    }
</script>

<style lang="scss" scoped>
.hbb-help-box{
    display: flex;
    width: 100%;
    flex-direction: column;
    .help{
        display: flex;
        width: 100%;
        height: 200px;
        padding-left: 30px;
        background-image: url(../../../../../assets/images/help.jpg);
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        flex-direction: column;
        p{
            display: flex;
            margin-top: 10px;
            font-size: 30px;
            &:nth-of-type(2){
                font-size: 24px;
                color: #666;
            }
            img{
                width: 100%;
            }
        }
        b{
            color: #0a8dff;
            font-size: 26px;
            display: flex;
            align-items: center;
            .copy{
                width: 30px;
                height: 30px;
                background-color: #0a8dff;
                margin-left: 10px;
                -webkit-mask: url(../../../../../assets/images/copy.svg) center center / contain no-repeat;
            }
        }
    }



    .group{
        display: flex;
        width:100%;
        height: 100px;
        align-items: center;
        padding: 0 30px;
        border-bottom: 2px solid #eee;
        justify-content: space-between;
        color: #666;
        font-size: 30px;
        span{
            &:nth-of-type(2){
                color: #0a8dff;
            }
        }
    }
    .hbb-content{
        height: calc(100vh - 200px);
    }
}
</style>
