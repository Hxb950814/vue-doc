<template>
    <div>
        <tk-nav-bar>
            行情抬头设置
        </tk-nav-bar>
        <div class="container">
            <div class="situation-top-flag">
                <div class="title">
                    名称
                </div>
                <div class="menu-1">
                    {{ tab1Cap || '--' }}
                </div>
                <div class="menu-2">
                    {{ tab2Cap || '--' }}
                </div>
                <div class="menu-3">
                    {{ tab3Cap || '--' }}
                </div>
            </div>
            <div class="menu-wrap">
                <div />
                <div>
                    <ul>
                        <li v-for="(item,idx) in dataTab1List" :key="idx" class="item-union"
                            :class="{active: item.active}"
                            @click="clickOnTab(1,idx)"
                        >
                            {{ item.name }}
                        </li>
                    </ul>
                </div>
                <div>
                    <ul>
                        <li v-for="(item,idx) in dataTab2List" :key="idx" class="item-union"
                            :class="{active: item.active}"
                            @click="clickOnTab(2,idx)"
                        >
                            {{ item.name }}
                        </li>
                    </ul>
                </div>
                <div>
                    <ul>
                        <li v-for="(item,idx) in dataTab3List" :key="idx" class="item-union"
                            :class="{active: item.active}"
                            @click="clickOnTab(3,idx)"
                        >
                            {{ item.name }}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="prompt">
                <p class="title">
                    温馨提示
                </p>
                <p class="desc">
                    1、行情报价界面固定显示4列
                </p>
                <p class="desc">
                    2、后两列可选多个抬头，单价快速切换
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {postAsync} from '@/utils/request';

    @Component({
        middleware: 'auth',
        async asyncData() {
            const result = await Promise.all([
                postAsync('/quotation/getTitle'),
                postAsync('/quotation/getTitleByUserId')
            ]);
            const resp1 = result?.[0]?.[1];
            const resp2 = result?.[1]?.[1];
            const tab1List: any[] = [];
            const tab2List: any[] = [];
            const tab3List: any[] = [];

            let tab1Cap = '';
            let tab2Cap = '';
            let tab3Cap = '';
            if (resp1?.code === '000000') {
                resp1.data.forEach((item: any, idx: number) => {
                    const locationId = +item.titleLocation;
                    if (locationId === 1) {
                        tab1List.push({
                            id: String(item.quotationTitleId),
                            name: item.titleName,
                            active: false,
                            sort: tab1List.length // 排序因子  选中的排序为100+ 未选中的设置成0-99
                        });
                    } else if (locationId === 2) {
                        tab2List.push({
                            id: String(item.quotationTitleId),
                            name: item.titleName,
                            active: false,
                            sort: tab2List.length
                        });
                    } else if (locationId === 3) {
                        tab3List.push({
                            id: String(item.quotationTitleId),
                            name: item.titleName,
                            active: false,
                            sort: tab3List.length
                        });
                    }
                });
            }
            if (resp2?.code === '000000') {
                // console.log(JSON.stringify(resp2?.data));
                const data = resp2?.data || {};
                const dataTab1List = (data.tab1 || []).map((id: number) => String(id));
                const dataTab2List = (data.tab2 || []).map((id: number) => String(id));
                // console.log('dataTab2List', dataTab2List);
                const dataTab3List = (data.tab3 || []).map((id: number) => String(id));
                tab1List.forEach((item: any) => {
                    if (dataTab1List.includes(item.id)) {
                        item.active = true;
                    }
                });
                tab1List.sort((a: any, b: any) => {
                    if (a.active !== b.active) {
                        return b.active - a.active;
                    }
                    if (a.active && b.active) {
                        const aIndex = dataTab1List.indexOf('' + a.id);
                        const bIndex = dataTab1List.indexOf('' + b.id);
                        return aIndex - bIndex;
                    }
                    return 0;
                });
                const find1 = tab1List.find((item: any) => item.active);
                tab1Cap = find1 ? find1.name : '';
                /* //// */
                tab2List.forEach((item: any) => {
                    if (dataTab2List.includes(item.id)) {
                        // console.log('get check', tab2Cap);
                        item.active = true;
                    }
                });
                tab2List.sort((a: any, b: any) => {
                    if (a.active !== b.active) {
                        return b.active - a.active;
                    }
                    if (a.active && b.active) {
                        const aIndex = dataTab2List.indexOf('' + a.id);
                        const bIndex = dataTab2List.indexOf('' + b.id);
                        // console.log(aIndex, bIndex);
                        return aIndex - bIndex;
                    }
                    return 0;
                });
                const find2 = tab2List.find((item: any) => item.active);
                tab2Cap = find2 ? find2.name : '';
                /* ////////// */
                tab3List.forEach((item: any) => {
                    if (dataTab3List.includes(item.id)) {
                        item.active = true;
                    }
                });
                /* 排序 */
                tab3List.sort((a: any, b: any) => {
                    if (a.active !== b.active) {
                        return b.active - a.active;
                    }
                    if (a.active && b.active) {
                        const aIndex = dataTab3List.indexOf('' + a.id);
                        const bIndex = dataTab3List.indexOf('' + b.id);
                        return aIndex - bIndex;
                    }
                    return 0;
                });
                const find3 = tab3List.find((item: any) => item.active);
                tab3Cap = find3 ? find3.name : '';
            }
            return {
                dataTab1List: tab1List,
                dataTab2List: tab2List,
                dataTab3List: tab3List,
                tab1Cap,
                tab2Cap,
                tab3Cap
            };
        }
    })
    export default class extends Vue {
        dataList: any[] = [];
        dataTab1List: any[] = [];
        dataTab2List: any[] = [];
        dataTab3List: any[] = [];

        tab1Cap = '';
        tab2Cap = '';
        tab3Cap = '';

        mounted() {
            // console.log('tab2Cap:', this.tab2Cap);
            this.getData();
        }

        async getData() {
            const [err2, resp2] = await postAsync('/quotation/getTitleByUserId');
        }

        clickOnTab(idx: number, idx2: number) {
            // const data = [];
            let data: any[];
            if (idx === 1) {
                data = this.dataTab1List;
            } else if (idx === 2) {
                data = this.dataTab2List;
            } else if (idx === 3) {
                data = this.dataTab3List;
            } else {
                data = [];
            }
            if (data[idx2]) {
                const currentNew = JSON.parse(JSON.stringify(data[idx2]));
                this.$delete(data, idx2); // 先删掉这个元素

                // 获得最后一个选中的key
                let keep = -1;
                for (let i = data.length - 1; i >= 0; --i) {
                    const obj = data[i];
                    if (obj.active) {
                        keep = i;
                        break;
                    }
                }

                // console.log(keep, 'keep');
                const now = currentNew.active;
                currentNew.active = !now;

                data.splice(keep + 1, 0, currentNew);

                if (idx === 1) {
                    this.tab1Cap = data?.[0]?.name || '';
                } else if (idx === 2) {
                    this.tab2Cap = data?.[0]?.name || '';
                } else if (idx === 3) {
                    this.tab3Cap = data?.[0]?.name || '';
                }
                this.doSave();
            }
            // 数据交换
        }

        switchData() {

        }

        async doSave() {
            const [err, resp] = await postAsync('/quotation/updateTitleUserByUserId', {
                tab1: this.dataTab1List.filter((item: any) => item.active).map((item: any) => item.id),
                tab2: this.dataTab2List.filter((item: any) => item.active).map((item: any) => item.id),
                tab3: this.dataTab3List.filter((item: any) => item.active).map((item: any) => item.id)
            }, {
                paramType: 'json'
            });
            if (resp?.code === '000000') {

            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/situation.scss";

    .container {
        background: #fff;
    }

    .situation-top-flag {
        .menu-1,
        .menu-2,
        .menu-3 {
            &::after {
                position: absolute;
                bottom: 0;
                right: 0;
                content: '';
                border-top: 15px solid transparent;
                border-left: 15px solid transparent;
                border-right: 15px solid #ccc;
            }
        }
    }

    .situation-contract-list {
        .value-1,
        .value-2,
        .value-3 {
            border-left: 1PX solid #fff;
            border-top: 1PX solid #fff;
            background: #F2F2F2;
            color: #666;
            padding-right: 0;
            text-align: center;

            &[disabled] {
                background: transparent;
                pointer-events: none;
            }

            &.active {
                background: $color-up;
                color: #fff;
            }
        }

        li::after {
            border: none;
        }
    }

    .menu-wrap {
        display: flex;

        > div {
            text-align: center;

            &:first-child {
                width: 300px;
            }

            &:nth-child(2) {
                width: 160px;
            }

            &:nth-child(3) {
                width: 160px;
            }

            &:last-child {
                width: 160px;
            }
        }
    }

    .item-union {
        height: 70px;
        line-height: 70px;
        border-left: 1PX solid #fff;
        border-top: 1PX solid #fff;
        background: #F2F2F2;
        color: #666;
        padding-right: 0;
        font-size: 28px;
        text-align: center;

        &[disabled] {
            background: transparent;
            pointer-events: none;
        }

        &.active {
            background: $color-up;
            color: #fff;
        }
    }

    .prompt {
        margin: 200px 40px 40px;

        .title {
            font-size: 30px;
            color: #FFB642;
            margin-bottom: 30px;
        }

        .desc {
            color: #999;
            font-size: 26px;
            line-height: 1.8;
        }
    }
</style>
