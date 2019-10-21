import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/auth/Login.vue';
import Dashboard from './components/main/dashboard/Dashboard.vue';
import Page1 from './components/main/dashboard/pages1/Page1.vue';
import Flat from './components/main/dashboard/flat/Flat.vue';
import Notification from './components/main/dashboard/notification/Notification.vue'
Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/login',
            component: Login,
            name: 'login',
        },
        {
            path: '/dashboard',
            component: Dashboard,
            name: 'dashboard',
            children: [
                {
                    path: 'flat',
                    component: Flat,
                    name: 'flat',
                },
                {
                    path: 'notification',
                    component: Notification,
                    name: 'notification'
                },
                {
                    path: 'page1',
                    component: Page1,
                    name: 'Page1',
                },
                {
                    path: '/',
                    redirect: "/flat",
                    name: 'flat',
                    component: Flat
                }

            ]
        },
        // {
        //     path: '/dashboard',
        //     component: Dashboard,
        //     name: Dashboard,
        //     children: [
        //         {
        //             path: 'notification',
        //             component: Notification,
        //             name: 'notification',
        //         },
        //         {
        //             path: 'contact',
        //             name: 'contact',
        //             component: Contact
        //         },
        //         {
        //             path: 'about',
        //             name: 'about',
        //             component: About
        //         },
        //         {
        //             path: 'test-params',
        //             name: 'TestParams',
        //             component: TestParams,
        //         },
        //         {
        //             path: '/',
        //             redirect: '/notification',
        //             component: Notification
        //         }
        //     ]
        // },
        {
            path: '/',
            redirect: "/login",
            name: 'login',
            component: Login
        }
    ]
})

