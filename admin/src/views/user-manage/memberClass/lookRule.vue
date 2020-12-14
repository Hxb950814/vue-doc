<template>
    <div>
        <div class="form-input-area">
            <div class="page-cap-title">
                查看规则
            </div>
            <h2 style="font-size:24px;margin: 10px 0">
                股票初级开课规则
            </h2>
            <div class="hbb-rule-box">
                <div class="top">
                    <span>章节</span>
                    <span>章节名称</span>
                    <span>当前状态</span>
                    <span>解锁时间</span>
                </div>
                <div v-for="(item,index) in dataList" :key="index" class="group">
                    <div class="first">
                        <span>{{ item.chapterNo }}</span>
                        <span>{{ item.chapterTitle }}</span>
                        <span />
                        <span />
                    </div>
                    <div class="sconce hbb-noB" style="flex-direction: column">
                        <div v-for="(ite,indx) in item.list" :key="indx" class="list">
                            <span>第{{ indx + 1 }}节</span>
                            <span>{{ ite.chapterTitle }}</span>
                            <span>{{ ite.status_text }}</span>
                            <span><el-date-picker
                                v-model="ite.unlockTime"
                                type="datetime"
                                style="width:100%"
                                placeholder="选择日期"
                                @change="timeChange(ite)"
                            /></span>
                        </div>
                        <div v-if="item.list.length === 0" class="hbb-nodata">
                            暂无数据
                        </div>
                    </div>
                    <div v-if="dataList.length === 0" class="hbb-nodata">
                        暂无数据
                    </div>
                </div>
            </div>
            <el-button type="primary" style="margin-top: 30px;margin-left: 530px" @click="saveClick">
                保存
            </el-button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import dayjs from 'dayjs';

    @Component({})
    export default class extends Vue {
        id:string = '';
        kid:string = '';

        dataList:any[] = [];

        mounted() {
            this.id = String(this.$route.query.id);
            this.kid = String(this.$route.query.kid);
            this.editSectionClass();
        }

        timeChange(item:any) {
            console.log();
            console.log(dayjs(new Date()).format('YYYY-MM-DD'));
            if (new Date().getTime() > new Date(item.unlockTime).getTime()) {
                item.status_text = '已解锁';
            } else {
                item.status_text = '待解锁';
            }
        }

        async editSectionClass () {
            const [err, resp] = await this.$postAsync('/class/queryCourse', {
                classId: this.id,
                courseTypeId: this.kid
            }, {
                paramType: 'form'
            });

            if (resp?.code === '000000') {
                this.dataList = resp?.data;
                this.dataList.forEach((x:any) => {
                    x.list.forEach((y:any) => {
                        console.log(new Date().getTime());
                        console.log(new Date(y.unlockTime).getTime());
                        if (new Date().getTime() > new Date(y.unlockTime).getTime()) {
                            y.status_text = '已解锁';
                        } else {
                            y.status_text = '待解锁';
                        }
                    });
                });
            } else {
            }
        }

        async saveClick() {
            const requestArrs:any[] = [];
            let obj = {};
            this.dataList.forEach((x:any) => {
                x.list.forEach((y:any) => {
                    y.unlockTime = y.unlockTime ? dayjs(y.unlockTime).format('YYYY-MM-DD HH:mm:ss') : '';
                    obj = {
                        chapterSectionId: y.chapterSectionId,
                        unlockTime: y.unlockTime,
                        classId: this.id
                    };
                    requestArrs.push(obj);
                });
            });
            const [err, resp] = await this.$postAsync('/class/editSectionClass', requestArrs, {
                paramType: 'json'
            });

            if (resp?.code === '000000') {
                if (resp?.code === '000000') {
                    this.$showToast('保存成功');
                    setTimeout(() => {
                        this.$router.back();
                    }, 200);
                } else {
                    this.$showToast(resp?.message || '保存失败');
                }
            } else {
            }
        }
    }
</script>

<style lang="scss" scoped>
.hbb-rule-box{
    display: flex;
    width: 600px;
    flex-direction: column;
    margin-top: 40px;
    .top,.group{
        display: flex;
        width: 100%;
        align-items: center;
        background: #D7D7D7;
    }
    .group{
        display: flex;
        flex-direction: column;
        .first,.sconce{
            display: flex;
            width: 100%;
            height: 40px;
            align-items: center;
            background: #fff;
            span{
                &:nth-of-type(1){
                    text-align: left !important;
                    padding-left: 10px;
                    background: #F2F2F2;
                }
                &:nth-of-type(3){
                    background: #F2F2F2;
                }
            }
        }
        .sconce{
            height: auto !important;
        }

        .list{
            display: flex;
            width: 100%;
            height: 40px;
            align-items: center;
            background: #fff;
            span{
                &:nth-of-type(1){
                    text-align: right !important;
                    padding-right: 10px;
                }

            }

        }
    }
    span{
        text-align: center;
        height: 40px;
        line-height: 40px;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        color: #333333;
        font-weight: bold;
        &:nth-of-type(1){
            width: 100px;
        }
        &:nth-of-type(2){
            width: 200px;
        }
        &:nth-of-type(3){
            width: 100px;
        }
        &:nth-of-type(4){
            width: 200px;
        }

    }

    .hbb-nodata{
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        border: 1px solid #ddd;
        border-top: 0;
    }
}
</style>
