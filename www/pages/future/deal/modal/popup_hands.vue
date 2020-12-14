<template>
    <div class="hbb-popup-box">
        <div class="title">
            <p>快捷输入手数</p>
        </div>
        <div class="content">
            <!--价格部分-->
            <div class="price-box">
                <div class="group">
                    <span v-for="(item, index) in handsList" :key="index" :class="index%3 === 0 ? 'first-span': item.type===8?'last-span':''" @click.stop="on_hands_click(item)">
                        {{ item.title }} <b v-if="item.type">仓</b><b v-else>手</b>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { Component, Vue} from 'vue-property-decorator';

    @Component({})
    export default class MyPopupHands extends Vue {

        handsList: any[] = [
            { title: '全', type: 1 },
            { title: '1/2', type: 2 },
            { title: '1/4', type: 4 },
            { title: '10', type: 0 },
            { title: '20', type: 0 },
            { title: '30', type: 0 },
            { title: '40', type: 0 },
            { title: '50', type: 0 },
            { title: '100', type: 0 }
        ]; // 操作价格的弹层 type：0：数字||. 则 仓

        on_hands_click(item: any) {
            // 点击操作区域 type：0：0：数字||. 则 仓
            this.$emit('selectEvent', item);
        };
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
                        width: 33.333%;
                        border-left: 1px solid #ccc;
                        font-size: 14px;
                        color: #333;
                        border-bottom: 1px solid #ccc;
                        &.first-span{
                            font-size: 12px;
                            border-left:0;
                        }
                        b{
                            font-weight: normal;
                        }

                    }
                }
            }
        }
    }
</style>
