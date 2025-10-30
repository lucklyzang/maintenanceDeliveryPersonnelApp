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
const CleanCallTask = () =>
    import ('@/pages/cleanManagementPackage/pages/callTask/callTask')
const CleanChoosePosition = () =>
    import ('@/pages/cleanManagementPackage/pages/callTask/choosePosition')
const CleanWorkerOrderMessage = () =>
    import ('@/pages/cleanManagementPackage/pages/cleanWorkerOrderMessage/cleanWorkerOrderMessage')
const CleanHistoricalTask = () =>
    import ('@/pages/cleanManagementPackage/pages/historicalTask/historicalTask')
const CleanRealtimeTask = () =>
    import ('@/pages/cleanManagementPackage/pages/realtimeTask/realtimeTask')
const ProjectCallTask = () =>
    import ('@/pages/projectManagementPackage/pages/callTask/callTask')
const ProjectWorkerOrderMessage = () =>
    import ('@/pages/projectManagementPackage/pages/projectWorkerOrderMessage/projectWorkerOrderMessage')
const ProjectHistoricalTask = () =>
    import ('@/pages/projectManagementPackage/pages/historicalTask/historicalTask')
const ProjectRealtimeTask = () =>
    import ('@/pages/projectManagementPackage/pages/realtimeTask/realtimeTask')
const TransIndex = () =>
    import ('@/pages/transManagementPackage/pages/index/index')
const TransCallTask = () =>
    import ('@/pages/transManagementPackage/pages/callTask/callTask')
const TransportWorkerOrderMessage = () =>
    import ('@/pages/transManagementPackage/pages/transportWorkerOrderMessage/transportWorkerOrderMessage')
const TransHistoricalTask = () =>
    import ('@/pages/transManagementPackage/pages/historicalTask/historicalTask')
 const TransRealtimeTask = () =>
    import ('@/pages/transManagementPackage/pages/realtimeTask/realtimeTask')
Vue.use(Router)
let baseRoute = [{
        path: '/',
        name: 'login',
        component: Login,
        meta: { index: 0 }
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        meta: { index: 1 }
    },
    {
        path: '/myInfo',
        name: 'myInfo',
        component: MyInfo,
        meta: { index: 1 }
    },
    {
        path: '/modificationPassword',
        name: 'modificationPassword',
        component: ModificationPassword,
        meta: { index: 2 }
    },
    {
        path: '/cleanCallTask',
        name: 'cleanCallTask',
        component: CleanCallTask,
        meta: { keepAlive: true,index: 2 }
    },
    {
        path: '/cleanChoosePosition',
        name: 'cleanChoosePosition',
        component: CleanChoosePosition,
        meta: { index: 3 }
    },
    {
        path: '/cleanWorkerOrderMessage',
        name: 'cleanWorkerOrderMessage',
        component: CleanWorkerOrderMessage,
        meta: { index: 3 }
    },
    {
        path: '/cleanHistoricalTask',
        name: 'cleanHistoricalTask',
        component: CleanHistoricalTask,
        meta: { keepAlive: true, index: 2 }
    },
    {
        path: '/cleanRealtimeTask',
        name: 'cleanRealtimeTask',
        component: CleanRealtimeTask,
        meta: { keepAlive: true, index: 2 }
    },
    {
        path: '/projectCallTask',
        name: 'projectCallTask',
        component: ProjectCallTask,
        meta: { index: 2 }
    },
    {
        path: '/ProjectWorkerOrderMessage',
        name: 'projectWorkerOrderMessage',
        component: ProjectWorkerOrderMessage,
        meta: { index: 3 }
    },
    {
        path: '/projectHistoricalTask',
        name: 'projectHistoricalTask',
        component: ProjectHistoricalTask,
        meta: { keepAlive: true, index: 2 },
    },
    {
        path: '/projectRealtimeTask',
        name: 'projectRealtimeTask',
        component: ProjectRealtimeTask,
        meta: { keepAlive: true, index: 2 }
    },
    {
        path: '/transCallTask',
        name: 'transCallTask',
        component: TransCallTask,
        meta: { index: 3 }
    },
    {
        path: '/transIndex',
        name: 'transIndex',
        component: TransIndex,
        meta: { index: 2 }
    },
    {
        path: '/transportWorkerOrderMessage',
        name: 'transportWorkerOrderMessage',
        component: TransportWorkerOrderMessage,
        meta: { index: 3 }
    },
    {
        path: '/transHistoricalTask',
        name: 'transHistoricalTask',
        component: TransHistoricalTask,
        meta: { keepAlive: true, index: 2 }
    },
    {
        path: '/transRealtimeTask',
        name: 'transRealtimeTask',
        component: TransRealtimeTask,
        meta: { keepAlive: true, index: 2 }
    }
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