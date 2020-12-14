<template>
    <div>
        <div class="search-line">
            <div class="search-union">
                <span class="words">展示状态:</span>
                <div class="input-text">
                    <el-select
                        v-model.trim="search.status"
                        style="width: 160px"
                        placeholder="全部"
                    >
                        <el-option value="" label="全部" />
                        <el-option value="1" label="显示" />
                        <el-option value="0" label="隐藏" />
                    </el-select>
                </div>
            </div>
            <div class="search-union">
                <span class="words">{{ title }}名称:</span>
                <div class="input-text">
                    <el-input
                        v-model.trim="search.title"
                        style="width: 160px"
                        type="text"
                        clearable
                        placeholder="请输入名称内容"
                        maxlength="50"
                        autocomplete="off"
                    />
                </div>
            </div>

            <div class="search-union right">
                <el-button type="primary" @click="searchData">
                    查询
                </el-button>
            </div>
            <div class="search-union right">
                <el-button type="primary" @click="clickAddNotice">
                    <i class="el-icon-plus" />
                    {{ title }}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({})
    export default class extends Vue {
        @Prop({type: String, default: '1', required: false})
        mode!:string;

        @Prop({type: String, default: '公告', required: false})
        title!:string;

        search: any = {
            title: '', // 公告标题
            status: '' // 状态
        };

        mounted() {
            this.searchData();
        }

        searchData() {
            this.$emit('getDataEvent', this.search);
        }

        clickAddNotice() {
            let path = '/content_manage/';
            switch (this.mode) {
                case '1':
                    path = path + 'announcement/add';
                    break;
                case '2':
                    path = path + 'article/add';
                    break;
                default:
                    break;
            }
            this.$router.push({
                path
            });
        }
    }
</script>

<style lang="scss" scoped>

</style>
