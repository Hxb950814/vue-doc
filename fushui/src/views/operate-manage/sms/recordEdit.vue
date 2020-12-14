<!-- 查看短信记录-->
<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                查看短信记录
            </div>
            <el-form ref="dataForm" class="form-data form-style" :model="editData" :rules="dataRule" disabled>
                <el-form-item label="联系方式：" prop="" label-width="120px">
                    <el-input
                        v-model.trim="editData.phone"
                        type="text"
                        autocomplete="off"
                        placeholder="请输入文章标题"
                        maxlength="30"
                        style="width:300px"
                    />
                </el-form-item>

                <el-form-item label="短信详情：" prop="" label-width="120px">
                    <el-input v-model="editData.details" type="textarea" rows="7" style="max-width:500px" />
                </el-form-item>
                <div class="dis-flex">
                    <el-form-item label="发布时间：" prop="" label-width="120px">
                        <el-date-picker
                            v-model="editData.publishTime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            type="datetime"
                            placeholder="请选择"
                            style="width:185px"
                        />
                    </el-form-item>
                </div>
                <el-form-item label="状态：" prop="" label-width="120px">
                    <span class="list-status" :class="{red: editData.status === '0'}">
                        {{ editData.status === '1'? '成功' : '失败' }}
                    </span>
                </el-form-item>
            </el-form>
            <div class="form-submit-line" style="width: 680px">
                <el-button @click="clickClose">
                    关闭
                </el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import commonTable from '@/mixins/commonTable';

    @Component({
        components: {
        },
        mixins: [commonTable]
    })
    export default class extends Vue {
         id = ''; // id
         editData: any = {
            phone: '', // 联系方式
            details: '', // 详情
            status: '', // 状态
            publishTime: '' // 发布时间
        };

         dataRule: any = {
        };

        mounted() {
            if (!this.$route.query.id || this.$route.query.id === 'undefined') {
                this.$showToast('id不正确');
                return;
            }
            this.id = String(this.$route.query.id);
            // 保存未更改的快照, 用于对比数据是否发生更改
            this.getData();
        }

         async getData() {
            // 获得数据
            this.$showLoading();
            const [err, resp] = await this.$getAsync('/message/getMessageRecordDetail', {
                id: this.id
            });

            this.$closeLoading();
            if (resp?.code === '000000') {
                this.editData.phone = resp.data.mobile; // 联系方式
                this.editData.details = '' + resp.data.content; // 详情
                this.editData.status = Number(resp.data.status) ? '1' : '0'; // 状态
                this.editData.publishTime = resp.data.createTime || ''; // 发布时间
            } else {
                this.$showToast(resp?.message || '数据获取失败');
            }
        }

         clickClose() {
            this.$router.back();
        }
    }
</script>
