 import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import request from "@/utils/request";
 import {showToast} from "@/utils/ui";

@Module({ name: 'Personal',  dynamic:true,  namespaced: true, store })

export default class Personal extends VuexModule {

    // 获取icon
    @Action public async getMyIconData() {
        const result = await request.postAsync("/icon/getMyIcon", {displayPlatform: 2});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 获取订单列表
    @Action public async getOrderList(page:number) {
        const result = await request.postAsync("/wxpay/getOrderList", {page});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 获取订单详情
    @Action public async getOrderInfo(id:string) {
        const result = await request.postAsync("/wxpay/getOrderInfo", {orderId: id});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 获取订单详情
    @Action public async getClassInfo(id:string) {
        const result = await request.postAsync("/wxpay/getClassInfo", {orderId: id});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 获取邀请主页
    @Action public async getInviteMainInfo() {
        const result = await request.postAsync("/userInvite/getInviteMainInfo", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 未入班接口
    @Action public async getInviteNoLearn(page:number) {
        const result = await request.postAsync("/userInvite/getInviteNoLearn", {page});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 已报班接口
    @Action public async getInviteLearn(page:number) {
        const result = await request.postAsync("/userInvite/getInviteLearn", {page});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 获取我的设置
    @Action public async mySetInfo() {
        const result = await request.postAsync("/user/mySetInfo", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 获取我的设置
    @Action public async addOrUpdateUserDetailInfo(data:any) {
        const result = await request.postAsync("/user/addOrUpdateUserDetailInfo", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1])
            }
        })
    }

    // 获取我的消息
    @Action public async getQueryMyMessageNotice() {
        const result = await request.postAsync("/myMessage/queryMyMessageNotice", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1])
            }
        })
    }

    // 当前消息模块变成已读
    @Action public async getQueryMessageNoticeInfo(data:any) {
        const result = await request.postAsync("/myMessage/queryMessageNoticeInfo", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1])
            }
        })
    }

    // 全部已读
    @Action public async updateAllMessageNotice() {
        const result = await request.postAsync("/myMessage/updateAllMessageNotice", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1])
            }
        })
    }

    // 公告消息的列表
    @Action public async getAfficheList(data:any) {
        const result = await request.postAsync("/myMessage/getAfficheList", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1])
            }
        })
    }

    // 非公告消息的列表
    @Action public async queryMessageNoticeList(data:any) {
        const result = await request.postAsync("/myMessage/queryMessageNoticeList", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1])
            }
        })
    }

    // 获取验证码
    @Action public async sendCode(data:any) {
        const result = await request.postAsync("/user/sendCode", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1])
            }
        })
    }

    // 绑定手机号
    @Action public async bindMobile(data:any) {
        const result = await request.postAsync("/user/bindMobile", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                showToast(result[1]?.message + '')
            }
        })
    }

    // 获取打卡banner信息
    @Action public async getClockInMainBannerList() {
        const result = await request.postAsync("/clockIn/getClockInMainBannerList", {displayPlatform: 2});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 获取打卡banner信息
    @Action public async getScoreBannerList() {
        const result = await request.postAsync("/clockIn/getScoreBannerList", {displayPlatform: 2});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 获取打卡主界面信息
    @Action public async getClockInMain() {
        const result = await request.postAsync("/clockIn/getClockInMain", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 获取用户积分接口
    @Action public async getScoreByUserId() {
        const result = await request.postAsync("/clockIn/getScoreByUserId", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 获取积分任务信息
    @Action public async getScoreTaskList() {
        const result = await request.postAsync("/clockIn/getScoreTaskList", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 领取积分
    @Action public async addTaskUserScore(data:any) {
        const result = await request.postAsync("/clockIn/addTaskUserScore", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 积分明细接口 - 取得所有月份
    @Action public async getScoreRecordByMouthList() {
        const result = await request.postAsync("/clockIn/getScoreRecordByMouthList", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 积分明细接口 - 根据月份取得当前月份的明细
    @Action public async getScoreRecordByMouthDetailList(data:any) {
        const result = await request.postAsync("/clockIn/getScoreRecordByMouthDetailList", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 积分明细接口 - 根据月份取得当前月份的明细
    @Action public async readTaskUserScore(data:any) {
        const result = await request.postAsync("/clockIn/readTaskUserScore", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 用户信息 -> 钱包
    @Action public async getUserDetail() {
        const result = await request.postAsync("/wallet/getUserDetail", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                showToast(result[1]?.message + '')
            }
        })
    }

    // 我的钱包的广告信息
    @Action public async getWalletIcon() {
        const result = await request.postAsync("/icon/getWalletIcon", {displayPlatform: 2});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                showToast(result[1]?.message + '')
            }
        })
    }

    // 是否可以提现
    @Action public async isCanWithdraw() {
        const result = await request.postAsync("/wallet/isCanWithdraw", {});
        return new Promise((resolve,reject) => {
            resolve(result[1])
        })
    }

    // 提现验证码
    @Action public async sendSendCode(data:any) {
        const result = await request.postAsync("/wallet/sendCode", data);
        return new Promise((resolve,reject) => {
            resolve(result[1])
        })
    }

    // 提交提现
    @Action public async toWithdraw(data:any) {
        const result = await request.postAsync("/wallet/toWithdraw", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                showToast(result[1]?.message + '')
            }
        })
    }

    // 资金记录 【月】
    @Action public async getRecordMouthList() {
        const result = await request.postAsync("/wallet/getRecordMouthList", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                showToast(result[1]?.message + '')
            }
        })
    }

    // 资金记录 【详情】
    @Action public async getRecordMouthDetail(data:any) {
        const result = await request.postAsync("/wallet/getRecordMouthDetail", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                showToast(result[1]?.message + '')
            }
        })
    }

    // 提现记录
    @Action public async getWithdrawList(data:any) {
        const result = await request.postAsync("/wallet/getWithdrawList", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 我得地址
    @Action public async getaddress() {
        const result = await request.postAsync("/address/getaddress", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 新增编辑地址
    @Action public async addAddressDetail(data:any) {
        const result = await request.postAsync("/address/addAddressDetail", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 新增编辑地址 获取手机号
    @Action public async getUserMoblie() {
        const result = await request.postAsync("/address/getUserMoblie", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 地址详情
    @Action public async getaddressDetail(data:any) {
        const result = await request.postAsync("/address/getaddressDetail", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                showToast(result[1]?.message + '')
            }
        })
    }

    // 地址详情
    @Action public async deleteAddress(data:any) {
        const result = await request.postAsync("/address/deleteAddress", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                showToast(result[1]?.message + '')
            }
        })
    }

    // 获取商场商品信息
    @Action public async getShopGoodSlist() {
        const result = await request.postAsync("/shop/getShopGoodSlist", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                showToast(result[1]?.message + '')
            }
        })
    }
    // 获取商场商品信息
    @Action public async getShopBannerList() {
        const result = await request.postAsync("/shop/getShopBannerList", {displayPlatform: 2});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                showToast(result[1]?.message + '')
            }
        })
    }

    // 获取商场商品信息
    @Action public async goodsDetail(data:any) {
        const result = await request.postAsync("/shop/goodsDetail", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                showToast(result[1]?.message + '')
            }
        })
    }

    // 兑换商品信息
    @Action public async buyGoods(data:any) {
        const result = await request.postAsync("/shop/buyGoods", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                showToast(result[1]?.data + '')
            }
        })
    }

    // 兑换记录
    @Action public async getUserGoodsOrderListPage(data:any) {
        const result = await request.postAsync("/shop/getUserGoodsOrderListPage", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                showToast(result[1]?.message + '')
            }
        })
    }

    // 优惠券列表
    @Action public async getUserCouponListPage(data:any) {
        const result = await request.postAsync("/shop/getUserCouponListPage", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                showToast(result[1]?.message + '')
            }
        })
    }






}

export const PersonalModule = getModule(Personal);
