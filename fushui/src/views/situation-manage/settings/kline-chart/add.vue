<!-- 添加图表-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                添加图表
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule">
                <el-form-item label="图表名称：" prop="name" label-width="120px">
                    <el-input
                        v-model.trim="editData.name"
                        type="text"
                        placeholder="请输入图表名称"
                        clearable
                        maxlength="8"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="图表类型：" prop="type" label-width="120px">
                    <el-select
                        v-model.trim="editData.type"
                        style="width: 160px"
                        clearable
                        placeholder="全部"
                        @change="onChartTypeChange"
                    >
                        <el-option
                            v-for="(item,idx) in dataChartTypeList"
                            :key="idx"
                            :value="item.chartTypeId"
                            :label="item.typeName"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="指标设置：" prop="indexData" label-width="120px">
                    <span v-if="!editData.type">请选择图表类型后展示</span>
                    <div v-else style="padding-top: 12px">
                        <div v-if="indexData.kindType === '1'">
                            <div>
                                <table class="params-table">
                                    <thead>
                                        <tr>
                                            <th>序号</th>
                                            <th>开关</th>
                                            <th>默认值</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>
                                                <el-checkbox v-model="indexData.kind1Open" />
                                            </td>
                                            <td>
                                                <input
                                                    v-model.trim="indexData.kind1Default"
                                                    type="text"
                                                    maxlength="3"
                                                    style="width: 50px"
                                                >
                                                %
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div v-else-if="indexData.kindType === '2'">
                            <div>
                                <table class="params-table">
                                    <thead>
                                        <tr>
                                            <th>序号</th>
                                            <th>指标名称</th>
                                            <th>是否显示</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,idx) in indexData.kind2Data" :key="idx">
                                            <td>{{ idx + 1 }}</td>
                                            <td>
                                                <input
                                                    v-model.trim="item.name"
                                                    type="text"
                                                    maxlength="10"
                                                    style="width: 100px"
                                                >
                                            </td>
                                            <td>
                                                <el-checkbox v-model="item.display" />
                                            </td>
                                            <td>
                                                <a class="link-btn color normal" @click="clickCheckKind2Params(idx)">参数</a>
                                                <a class="link-btn color red" style="margin-left: 10px" @click="clickDeleteKind2Data(idx)">删除</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="add-btn" @click="clickAddKind2Data">
                                    +
                                </div>
                            </div>
                        </div>
                        <div v-else-if="indexData.kindType === '3'">
                            <div>
                                <table class="params-table">
                                    <thead>
                                        <tr>
                                            <th>序号</th>
                                            <th>指标名称</th>
                                            <th>指标类型</th>
                                            <th>是否显示</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>
                                                {{ indexData.kind3Data[0].name }}
                                            </td>
                                            <td>
                                                时间变化量
                                            </td>
                                            <td>
                                                <el-checkbox v-model="indexData.kind3Data[0].display" />
                                            </td>
                                            <td>
                                                <a class="link-btn color normal" @click="clickCheckKind3Params(0)">参数</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>
                                                {{ indexData.kind3Data[1].name }}
                                            </td>
                                            <td>
                                                价格百分比
                                            </td>
                                            <td>
                                                <el-checkbox v-model="indexData.kind3Data[1].display" />
                                            </td>
                                            <td>
                                                <a class="link-btn color normal" @click="clickCheckKind3Params(1)">参数</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div v-else-if="indexData.kindType === '4'">
                            <div>
                                <table class="params-table">
                                    <thead>
                                        <tr>
                                            <th style="width: 120px">
                                                序号
                                            </th>
                                            <th>开关</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>
                                                <el-checkbox v-model="indexData.kind4Open" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="显示顺序：" prop="order" label-width="120px">
                    <el-input
                        v-model.trim="editData.order"
                        type="text"
                        placeholder="请输入顺序数字(1-99)"
                        clearable
                        maxlength="2"
                        style="width:300px"
                    />
                </el-form-item>
                <el-form-item label="是否展示：" prop="status" label-width="120px">
                    <el-radio-group v-model="editData.status">
                        <el-radio label="1">
                            是
                        </el-radio>
                        <el-radio label="0">
                            否
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div class="form-submit-line" style="width: 500px;margin-top: 20px">
                <el-button type="primary" @click="clickSave">
                    保存
                </el-button>
            </div>
        </div>

        <el-dialog
            title="子参数配置"
            custom-class="myui-dialog"
            :close-on-click-modal="false"
            :visible.sync="kind2ParamPanelShow"
            width="650px"
        >
            <div class="common-table">
                <div style="margin-top: 0;max-height: 500px;overflow-y:  auto">
                    <el-table :data="kind2ParamModifyData">
                        <el-table-column prop="idx" label="序号" width="60">
                            <template slot-scope="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="paramName" label="参数名称">
                            <template slot-scope="scope">
                                <el-input v-model.trim="scope.row.paramName" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="paramValue" label="参数值">
                            <template slot-scope="scope">
                                <el-input v-model.trim="scope.row.paramValue" maxlength="20" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="operate" label="操作">
                            <template slot-scope="scope">
                                <a v-if="scope.$index === kind2ParamModifyData.length - 1" class="link-btn color normal" @click="clickAddKind2ParamsLine">增加</a>
                                <a v-if="kind2ParamModifyData.length > 1" class="link-btn color red" style="margin-left: 10px" @click="clickDeleteKind2ParamsLine(scope.$index)">删除</a>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div style="text-align: center;margin-top: 10px">
                    <el-button type="primary" @click="clickOnSaveKind2Params">
                        保存
                    </el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog
            title="分时K线参数"
            custom-class="myui-dialog"
            :close-on-click-modal="false"
            :visible.sync="kind3_0ParamPanelShow"
            width="650px"
        >
            <div class="common-table">
                <div style="margin-top: 0;max-height: 500px;overflow-y:  auto">
                    <el-table :data="kind3_0ParamModifyData">
                        <el-table-column prop="idx" label="序号" width="60">
                            <template slot-scope="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="paramName" label="参数值(分钟)">
                            <template slot-scope="scope">
                                <el-input v-model.trim="scope.row.paramValue" maxlength="6" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="operate" label="操作">
                            <template slot-scope="scope">
                                <a v-if="scope.$index === kind3_0ParamModifyData.length - 1" class="link-btn color normal" @click="clickAddKind3_0ParamsLine">增加</a>
                                <a v-if="kind3_0ParamModifyData.length > 1" class="link-btn color red" style="margin-left: 10px" @click="clickDeleteKind3_0ParamsLine(scope.$index)">删除</a>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div style="text-align: center;margin-top: 10px">
                    <el-button type="primary" @click="clickOnSaveKind3_0Params">
                        保存
                    </el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog
            title="弹性K线参数"
            custom-class="myui-dialog"
            :close-on-click-modal="false"
            :visible.sync="kind3_1ParamPanelShow"
            width="650px"
        >
            <div class="common-table">
                <div style="margin-top: 0;max-height: 500px;overflow-y:  auto">
                    <el-table :data="kind3_1ParamModifyData">
                        <el-table-column prop="idx" label="序号" width="60">
                            <template slot-scope="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="paramName" label="参数值(%)">
                            <template slot-scope="scope">
                                <el-input v-model.trim="scope.row.paramValue" maxlength="6" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="operate" label="操作">
                            <template slot-scope="scope">
                                <a v-if="scope.$index === kind3_1ParamModifyData.length - 1" class="link-btn color normal" @click="clickAddKind3_1ParamsLine">增加</a>
                                <a v-if="kind3_1ParamModifyData.length > 1" class="link-btn color red" style="margin-left: 10px" @click="clickDeleteKind3_1ParamsLine(scope.$index)">删除</a>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div style="text-align: center;margin-top: 10px">
                    <el-button type="primary" @click="clickOnSaveKind3_1Params">
                        保存
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch, Mixins} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import indexSettingMixins from './indexSettingMixins';
    import {getValidateInteger, getValidateSpecialNumber} from '@/utils/validate';

    @Component({
        components: {},
        mixins: []
    })
    export default class extends Mixins(indexSettingMixins) {
        editData: any = {
            name: '', // 图表名称
            type: '', // 类型
            status: '0', // 状态 1=显示  0=不显示
            order: '' // 显示顺序1-99
        };

        dataRule: any = {
            name: [{required: true, message: '请输入展示名称', trigger: 'blur'}],
            location: [{required: true, message: '请选择显示位置', trigger: 'change'}],
            order: [
                {required: true, message: '请输入顺序(1-99数字)', trigger: 'blur'},
                {required: true, validator: getValidateInteger(), trigger: 'blur'},
                {required: true, validator: getValidateSpecialNumber({compareType: '>=', number: 1}), trigger: 'blur'},
                {required: true, validator: getValidateSpecialNumber({compareType: '<=', number: 99}), trigger: 'blur'}
            ],
            indexData: [
                {required: true, validator: this.validateIndexData, trigger: 'blur'}
            ]
        };

        dataChartTypeList: any[] = [];

        async mounted() {
            this.getChartType();
        }

        async getChartType() {
            const [err, resp] = await this.$getAsync('/chart/selectAllChartType');
            const list: any[] = [];
            if (resp?.code === '000000') {
                (resp?.data || []).forEach((item: any, idx: number) => {
                    list.push({
                        chartTypeId: item.chartTypeId + '',
                        typeName: item.typeName + ''
                    });
                });
            }
            this.dataChartTypeList = list;
        }

        clickSave() {
            (this.$refs.dataForm as ElForm).validate((valid: boolean) => {
                if (valid) {
                    this.$showMessageBox('是否保存?').then(() => {
                        this.doSave();
                    }).catch(() => {
                    });
                }
            });
        }

        async doSave() {
            this.$showLoading();
            const data: any = {
                chartName: this.editData.name, // 图表名称
                chartTypeId: this.editData.type, // 图表类型
                sortby: this.editData.order, // 显示顺序
                status: this.editData.status, // 是否展示
                chartIndicatorsVoList: [] as any[]
            };
            data.chartIndicatorsVoList = this.getChartIndicatorsData();

            const [err, resp] = await this.$postAsync('/chart/updateOrAddChart', data, { paramType: 'json'});
            this.$closeLoading();
            if (resp?.code === '000000') {
                this.$showToast('添加成功');
                setTimeout(() => {
                    this.$router.back();
                }, 300);
            } else {
                this.$showToast(resp?.message || '添加失败');
            }
        }

        onChartTypeChange(val: string) {
            this.setChartKindById(val);
            (this.$refs.dataForm as ElForm).clearValidate('indexData');
        }
    }
</script>

<style lang="scss" scoped>
</style>
