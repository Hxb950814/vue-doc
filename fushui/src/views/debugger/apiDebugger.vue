<template>
    <div class="container">
        <div class="title">
            API调试
        </div>
        <div class="form-wrapper">
            <div class="api-list" />
            <el-form class="form-input-area">
                <el-form-item label="请求地址:">
                    <el-select v-model="editData.method" placeholder="请选择" style="width: 100px">
                        <el-option label="GET" value="get" />
                        <el-option label="POST" value="post" />
                    </el-select>

                    <el-input v-model="editData.method" placeholder="请选择" class="input-with-select" style="width: 400px" />
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';

    @Component({})
    export default class extends Vue {
        editData = {
            method: 'get' // 用户名
        };
    }
</script>

<style lang="scss" scoped>
    .container {
        background-color: #fff;
        height: 100vh;
    }
    .title{
        font-size: 40px;
        font-weight: bold;
        margin-bottom: 20px;
    }
    .form-wrapper{
        display: flex;
        padding: 20px 0 0 50px;
        >span{
            font-size: 15px;
        }
        .api-list{
            width: 200px;
        }
    }
</style>
