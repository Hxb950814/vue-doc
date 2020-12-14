import { redirectMake } from '../tools';
import Layout from '@/views/layout/Layout.vue';

const groupId = '1001'; // 大id

/* debugger的路由  */
export default [
    {
        meta: {
            title: '调试api'
        },
        path: '/debugger/apiDebug',
        component: () => import('@/views/debugger/apiDebugger.vue')
    }
];
