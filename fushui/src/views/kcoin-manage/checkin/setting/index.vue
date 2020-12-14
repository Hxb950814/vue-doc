<!--签到设置-->
<template>
    <div>
        <div class="page-cap-title">
            签到设置
        </div>
        <div class="top-buttons-wrap">
            <el-button v-permission="'04050401'" type="primary" @click="clickEdit">
                {{ canEdit ? '保存' : '编辑' }}
            </el-button>
            <el-button v-if="canEdit" @click="clickCancelEdit">
                取消
            </el-button>
        </div>
        <div class="default-wrap form-input-area">
            <form>
                <table class="params-table">
                    <thead>
                        <tr>
                            <th style="width: 100px">
                                序号
                            </th>
                            <th>操作</th>
                            <th style="width: 150px">
                                默认值
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,idx) in tableData" :key="idx">
                            <td>
                                {{ Number(idx) + 1 }}
                            </td>
                            <td>
                                <div class="layout-flex">
                                    连续签到
                                    <select
                                        v-model="item.unit"
                                        style="width: 80px;min-width: 80px"
                                        placeholder="请选择"
                                        :disabled="!canEdit"
                                    >
                                        <option value="">
                                            请选择
                                        </option>
                                        <option value=">">
                                            &gt;
                                        </option>
                                        <option value="=">
                                            =
                                        </option>
                                    </select>&nbsp;
                                    <input v-model="item.day" style="width: 80px" maxlength="4" :disabled="!canEdit">
                                    天，奖励
                                    <select
                                        v-model="item.type"
                                        style="width: 80px;min-width: 80px"
                                        :disabled="!canEdit"
                                    >
                                        <option value="">
                                            请选择
                                        </option>
                                        <option value="1">
                                            随机
                                        </option>
                                        <option value="2">
                                            固定
                                        </option>
                                    </select>&nbsp;
                                    <input
                                        v-model="item.min"
                                        style="width: 80px"
                                        maxlength="6"
                                        :disabled="!canEdit"
                                    >
                                    <template v-if="item.type === '1'">
                                        ~
                                        <input
                                            v-model="item.max"
                                            style="width: 80px"
                                            maxlength="6"
                                            :disabled="!canEdit"
                                        >
                                    </template>
                                    个K豆
                                </div>
                            </td>
                            <td>
                                <div class="lines">
                                    <a
                                        v-if="tableData.length > 1"
                                        class="link-btn color red"
                                        :class="{'disabled': !canEdit }"
                                        @click="clickRemove(idx)"
                                    >删除</a>
                                    <a
                                        v-if="idx === tableData.length - 1"
                                        class="link-btn color normal"
                                        :class="{'disabled': !canEdit }"
                                        @click="clickAdd"
                                    >添加</a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <div class="rules-area">
                <div class="sign-desc">
                    签到描述
                </div>
                <el-input v-model="rules" type="textarea" :rows="15" :disabled="!canEdit" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Watch, Vue, Mixins} from 'vue-property-decorator';

    @Component({
        components: {}
    })
    export default class extends Vue {
        canEdit = false;
        tableData: any[] = [];

        rules = '';

        mounted() {
            this.getData();
        }

        clickAdd() {
            this.tableData.push({
                day: '',
                max: '',
                min: '',
                type: '',
                unit: ''
            });
        }

        clickRemove(idx: number) {
            this.$showMessageBox('确定删除吗？').then(() => {
                if (this.tableData[idx].signSetId) {
                    // 先请求数据
                    (async () => {
                        this.$showLoading();
                        const [err, resp] = await this.$postAsync('/signSetCtrl/deleteSignSet', {
                            id: this.tableData[idx].signSetId
                        }, {
                            paramType: 'form'
                        });
                        this.$closeLoading();
                        if (resp?.code === '000000') {
                            this.$showToast('删除成功');
                            this.$delete(this.tableData, idx); // 直接删除
                        } else {
                            this.$showToast('删除失败');
                        }
                    })();
                } else {
                    this.$delete(this.tableData, idx); // 直接删除
                }
            }).catch(() => {
            });
        }

        async clickEdit() {
            if (!this.canEdit) {
                this.canEdit = true;
                return;
            }
            // 1.校验
            for (let i = 0; i < this.tableData.length; i++) {
                const obj = this.tableData[i];
                if (obj.unit === '') {
                    this.$showToast(`请选择第${i + 1}行的连续签到类型`);
                    return;
                }
                if (obj.day === '') {
                    this.$showToast(`请输入第${i + 1}行的连续签到天数`);
                    return;
                }
                const day = Number(obj.day);
                if (isNaN(day) || day !== Math.floor(day)) {
                    this.$showToast(`请输入第${i + 1}行的连续签到天数必须是整数`);
                    return;
                }
                if (obj.type === '') {
                    this.$showToast(`请选择第${i + 1}行的奖励类型`);
                    return;
                }
                if (obj.min === '') {
                    this.$showToast(`请输入第${i + 1}行的奖励k豆`);
                    return;
                }
                const min = Number(obj.min);
                if (isNaN(min) || min !== Math.floor(min)) {
                    this.$showToast(`第${i + 1}行的奖励K豆值必须是整数`);
                    return;
                }
                if (obj.min === '') {
                    this.$showToast(`请输入第${i + 1}行的奖励k豆`);
                    return;
                }
                if (obj.type === '1') { // 随机的
                    const max = Number(obj.max);
                    if (isNaN(max) || max !== Math.floor(max)) {
                        this.$showToast(`第${i + 1}行的奖励K豆最大值必须是整数`);
                        return;
                    }
                    if (obj.max === '') {
                        this.$showToast(`请输入第${i + 1}行的奖励k豆最大值`);
                        return;
                    }
                }
            }

            const dataSend = this.tableData.map((item: any) => ({
                day: item.day,
                content: this.rules,
                max: item.max, // 如果是固定的那么min的值没有意义
                min: item.min, // 如果是固定的那么min的值没有意义
                signSetId: item.signSetId || '',
                type: item.type,
                unit: item.unit
            }));

            this.$showLoading();
            // // 校验过来保存
            const [_, resp] = await this.$postAsync('/signSetCtrl/modifySignSet', dataSend, {
                paramType: 'json'
            });
            if (resp?.code === '000000') {
                this.$showToast('保存成功');
                this.canEdit = false;
                this.getData();
            }
            this.$closeLoading();
        }

        clickCancelEdit() {
            this.canEdit = false;
        }

        async getData() {
            this.$showLoading();
            const [err, resp] = await this.$postAsync('/signSetCtrl/signSetList');
            if (resp?.code === '000000') {
                const dataList = resp.data.result.map((item: any, idx: number) => {
                    return {
                        day: item.day,
                        max: item.max,
                        min: item.min,
                        signSetId: String(item.signSetId),
                        type: String(item.type), // 1=随机  2=固定
                        unit: item.unit
                    };
                });
                this.tableData = dataList;

                this.rules = resp.data.otherData;
            } else {
                this.tableData = [];
                this.rules = '';
            }
            this.$closeLoading();
        }
    }
</script>

<style lang="scss" scoped>
    .default-wrap {
        padding-top: 20px;
        max-width: 1200px;
    }

    /deep/ .el-input .el-input__inner {
        width: 90px;
        min-width: auto;
    }

    .layout-flex {
        padding-left: 180px;
        text-align: left;
    }

    .lines {
        padding: 0 20px;
        display: flex;
        justify-content: center;

        > a {
            margin: 0 5px;
        }
    }

    .sign-desc {
        padding-top: 20px;
        padding-bottom: 10px;
        font-size: 15px;
        font-weight: bold;
    }

    .rules-area {
        width: 500px;
    }

    .top-buttons-wrap {
        padding-top: 20px;
        display: flex;
        justify-content: flex-end;
        max-width: 1200px;
    }
</style>
