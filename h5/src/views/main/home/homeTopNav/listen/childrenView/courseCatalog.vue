<template>
    <div>
        <ul class="hbb-ke-ul">
            <li v-for="(item,index) in list" :key="index">
                <div class="l">
                    <p :class="index === currentIndex || id === item.courseListenSectionId ? 'active' : ''">{{index >= 9 ? index+1 : '0' + (index+1)}}.{{item.sectionTitle}}</p>
                    <p>{{item.createTime}} 上架  |  {{['未听', '已听' , '待解锁'][item.status]}}
                        <span v-if="item.status === 2">需要<b>{{item.unlockMoney > 0 ? item.unlockMoney + '喵币' : item.unlockIntegral + '积分'}}</b></span>
                    </p>
                </div>
                <div class="r"  @click="doPlay(item, index)">
                    <span class="t" v-if="item.status !== 2"><b :class="index === currentIndex ? 'active' : ''"></b></span>
                    <span class="b" v-else>解锁</span>
                </div>
            </li>
        </ul>
        <van-dialog v-model="isUnlock" className="hbb-isUnlock"  width="300px" show-cancel-button @confirm="confirmClick">
            <div class="hbb-dialog-content">
                <h2>温馨提示</h2>
                <p>解锁当前内容，需要消耗{{currentValueText}}</p>
                <b>{{currentValue}}</b>
                <p>确定解锁后，不能退回！</p>
            </div>
        </van-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import {HomeModule} from "@/store/modules/user/home";

    @Component({})
    export default class extends Vue {
        @Prop({type: Array, default:[], required: false})
        list!:[];

        currentValue:number = 0;
        currentValueText:string = ''
        currentIndex:number = -1;
        isUnlock:boolean = false;

        id = 0; // 暂存选择的id
        index = -1;

        courseListenSectionId:number = 0; // 当前小节id

        doPlay(item:any, index:number) {
            if(item.status === 2) {
                this.isUnlock = true;
                this.currentValue = item.unlockMoney > 0 ? item.unlockMoney : item.unlockIntegral;
                this.currentValueText = item.unlockMoney > 0 ? '喵币' : '积分'
                this.courseListenSectionId = item.courseListenSectionId;
            } else {
                this.isUnlock = false;
                if(this.currentIndex === index) {
                    this.currentIndex = -1;
                    this.$emit('paseAudioEvent', item)
                    return false;
                }
                if(this.id === item.courseListenSectionId)  {
                    this.$emit('paseAudioEvent', item)
                    this.currentIndex = index;
                    this.index = index;
                    return false;
                }
                this.id = item.courseListenSectionId;
                this.currentIndex = index;
                this.index = index;
                let requestObj = {
                    courseId: 5,
                    courseListenSectionId: item.courseListenSectionId
                };
                HomeModule.getUpdateListenCourseLogById(requestObj).then((res:any) => {});
                this.$emit('showAudioEvent', item)
            }
        }

        confirmClick() {
            let requestObj = {
                courseId: 5,
                sectionId: this.courseListenSectionId
            }
            HomeModule.addCourseUnlock(requestObj).then((res:any) => {
                this.$toast('解锁成功')
                this.$emit('unlockSuccessEvent')
            })
        }
    }
</script>

<style lang="scss">
.hbb-ke-ul{
    display: flex;
    width: 100%;
    padding: 0 30px;
    flex-direction: column;
    li{
        display: flex;
        width: 100%;
        height: 130px;
        justify-content: space-between;
        border-bottom: 2px solid #eee;
        align-items: center;
        .l{
            width: calc(100% - 160px);
            p{
                @include ellipsis(2);
                &:nth-of-type(1){
                    color: $base-font-color;
                    font-size: 28px;
                }
                &:nth-of-type(2){
                    color: $color-gray;
                    font-size: 24px;
                    margin-top: 10px;
                    padding-left: 40px;
                }
                &.active{
                    color: #ffc000;
                }
            }
        }
        .r{
            display: flex;
            width: 160px;
            justify-content: flex-end;
            .t{
                width: 48px;
                height: 48px;
                background: #ffc000;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                b{
                    display: flex;
                    width: 20px;
                    height: 20px;
                    background-color: #fff;
                    -webkit-mask: url(../../../../../../assets/images/y-zhan.svg) center center / contain no-repeat;
                    &.active{
                        -webkit-mask: url(../../../../../../assets/images/y-start.svg) center center / contain no-repeat;
                    }
                }

            }
            .b{
                width: 80px;
                height: 48px;
                border-radius: 6px;
                font-size: 24px;
                color: #fff;
                text-align: center;
                line-height: 48px;
                background-color: #ffc000;
            }
        }
    }
}
.hbb-isUnlock{
    .van-dialog__footer{
        height: 80px;
        .van-button__content{
            height:80px;
            font-size: 32px;
            &:nth-of-type(1){
                border-right: 2px solid #eee;
            }
        }
        .van-dialog__confirm, .van-dialog__confirm:active{
           color: #ff2c27;
            font-weight: bold;
        }
    }
}
.hbb-dialog-content{
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    padding: 50px 0 30px 0;
    *{
        text-align: center;
    }
    h2{
        color: $base-font-color;
        font-size: 32px;
        margin-bottom: 10px;
    }
    p{
        color: $base-font-color;
        font-size: 30px;
        margin-top: 10px;

    }
    b{
        font-size: 80px;
        margin-top: 10px;
        color: $color-ff9600;
    }
}
</style>
