<template>
    <div class="situation-tabbar">
        <div :class="{'active': activeIndex === 0}" @click="clickOnTab(0)">
            <div class="icon icon1" />
            <span>持仓</span>
        </div>
        <div :class="{'active': activeIndex === 1}" @click="clickOnTab(1)">
            <div class="icon icon2" />
            <span>盘口</span>
        </div>
        <div :class="{'active': activeIndex === 2}" @click="clickOnTab(2)">
            <div class="icon icon3" />
            <span>分时</span>
        </div>
        <div :class="{'active': activeIndex === 3}" @click="clickOnTab(3)">
            <div class="icon icon4" />
            <span>弹K</span>
        </div>
        <div :class="{'active': activeIndex === 4}" @click="clickOnTab(4)">
            <div class="icon icon5" />
            <span>交易</span>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({
    })
    export default class TkSituationTabBar extends Vue {
        @Prop({type: Number, required: true})
        activeIndex!: number;

        clickOnTab(idx: number) {
            if (this.activeIndex === idx) {
                return;
            }
            let targetPath = '';
            switch (idx) {
                case 0:
                    targetPath = '/future/position';
                    break;
                case 1:
                    targetPath = '/future/market';
                    break;
                case 2:
                    targetPath = '/future/trend'; // k綫
                    break;
                case 3:
                    targetPath = '/future/kline'; // k綫
                    break;
                case 4:
                    this.$showToast('功能开发中，敬请期待');
                    return;
            }
            this.$router.push({
                path: targetPath,
                query: {
                    id: this.$route.query.id
                }
            });
        }
    }
</script>

<style lang="scss" scoped>

</style>
