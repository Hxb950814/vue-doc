 import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import request from "@/utils/request";
 import {showToast} from "@/utils/ui";

@Module({ name: 'Home',  dynamic:true,  namespaced: true, store })

export default class Home extends VuexModule {
    public openId:string = '';
    public nickName: string = '';
    public head: string = '';
    public token:string = '';
    public studentNo:string = '';
    public uId:string = '';

    get getOpenId(){
        const obj =
            JSON.parse(<string>localStorage.getItem("vuexPersistedData")) || {};
        return obj["Home"]?.openId;
    }

    get getUId(){
        const obj =
            JSON.parse(<string>localStorage.getItem("vuexPersistedData")) || {};
        return obj["Home"]?.uId;
    }

    get getStudentNo(){
        const obj =
            JSON.parse(<string>localStorage.getItem("vuexPersistedData")) || {};
        return obj["Home"]?.studentNo;
    }

    get getNickName(){
        const obj =
            JSON.parse(<string>localStorage.getItem("vuexPersistedData")) || {};
        return obj["Home"]?.nickName;
    }

    get getHead(){
        const obj =
            JSON.parse(<string>localStorage.getItem("vuexPersistedData")) || {};
        return obj["Home"]?.head;
    }

    get getToken(){
        const obj =
            JSON.parse(<string>localStorage.getItem("vuexPersistedData")) || {};
        console.log(obj)
        return obj["Home"]?.token;
    }

    @Mutation
    private SET_TOKEN(token: string){
        this.token = token;
    }
    @Mutation
    private SET_UID(uId: string){
        this.uId = uId;
    }
    @Mutation
    private SET_OPENID(openid: string){
        this.openId = openid
    }
    @Mutation
    private SET_NICKNAME(nickName: string){
        this.nickName = nickName
    }
    @Mutation
    private SET_HEAD(head: string){
        this.head = head
    }
    @Mutation
    private REMOVE_TOKEN(token: string){
        this.token = '';
    }
    @Mutation
    private SET_STUDENTNO(studentNo: string){
        this.studentNo = studentNo;
    }

    @Action public setToken(data:any) {
        this.SET_TOKEN(data);
    }


    @Action public setUId(data:any) {
        this.SET_UID(data);
    }

    @Action public setStudentNo(data:any) {
        this.SET_STUDENTNO(data);
    }

    @Action public setOpenId(data:any) {
        this.SET_OPENID(data);
    }

    @Action public setNickName(data:any) {
        this.SET_NICKNAME(data);
    }

    @Action public setHead(data:any) {
        this.SET_HEAD(data);
    }

    @Action public removeToken() {
        this.REMOVE_TOKEN('');
    }

    // 退出登录
    @Action public async setloginOut() {
        const result = await request.postAsync("/user/loginOut", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000'|| result[1]?.code === '200004') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 获取icon
    @Action public async getIconData() {
        const result = await request.postAsync("/icon/getIndexIconAndBannerList", {displayPlatform: 2});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 获取听书列表
    @Action public async getQueryListenCourseListPage(data:any) {
        const result = await request.postAsync("/course/queryListenCourseListPage", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 获取听书详情
    @Action public async getQueryListenCourseInfo(id:string) {
        const result = await request.postAsync("/course/queryListenCourseInfo", {courseListenId: id});

        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 热销课程
    @Action public async getQueryHotCourseList() {
        const result = await request.postAsync("/course/queryHotCourseList", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 所有课程
    @Action public async getQueryAllNoListenCourse() {
        const result = await request.postAsync("/course/queryAllNoListenCourse", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 推荐课程
    @Action public async getQueryRecommendCourseList(data:any) {
        const result = await request.postAsync("/course/queryRecommendCourseList", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 非推荐课程
    @Action public async getQueryAllNoListenCourseList(data:any) {
        const result = await request.postAsync("/course/queryAllNoListenCourseList", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 课程详情
    @Action public async getQueryNoListenCourseInfo(data:any) {
        const result = await request.postAsync("/course/queryNoListenCourseInfo",  data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 课程试听/试看详情
    @Action public async getTryNoListenSectionInfo(data:any) {
        const result = await request.postAsync("/course/tryNoListenSectionInfo", {chapterSectionId: data});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 是否试听结束  未听置为已听
    @Action public async getUpdateListenCourseById(data:any) {
        const result = await request.postAsync("/course/updateListenCourseById", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 积分解锁课程
    @Action public async addCourseUnlock(data:any) {
        const result = await request.postAsync("/course/addCourseUnlock", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                showToast(result[1]?.message + '')
            }
        })
    }



    // 获取支付通道
    @Action public async getSelectPassagewaySetList() {
        const result = await request.postAsync("/wxpay/selectPassagewaySetList", {displayPlatform: 2});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 购买课程
    @Action public async buyWxPayH5(data:any) {
        const result = await request.postAsync("/wxpay/wxPayH5", data);
        return new Promise((resolve,reject) => {
            resolve(result[1])
        })
    }

    // 购买课程 - 视频播放结束
    @Action public async getNoListenSectionBroadcastEnd(data:any) {
        const result = await request.postAsync("/course/noListenSectionBroadcastEnd", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 购买课程 - 获取指定的班主任
    @Action public async getQueryMyClassListByCourseTypeId(data:any) {
        const result = await request.postAsync("/course/queryMyClassListByCourseTypeId", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 购买课程 - 获取指定的班主任
    @Action public async getUserCoupon(data:any) {
        const result = await request.postAsync("/wxpay/getUserCoupon", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 购买课程 - 获取指定的班主任
    @Action public async getUpdateListenCourseLogById(data:any) {
        const result = await request.postAsync("/course/updateListenCourseLogById", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }




}

export const HomeModule = getModule(Home);
