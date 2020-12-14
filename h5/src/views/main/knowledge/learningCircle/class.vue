<template>
    <div class="hbb-class-page">
        <div class="group" v-for='(item, index) in navList' :key='index'  @click="itemClick(item)">
            <span>
                <img v-if="item.courseId === 1" src="@assets/images/k-pic1.png" alt="">
                <img v-if="item.courseId === 2" src="@assets/images/k-pic2.png" alt="">
                <img v-if="item.courseId === 3" src="@assets/images/k-pic3.png" alt="">
                <img v-if="item.courseId === 4" src="@assets/images/k-pic4.png" alt="">
                {{item.className}}
            </span>
            <span>
                班主任：<b>{{item.nickName}}</b>
            </span>
            <span :class="item.status === '已毕业' ? 'end' : 'start'">{{item.status}}</span :>
        </div>
        <!--   查看班主任的个人微信     -->
        <van-dialog width="280px" v-model="headTeacherState" :show-confirm-button="false">
            <div class="hbb-geren-top">
                <div class="hbb-close" @click="headTeacherState = false"><van-icon name="cross" /></div>
                <span>班主任微信号：<b @click="copyCon">{{weChartNumber}} <div class="copy"></div></b></span>
            </div>
            <div class="hbb-geren-con">
                <img :src="currentWechartImg" alt="">
                <p>长按二维码识别添加班主任微信</p>
            </div>
        </van-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {KnowledgeModule} from "@/store/modules/user/knowledge";

    @Component({
        components:{}
    })
    export default class extends Vue {
        couponCurrent = 1;
        navList:any[] = [];
        headTeacherState = false;
        currentWechartImg = '';
        weChartNumber = '';

        mounted() {
            KnowledgeModule.getmyClassList().then((res:any) => {
                this.navList = res?.data || [];
            })
        }

        itemClick(item:any) {
            if(item.status === '已毕业') {
                this.$toast('此班已经结业');
                return false;
            }
            this.headTeacherState = true;
            this.currentWechartImg = item.wechatCode;
            this.weChartNumber = item.wechatNo;
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

<style lang="scss">
.hbb-class-page{
  display: flex;
  width: 100%;
  flex-direction: column;
  .group{
      display: flex;
      justify-content: space-between;
      height: 110px;
      align-items: center;
       padding: 0 30px;
       border-bottom: 2px solid #eee;
      span{

          display: flex;
          align-items: center;
          font-size: 26px;

          img{
            width: 50px;
            height: 50px;
            margin-right: 20px;
          }
          &.end{
              color: #666;
          }
          &.start{
              color: #0a8dff;
          }
          b{
              color: rgb(10, 141, 255);
              font-weight: normal;
          }
      }
  }
    .hbb-geren-top{
        display: flex;
        width: 100%;
        height: 160px;
        background: url(../../../../assets/images/gerenBG.jpg);

        font-size: 30px;
        span{
            display: flex;
            width: 100%;
            justify-content: center;
            align-items: center;
        }
        b{
            color: #0a8dff;
            display: flex;
            align-items: center;
            .copy{
                width: 30px;
                height: 30px;
                background-color: #0a8dff;
                margin-left: 10px;
                -webkit-mask: url(../../../../assets/images/copy.svg) center center / contain no-repeat;
            }
        }
    }
    .hbb-geren-con{
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        text-align: center;
        margin: 40px 0;
        *{
            width: 300px;
            margin: 10px auto;
            color: $color-gray;
            font-size: 26px;
        }
    }
}
</style>
