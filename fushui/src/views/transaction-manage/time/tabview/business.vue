<!-- 行情种类 -->
<template>
    <div>
        <div class="hbb-box">
            <el-table
                :data="dataSourceList"
                border
                style="width: 100%"
            >
                <el-table-column
                    prop="time"
                    label="时间"
                    width="170px"
                />
                <el-table-column
                    prop="content"
                    label="交易说明"
                />
            </el-table>
            <p v-if="notice" class="hbb-desc">
                注意：{{ notice }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Prop, Vue, Mixins} from 'vue-property-decorator';

    @Component({
        components: {}
    })
    export default class extends Vue {
        @Prop({type: Array, default: [], required: false})
        dataSourceList!: any[]; // 交易所交易数据源

        @Prop({type: String, default: '', required: false})
        notice!:string; // 交易所交易数据源 描述

        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
    .hbb-box{
        &>.hbb-desc{
           display: flex;
            width: 100%;
            margin-top: 30px;
            justify-content: center;
            color: #0ca2ff;
        }

    }
</style>
