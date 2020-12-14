import Vue from "vue";
import Router, { Route }  from 'vue-router';

import HomeRouterModule from './modules/main/home'; // home模块;
import KnowledgeRouterModule from './modules/main/knowledge'; // knowledge模块
import PersonalRouterModule from './modules/main/personal';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: '/',
    scrollBehavior: () => ({
        x: 0,
        y: 0
    }),
    routes: [
        ...HomeRouterModule,
        ...KnowledgeRouterModule,
        ...PersonalRouterModule
    ]
});
router.beforeEach((to: Route, from: Route, next: any) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next();
});


export default router;
