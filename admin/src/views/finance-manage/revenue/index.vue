<template>
    <div>
        <div class="page-cap-title page-cap-titleH">
            营收概况
        </div>
        <div class="hbb-page-title-con">
            <div>
                <h2>累计收入</h2>
                <p><b>{{ pageData && pageData.income | money }}</b>元</p>
            </div>
            <div>
                <h2>累计实际收入</h2>
                <p><b style="color: #ff1a02">{{ pageData && (getSub(pageData.income, pageData.withdraw) || 0) | money }}</b>元</p>
            </div>
            <div>
                <h2>累计支出</h2>
                <p><b>{{ pageData && pageData.award | money }}</b>元</p>
            </div>
            <div>
                <h2>累计实际支出</h2>
                <p><b style="color: #0ca319">{{ pageData && pageData.withdraw | money }}</b>元</p>
            </div>
        </div>
        <div class="hbb-pic-box">
            <statistics @successPostEvent="successPostEvent" />
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Mixins, Vue} from 'vue-property-decorator';
    import statistics from '../components/statistics.vue';
    import {sub} from '@/utils/number';
    @Component({
        components: {
            statistics
        }
    })
    export default class extends Vue {
        pageData:any = {};
        successPostEvent(res:any) {
            this.pageData = res;
        }

        getSub(a:any, b:any) {
            return sub(a, b);
        }
    }
</script>

<style lang="scss" scoped>
.hbb-page-title-con{
    display: flex;
    width: 100%;
    height: 100px;
    align-items: center;
    div{
        width: 25%;
        text-align: center;
        h2{
            margin-bottom: 15px;
            font-size: 16px;
            color: #666;
        }
        p{
            font-size: 12px;
            b{
                font-size: 16px;
                margin-right: 5px;
            }
        }
    }
}
</style>
