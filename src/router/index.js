import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/news/list',
                    component: () => import(/* webpackChunkName: "donate" */ '../pages/news/list.vue'),
                    meta: { title: '博客管理' }
                },
                {
                    path: '/news/edit',
                    component: () => import(/* webpackChunkName: "donate" */ '../pages/news/edit.vue'),
                    meta: { title: '博客编辑' }
                },
                {
                    path: '/news/add',
                    component: () => import(/* webpackChunkName: "donate" */ '../pages/news/add.vue'),
                    meta: { title: '博客新增' }
                },
                {
                    path: '/image/banner',
                    component: () => import(/* webpackChunkName: "donate" */ '../pages/image/banner.vue'),
                    meta: { title: '轮播图管理' }
                },
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
