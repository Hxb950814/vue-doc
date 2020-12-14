<template>
    <div class="pageBox">
        <div class="hbb-address-top">
            <template v-if="dataList.length">
                <DeleteView ref="deleteView" :list="dataList" @goEdit="goEdit" @goSet="goSet" @deleteEvent="deleteClick"></DeleteView>
            </template>
            <template v-else>
                <div class="hbb-noData">
                    暂无数据
                </div>
            </template>
        </div>
        <div v-if="dataList.length < 10" class="hbb-vanbutton hbb-fixed" @click="sureClick">
            添加地址
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {PersonalModule} from "@/store/modules/user/personal";
    import DeleteView from "@/components/deleteView/index.vue";

    @Component({
        components:{
            DeleteView
        }
    })
    export default class extends Vue {
        dataList:any[] = [];
        pageMode = ''; // 页面来源
        did = ''; // 兑换实物的id
        obj:any = {}; // 是否已经在本地进行存储了已经选择的地址
        mounted() {
            // 取得来源页面
            this.pageMode = this.$route.query.page ? String(this.$route.query.page) : '';
            if(!this.pageMode) {
                localStorage.removeItem('shopObj');
            } else {
                this.did = this.$route.query.did ? String(this.$route.query.did) : '';
            }

            this.getaddress();
        }

        getaddress() {
            PersonalModule.getaddress().then((res:any) => {
                this.dataList = res?.data || [];
            })
        }

        goEdit(item:any) {
            let sendObj;
            if(this.pageMode) {
                sendObj = {
                    id: item.addressId,
                    did: this.did,
                    page: this.pageMode || ''
                }
            } else {
                sendObj = {
                    id: item.addressId
                }
            }
            this.$router.push({
                path: '/personal/editAddress',
                query: sendObj
            })
        }

        goSet(item:any) {
            if(this.pageMode) {
                localStorage.setItem('shopObj', JSON.stringify(item));
                this.$router.push({
                    path: '/personal/exchange',
                    query: {
                        id: this.did
                    }
                })
            } else {
                return false;
            }

        }

        deleteClick(addressId:number) {
            this.obj = localStorage.getItem('shopObj');
            if(this.obj) {
                let obj = JSON.parse(this.obj);
                if(obj.addressId === addressId) {
                    localStorage.removeItem('shopObj');
                }
            };
            this.getaddress();
        }

        sureClick() {
            let sendObj;
            if(this.pageMode) {
                sendObj = {
                    id: '0',
                    did: this.did,
                    page: this.pageMode || ''
                }
            } else {
                sendObj = {
                    id: '0'
                }
            }
            this.$router.push({
                path: '/personal/editAddress',
                query: sendObj
            })
        }
    }
</script>

<style lang="scss" scoped>
    .pageBox{
        background-color: #f6f6f6;
    }
    .hbb-address-top{
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        background-color: #fff;
        margin-bottom: 150px;
    }
    .hbb-vanbutton{
        display: flex;
        width: 80% !important;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        color: #fff;
        margin: 0 auto;
        &.hbb-fixed{
            position: fixed;
            bottom:30px;
            right: 0;
            left: 0;

        }
    }

</style>
