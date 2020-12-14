<template>
    <div>
        <tk-nav-bar :class="'skin-' + skinType">
            <div>
                <input
                    v-model="value"
                    type="search"
                    class="search-input"
                    clearable
                    maxlength="20"
                    placeholder=""
                    @search="onSearch"
                    @keyup.enter="onSearch"
                >
            </div>
            <template #right>
                <a class="cancel-btn" @click="clickOnCancel">取消</a>
            </template>
        </tk-nav-bar>
        <div class="container" :class="{hasData: dataLoaded}">
            <div v-if="!dataLoaded " class="reco-area">
                <p class="title">
                    历史记录：
                </p>
                <span v-for="(item,idx) in searchHistory" :key="idx" @click="clickKeySearch(item)">{{ item }}</span>
                <div v-if="searchHistory.length > 0" class="clear" @click="clickRemoveAllKey">
                    清除相关记录
                </div>
            </div>
            <ul v-if="dataLoaded && dataList.length > 0">
                <li v-for="(item,idx) in dataList" :key="idx" class="line" @click="clickOnLine(idx)">
                    <div class="info">
                        <div class="title">
                            {{ item.contractName }}
                        </div>
                        <div class="source">
                            {{ item.sourceName }}
                        </div>
                    </div>
                    <div class="icon" :class="{selected: item.selected}" @click="clickSelect(item.id, !item.selected)" />
                </li>
            </ul>
            <div v-if="dataLoaded && dataList.length === 0" class="tk-list-nodata">
                <div class="icon">
                    暂无数据
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {postAsync} from '@/utils/request';

    @Component({})
    export default class extends Vue {
        value = '';
        skinType = '1';

        searchHistory: any[]= [];

        dataLoaded = false;
        dataList: any= [];

        selectSettingLock = false;

        mounted() {
            const history = localStorage.getItem('searchHistory') || '';
            this.searchHistory = history ? history.split(',') : [];
        }

        async getData(key: string) {
            const history = localStorage.getItem('searchHistory') || '';
            const historyArr = history ? history.split(',') : [];
            if (historyArr) {
                const idx = historyArr.indexOf(key);
                if (idx >= 0) { // 记录有
                    historyArr.splice(idx, 1);
                }
                historyArr.unshift(key);
                // 最多20个
                localStorage.setItem('searchHistory', historyArr.slice(0, 20).join(','));
            }
            const [_, resp] = await postAsync('/quotation/getContractList', {
                name: String(key).trim()
            });
            if (resp?.code === '000000') {
                this.dataList = (resp?.data?.list || []).map((item: any) => {
                    return {
                        id: String(item.quotationContractId),
                        contractName: item.contractName,
                        sourceName: item.sourceName,
                        selected: Number(item.optional) === 1
                    };
                });
            } else {
                this.dataList = [];
            }
            this.dataLoaded = true;
        }

        async clickKeySearch(key: string) {
            this.value = key;
            this.$showLoading();
            await this.getData(key);
            this.$closeLoading();
        }

        clickOnLine(idx: number) {
            const dataObj = this.dataList[idx];
            if (dataObj) {
                if (this.$route.query.to) {
                    this.$router.push({
                        path: decodeURIComponent(this.$route.query.to + ''),
                        query: {
                            id: dataObj.id
                        }
                    });
                }
            }
        }

        clickRemoveAllKey() {
            this.searchHistory = [];
            localStorage.setItem('searchHistory', '');
        }

        clickOnCancel() {
            this.$router.back();
        }

        async onSearch(ev: any) {
            const val = ev.target.value;
            if (!val) {
                return;
            }
            this.$showLoading();
            await this.getData(ev.target.value || '');
            this.$closeLoading();
        }

        async clickSelect(id: string, targetSelect: boolean) {
            if (this.selectSettingLock) {
                console.log('正在处理');
                return;
            }
            const obj = this.dataList.find((item: any) => id === item.id);
            if (!obj) {
                return;
            }
            this.selectSettingLock = true;
            const [err, resp] = await postAsync('/quotation/updateContractUser', {
                quotationContractId: obj.id,
                type: targetSelect ? 1 : 0
            });
            if (resp?.code === '000000') {
                if (targetSelect) {
                    this.$showToast('已添加至自选');
                } else {
                    this.$showToast('已从自选移除');
                }
                obj.selected = targetSelect;
            }
            this.selectSettingLock = false;
        }
    }
</script>

<style lang="scss" scoped>
    .container.hasData{
        background: #fff;
    }
    /deep/ .search-input{
        border: none;
        color: #333;
        font-size: 25px;
        padding: 10px 20px;
        height: 60px;
        border-radius: 200px;
        overflow: hidden;
        margin-top: 14px;
        width: 550px;
        .van-field__control{
            padding: 0;
            line-height: 40px;
        }
    }
    .cancel-btn{
        color: #fff;
        font-size: 28px;
        line-height: 40px;
        padding: 20px;
        margin-top: 6px;
        display: inline-block;
    }
    /deep/ input[type=search]::-webkit-search-cancel-button{
        display: none;
    }

    .line{
        padding: 30px 30px;
        display: flex;
        justify-content: space-between;
        position: relative;
        @include thinBorder(bottom);
        .title{
            color: #333;
            font-size: 32px;
        }
        .source{
            font-size: 24px;
            color: #999;
            margin-top: 20px;
        }
        .icon{
            width: 60px;
            height: 60px;
            background: #03b602;
            margin-top: 10px;
            background: url(#{$cdn-path}/images/small_icon_add_red.png) center /40px 40px no-repeat;
            &.selected{
                background-image: url(#{$cdn-path}/images/small_icon_sub.png);
            }
            position: relative;
            &::after{
                content: '';
                background: url(#{$cdn-path}/images/small_icon_sub.png); /* 只是为了预先取得图片 */
                display: none;
            }
        }
    }

    .reco-area{
        .title{
            padding-bottom: 20px;
            font-size: 28px;
        }
        padding: 20px;
        >span{
            display: inline-block;
            text-align: center;
            line-height: 50px;
            padding: 0 20px;
            border-radius: 30px;
            background: #aaa;
            margin-right: 10px;
            margin-bottom: 15px;
            color: #fff;
        }
        .clear{
            width: 300px;
            text-align: center;
            font-size: 25px;
            color: #333;
            margin: 30px auto 0;
        }
    }
</style>
