<template>
    <div class="hb-container">
        <ul>
            <li class="hb-list-item " v-for="(item,index) in list" data-type="0" :key="index" >
                <div class="hb-list-box" @touchstart.capture="touchStart" @touchend.capture="touchEnd" @click="itemClick(item)">
                    <div>
                        <h2>
                            <span v-if="item.isDefault">默认</span>
                            <strong>{{item.name}}<small>{{item.mobile}}</small></strong>
                        </h2>
                        <p>{{item.addressDetail}}</p>
                    </div>
                    <div  @click.stop="skip(item)">
                        <svg viewBox="0, 0, 1024, 1024" class="ih5-icon" stroke-width="2" style="height: 20px; width: 20px;"><path d="M489.376 534.624a31.904 31.904 0 0 0 45.248 0l304-304a31.968 31.968 0 1 0-45.248-45.248l-304 304a31.968 31.968 0 0 0 0 45.248M832 480a32 32 0 0 0-32 32l0.256 288L224 800.256 223.744 224H512a32 32 0 0 0 0-64H223.744A63.84 63.84 0 0 0 160 223.744v576.512C160 835.392 188.608 864 223.744 864h576.512A63.84 63.84 0 0 0 864 800.256V512a32 32 0 0 0-32-32" style="fill: rgb(170, 170, 170);"></path></svg>
                    </div>
                </div>
                <div class="hb-delete" @click="deleteItem(item)">删除</div>
            </li>
        </ul>
    </div>
</template>

<script>
    import {PersonalModule} from "@/store/modules/user/personal";

    export default {
        props: {
            list: {
                type: Array,
                required: true
            }
        },
        data () {
            return {
                startX: 0,
                endX: 0
            }
        },
        methods: {
            // 跳转
            skip (item) {
                if (this.checkSlide()) {
                    this.restSlide()
                } else {

                    this.$emit('goEdit', item)
                }
            },
            itemClick (item) {
                if (this.checkSlide()) {
                    this.restSlide()
                } else {

                    this.$emit('goSet', item)
                }
            },

            // 滑动开始
            touchStart (e) {
                // 记录初始位置
                this.startX = e.touches[0].clientX
            },
            // 滑动结束
            touchEnd (e) {
                // 当前滑动的父级元素
                let parentElement = e.currentTarget.parentElement
                // 记录结束位置
                this.endX = e.changedTouches[0].clientX
                // 左滑
                if (parentElement.dataset.type == 0 && this.startX - this.endX > 30) {
                    this.restSlide()
                    parentElement.dataset.type = 1
                }
                // 右滑
                if (parentElement.dataset.type == 1 && this.startX - this.endX < -30) {
                    this.restSlide()
                    parentElement.dataset.type = 0
                }
                this.startX = 0
                this.endX = 0
            },
            // 判断当前是否有滑块处于滑动状态
            checkSlide () {
                let listItems = document.querySelectorAll('.hb-list-item')
                for (let i = 0; i < listItems.length; i++) {
                    if (listItems[i].dataset.type == 1) {
                        return true
                    }
                }
                return false
            },
            // 复位滑动状态
            restSlide () {
                let listItems = document.querySelectorAll('.hb-list-item')
                // 复位
                for (let i = 0; i < listItems.length; i++) {
                    listItems[i].dataset.type = 0
                }
            },
            // 删除
            deleteItem (item) {
                let requestObj = {
                    addressId: item.addressId
                }
                PersonalModule.deleteAddress(requestObj).then((res) => {
                    this.$toast('删除成功');
                    this.restSlide()
                    this.$emit('deleteEvent', item.addressId)
                })
            }
        }
    }
</script>
<style lang="scss">
    .hb-container{
        width: 100%;
    }
    .hb-page-title{
        text-align: center;
        font-size: 17px;
        padding: 10px 15px;
        position: relative;
    }
    .hb-page-title:after{
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid #ccc;
        color: #ccc;
        -webkit-transform-origin: 0 100%;
        transform-origin: 0 100%;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        z-index: 2;
    }
    .hb-list-item{
        position: relative;
        height:150px;
        -webkit-transition: all 0.2s;
        transition: all 0.2s;
    }
    .hb-list-item[data-type="0"]{
        transform: translate3d(0,0,0);
    }
    .hb-list-item[data-type="1"]{
        transform: translate3d(-120px,0,0);
    }
    .hb-list-item:after{
        content: " ";
        /*position: absolute;*/
        left: 120px;
        bottom: 0;
        right: 0;
        height: 1px;
        color: #ccc;
        -webkit-transform-origin: 0 100%;
        transform-origin: 0 100%;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        z-index: 2;
    }
    .hb-list-box{
        padding: 0.4rem;
        background: #fff;
        display: flex;
        border-bottom: 1px solid #ddd;
        align-items: center;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        justify-content: space-between;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        font-size: 24px;
            div{
                &:nth-of-type(1){
                    padding-right: 20px;
                }
                h2{
                    display: flex;
                    width: 100%;
                    align-items: center;
                    span{
                        margin-right: 10px;
                        border-radius: 30px;
                        font-size: 22px;
                        color: #ff2c27;
                        background-color: #f6f6f6;
                        padding-right: 16px;
                        padding-left: 16px;
                    }
                    strong{
                        font-size: 30px;
                        color: #333;
                        small{
                            font-weight: normal;
                            font-size: 25px;
                            color: #666;
                            margin-left: 20px;
                        }
                    }
                }
                p{
                    width: 600px;
                    margin-top: 16px;
                    font-size: 26px;
                    color: #999;
                    @include ellipsis(1)

                }
            }
    }
    .hb-list-item .hb-delete{
        width: 120px;
        height:150px;
        background: #ff4949;
        font-size: 28px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top:0;
        right: -120px;
    }
</style>
