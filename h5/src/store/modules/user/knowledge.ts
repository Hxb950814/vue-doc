 import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import request from "@/utils/request";

@Module({ name: 'Knowledge',  dynamic:true,  namespaced: true, store })

export default class Knowledge extends VuexModule {

    // 获取icon
    @Action public async getIconData() {
        const result = await request.postAsync("/icon/getKnowledgeIcon", {displayPlatform: 2});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 获取我的班级
    @Action public async getmyClassList() {
        const result = await request.postAsync("/course/myClassList", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 求知页面导航
    @Action public async getSeekPageAllCourse() {
        const result = await request.postAsync("/course/seekPageAllCourse", {});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 求知今日课程导航
    @Action public async getSeekPageTodayCourse(page:number) {
        const result = await request.postAsync("/course/seekPageTodayCourse", {page});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 求知其他课程导航
    @Action public async getSeekPageNoListenCourseList(data:any) {
        const result = await request.postAsync("/course/seekPageNoListenCourseList", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 文章列表
    @Action public async getQueryArticleListPage(page:number) {
        const result = await request.postAsync("/article/queryArticleListPage", {page});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 我的收藏文章列表
    @Action public async getQueryArticleCollectListPage(page:number) {
        const result = await request.postAsync("/article/queryArticleCollectListPage", {page});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else{
                reject(result[1]?.message)
            }
        })
    }

    // 文章收藏或者点赞操作
    @Action public async getUpdateArticleCollectOrLike(data:any) {
        const result = await request.postAsync("/article/updateArticleCollectOrLike", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else {
                reject(result[1]?.message)
            }
        })
    }

    // 文章详情
    @Action public async getQueryArticleInfoByIde(id:string) {
        const result = await request.postAsync("/article/queryArticleInfoById", {articleId: id});
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else {
                reject(result[1]?.message)
            }
        })
    }

    // 获取问题类别列表
    @Action public async getQueryQuestionTypeListPage(data:any) {
        const result = await request.postAsync("/question/queryQuestionTypeListPage", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else {
                reject(result[1]?.message)
            }
        })
    }

    // 获取问题列表
    @Action public async getQueryQuestionListPage(data:any) {
        const result = await request.postAsync("/question/queryQuestionListPage", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else {
                reject(result[1]?.message)
            }
        })
    }

    // 获取问题详情
    @Action public async getQueryQuestionById(data:any) {
        const result = await request.postAsync("/question/queryQuestionById", data);
        return new Promise((resolve,reject) => {
            if (result[1]?.code === '000000') {
                resolve(result[1])
            }else {
                reject(result[1]?.message)
            }
        })
    }

}

export const KnowledgeModule = getModule(Knowledge);
