<template>
    <div class="hbb-popup-box">
        <div class="title">
            <p>价格最小变动价位：{{ size }}</p>
        </div>
        <div class="content">
            <!--价格部分-->
            <div class="price-box">
                <div class="group">
                    <span v-for="(item, index) in priceList" :key="index" :class="index%5 === 0 ? 'first-span': item.type===8?'last-span':''" @click.stop="on_price_click(item)">
                        <b v-if="item.type !== 2">{{ item.title }}</b>
                        <img v-if="item.type === 2" src="//rs.tanxingk.com/images/delete@3x.png" alt="">
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';

    @Component({})
    export default class PopupPrice extends Vue {
        priceList: any[] = [
            { title: '最新价', type: 1 },
            { title: '1', type: 0 },
            { title: '2', type: 0 },
            { title: '3', type: 0 },
            { title: '', type: 2 },
            { title: '对手价', type: 3 },
            { title: '4', type: 0 },
            { title: '5', type: 0 },
            { title: '6', type: 0 },
            { title: '+', type: 4 },
            { title: '市价', type: 5 },
            { title: '7', type: 0 },
            { title: '8', type: 0 },
            { title: '9', type: 0 },
            { title: '-', type: 6 },
            { title: '排队价', type: 7 },
            { title: '.', type: 0 },
            { title: '0', type: 0 },
            { title: '确认', type: 8 }

        ]; // 操作价格的弹层 type：0：数字||. 1：最新价 2：删除 3：对手价 4：加 5：市价 6：减 7：超一价 8: 确认

        size:number = 0; // 累加的变量值
        setSize(val:number) {
            this.size = val;
        }

        on_price_click(item: any) {
            // 点击操作区域 type：0：数字||. 1：最新价 2：删除 3：对手价 4：加 5：市价 6：减 7：排队价 8: 确认
            switch (item.type) {
                case 0:
                    this.clickCount(item);
                    break;
                case 2:
                    this.clickClear();
                    break;
                case 4:
                    this.clickAdd();
                    break;
                case 6:
                    this.clickReduce();
                    break;
                default:
                    this.clickOther(item);
                    break;
            }
        };

        clickCount(item: any) {
            // 点击数字单元格
            this.$emit('selectEvent', item);
        }

        clickClear() {
            // 点击清空选择的价格
            this.$emit('clearEvent');
        }

        clickAdd() {
            // 点击加号
            this.$emit('addEvent', 1);
        }

        clickReduce() {
            // 点击减号
            this.$emit('reduceEvent', 1);
        }

        clickOther(item:any) {
            // 点击除了 x + - 数字的区域
            this.$emit('otherEvent', item);
        }
    }
</script>
<style lang="scss" scoped>
    .hbb-popup-box{
        display: flex;
        width: 100%;
        flex-direction: column;
        .title{
            display: flex;
            width: 100%;
            height: 30px;
            background: #efefef;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }
        .content{
            display: flex;
            width: 100%;

            .price-box{
                display: flex;
                width: 100%;
                flex-direction: column;
                .group{
                    float: left;
                    width: 100%;
                    border-top: 1px solid #ccc;
                    span{
                        width: 20%;
                        border-left: 1px solid #ccc;
                        font-size: 14px;
                        color: #333;
                        border-bottom: 1px solid #ccc;
                        b{
                            font-weight: normal;
                        }
                        img{
                            width: 20px;
                        }
                        &.first-span{
                            font-size: 12px;
                            border-left:0;
                        }
                        &.last-span{
                            width:40%;
                            background: #299aff;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
</style>
