import Vue from 'vue'
import Router from 'vue-router'
import { getCache } from '@/common/js/utils.js'
import store from '@/store'
const Home = () =>
    import ('@/pages/Home')   
const Login = () =>
    import ('@/pages/Login')
const MyInfo = () =>
    import ('@/pages/MyInfo')
const ModificationPassword = () =>
    import ('@/pages/ModificationPassword')
// const CleanCallTask = () =>
//     import ('@/pages/cleanManagementPackage/pages/callTask/callTask')
// const CleanChoosePosition = () =>
//     import ('@/pages/cleanManagementPackage/pages/choosePosition/choosePosition')
// const CleanWorkerOrderMessage = () =>
//     import ('@/pages/cleanManagementPackage/pages/cleanWorkerOrderMessage/cleanWorkerOrderMessage')
// const CleanHistoricalTask = () =>
//     import ('@/pages/cleanManagementPackage/pages/historicalTask/historicalTask')
//  const CleanRealtimeTask = () =>
//     import ('@/pages/cleanManagementPackage/pages/realtimeTask/realtimeTask')
// const ProjectCallTask = () =>
//     import ('@/pages/projectManagementPackage/pages/callTask/callTask')
// const ProjectWorkerOrderMessage = () =>
//     import ('@/pages/projectManagementPackage/pages/projectWorkerOrderMessage/projectWorkerOrderMessage')
// const ProjectHistoricalTask = () =>
//     import ('@/pages/projectManagementPackage/pages/historicalTask/historicalTask')
//  const ProjectRealtimeTask = () =>
//     import ('@/pages/projectManagementPackage/pages/realtimeTask/realtimeTask')
// const TransIndex = () =>
//     import ('@/pages/transManagementPackage/pages/index/index')
// const TransCallTask = () =>
//     import ('@/pages/transManagementPackage/pages/callTask/callTask')
// const TransportWorkerOrderMessage = () =>
//     import ('@/pages/transManagementPackage/pages/transportWorkerOrderMessage/transportWorkerOrderMessage')
// const TransHistoricalTask = () =>
//     import ('@/pages/transManagementPackage/pages/historicalTask/historicalTask')
//  const TransRealtimeTask = () =>
//     import ('@/pages/transManagementPackage/pages/realtimeTask/realtimeTask')
Vue.use(Router)
let baseRoute = [{
        path: '/',
        name: 'login',
        component: Login
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    {
        path: '/myInfo',
        name: 'myInfo',
        component: MyInfo
    },
    {
        path: '/modificationPassword',
        name: 'modificationPassword',
        component: ModificationPassword
    },
    // {
    //     path: '/cleanCallTask',
    //     name: 'cleanCallTask',
    //     component: CleanCallTask
    // },
    // {
    //     path: '/cleanChoosePosition',
    //     name: 'cleanChoosePosition',
    //     component: CleanChoosePosition
    // },
    // {
    //     path: '/cleanWorkerOrderMessage',
    //     name: 'cleanWorkerOrderMessage',
    //     component: CleanWorkerOrderMessage
    // },
    // {
    //     path: '/cleanHistoricalTask',
    //     name: 'cleanHistoricalTask',
    //     component: CleanHistoricalTask
    // },
    // {
    //     path: '/cleanRealtimeTask',
    //     name: 'cleanRealtimeTask',
    //     component: CleanRealtimeTask
    // },
     // {
    //     path: '/projectCallTask',
    //     name: 'projectCallTask',
    //     component: ProjectCallTask
    // },
    // {
    //     path: '/ProjectWorkerOrderMessage',
    //     name: 'projectWorkerOrderMessage',
    //     component: ProjectWorkerOrderMessage
    // },
    // {
    //     path: '/projectHistoricalTask',
    //     name: 'projectHistoricalTask',
    //     component: ProjectHistoricalTask
    // },
    // {
    //     path: '/projectRealtimeTask',
    //     name: 'projectRealtimeTask',
    //     component: ProjectRealtimeTask
    // },
    // {
    //     path: '/transCallTask',
    //     name: 'transCallTask',
    //     component: TransCallTask
    // },
    // {
    //     path: '/transIndex',
    //     name: 'transIndex',
    //     component: TransIndex
    // },
    // {
    //     path: '/transportWorkerOrderMessage',
    //     name: 'transportWorkerOrderMessage',
    //     component: TransportWorkerOrderMessage
    // },
    // {
    //     path: '/transHistoricalTask',
    //     name: 'transHistoricalTask',
    //     component: TransHistoricalTask
    // },
    // {
    //     path: '/transRealtimeTask',
    //     name: 'transRealtimeTask',
    //     component: TransRealtimeTask
    // }
];
let router = new Router({
    routes: baseRoute,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            // return {
            //     x: 0,
            //     y: 0
            // }
        }
    }
});
router.beforeEach((to, from, next) => {
    let login = getCache('isLogin');
    let name = to.name;
    if (name === 'login') {
        if (login) {
            next({ path: '/home' })
        } else {
            next()
        }
    } else {
        if (login) {
            next()
        } else {
            next({ path: '/' })
        }
    }
});
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};
export default router