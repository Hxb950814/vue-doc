<template>
    <div style="width: 100%">
        <div class="clock-in-nav">
            <div  v-for="(item, index) in list" :key="index" :class="{
                active: item.isNowDate === '1',
                sign: item.isSign === 1,
                isSign: item.isSign === 0,
                isGet: item.isGet === 1,
                wellGet: item.wellGet === 1 && item.isSign === 1
            }" @click="itemClick(item)">
                <template v-if="item.day > day && item.month >= month  && item.year >= year">
                    <span v-if="item.wellGet !== 1">{{item.day}}</span>
                </template>
                <template v-else>
                    <span v-if="item.isGet !== 1">{{item.day}}</span>
                </template>
                <img v-if="item.wellGet === 1 || item.isGet === 1" width="20px" height="20px" src="@assets/images/lihe.png" alt="">
                <!--    判断未签到出来的条件   -->
                <img class="img-a" v-if="item.isSign === 0 && item.day < day  && item.month <= month  && item.year <= year" src="@assets/images/wei.png" alt="">
                <img class="img-a" v-if="item.isSign === 0 && item.day > day  && item.month < month  && item.year <= year" src="@assets/images/wei.png" alt="">
                <!--    判断未签到出来的条件   -->
                <img class="img-a" v-if="item.isSign === 1" src="@assets/images/dui.png" alt="">
            </div>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
        @Prop({type:Array, default:[], required:false})
        list!:[];
        @Prop({type:Number, default:0, required:false})
        year!:number;
        @Prop({type:Number, default:0, required:false})
        month!:number;
        @Prop({type:Number, default:0, required:false})
        day!:number;

        itemClick(item:any) {
            // 点击进行补卡
            return false;
            if(item.isSign === 0 && item.day < this.day  && item.month <= this.month  && item.year <= this.year) {
                this.$emit('clockInEvent', item)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .clock-in-nav{
        display: flex;
        width: 100%;
        justify-content: space-between;
        padding: 0 30px;
        div{
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            position: relative;
            background: #f2f2f2;
            &.active{
                background: #ff2c27;
                color: #fff;
            }
            &.isSign{
                .img-a{
                    width: 30px;
                    position: absolute;
                    bottom: -5px;
                    right: 0;
                }
            }
            &.sign{
                .img-a{
                    width: 30px;
                    position: absolute;
                    bottom: -5px;
                    right: 0;
                }
            }
            &.isGet{
                background: #FE8848;
            }
            &.wellGet{
                background: #FE8848;
            }
        }
    }
</style>
