<template>
    <div class="pageBox">
        <div class="hbb-my-integral">
            <div class="p-top">
                <div class="top">
                    <div>
                        <span>当前积分：{{pointBalance}}</span>
                    </div>
                </div>
            </div>
            <div class="p-content">
               <div class="hbb-group-box">
                   <van-collapse v-model="activeName" accordion @change="groupChange">
                       <van-collapse-item v-for="(item,index) in mounthList" :key="index"  :name="index +''">
                           <template #title>
                               <div  class="van-top">
                                   <h2>{{item.ctime}}月</h2>
                                   <p>获取 <b>{{item.samount}}</b></p>
                                   <span>使用 {{item.zamount}}</span>
                               </div>
                           </template>
                           <div class="group-con" v-for="(it,i) in dataList" :key="i">
                                <div>
                                    <h3>{{it.operationName}}</h3>
                                    <p>{{it.createTime}}</p>
                                </div>
                               <div>
                                   <p :class="it.type === 0 ? 'a' : ''">{{it.type === 0 ? '+' : '-'}}{{it.amount}}</p>
                               </div>
                           </div>
                       </van-collapse-item>
                   </van-collapse>
               </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {PersonalModule} from "@/store/modules/user/personal";
    import {tabIndexFn} from '@/utils/index.ts';
    @Component({})
    export default class extends Vue {
        pointBalance = '';
        activeName= '0';
        mounthList:any[] =[];
        dataList:any[] =[];

        mounted() {
            this.getMounth();
            PersonalModule.getScoreByUserId().then((res:any) => {
                this.pointBalance = res?.data?.pointBalance || 0;
            })
        }

        getMounth() {
            PersonalModule.getScoreRecordByMouthList().then((res:any) => {
                this.mounthList = res?.data?.result || [];
                this.getData();
            })
        }

        groupChange(v:any) {
            if(!v) return false;
            let obj = this.mounthList[v];
            let requestObj = {
                dateTime: obj.ctime
            };
            PersonalModule.getScoreRecordByMouthDetailList(requestObj).then((res:any) => {
                this.dataList = res?.data?.result || [];
            })
        }

        getData() {
            let obj = this.mounthList[0];
            let requestObj = {
                dateTime: obj.ctime
            };
            PersonalModule.getScoreRecordByMouthDetailList(requestObj).then((res:any) => {
                console.log(res)
                this.dataList = res?.data?.result || [];
            })
        }
    }
</script>

<style lang="scss" scoped>
    .pageBox{
        background: #f6f6f6;
    }
    .hbb-my-integral{
        display: flex;
        width: 100%;
        flex-direction: column;
        .p-top{
            display: flex;
            width: 100%;
            position: relative;
            height: 236px;
            flex-direction: column;
            padding:40px 10px 30px 30px;
            background:linear-gradient(to right, #0085ff 0%, #00afff 100%);
            .top{
                display: flex;
                width: 100%;
                justify-content: space-between;
                height: 80px;
                div{
                    display: flex;
                    align-items: center;

                    font-size: 26px;
                    color: #fff;
                    img{
                        width: 60px;
                        height: 60px;
                        margin-right: 10px;
                        border-radius: 50%;
                    }
                }
            }

        }

        .p-content{
            display: flex;
            width:100%;
            padding:15px 30px;
            flex-direction: column;
            position: relative;
            z-index: 5;
            margin-top: -40px;
            .hbb-group-box{
                display: flex;
                width: 100%;
                flex-direction: column;
                background: #fff;
                margin-top: -20px;
                padding: 10px 0;
                border-radius: 12px;
                .van-top{
                    display: flex;
                    width: 100%;
                    height: auto;
                    h2{
                        font-size: 32px;
                        color: #333;
                    }
                    p{
                        font-size: 28px;
                        margin: 0 20px;
                        color: #333;
                        b{
                            font-size: 28px;
                            color: #ff2c27;
                            font-weight: normal;
                        }
                    }
                    span{
                        font-size: 28px;
                        color: #999;
                    }
                }
                .group-con{
                    display: flex;
                    width: 100%;
                    height: 120px;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid #eee;
                    &:last-child{
                        border-bottom: none;
                    }
                    h3{
                        font-size: 30px;
                        color: #333;
                        margin: 5px 0;
                        font-weight: normal;
                    }
                    p{
                        font-size: 26px;
                        color: #999;
                        &.a{
                            color: #ff2c27;
                        }
                    }
                }
            }
        }
    }
</style>
