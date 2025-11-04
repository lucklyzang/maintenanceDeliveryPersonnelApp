import Vue from 'vue'
import Router from 'vue-router'
import { getStore } from '@/common/js/utils.js'
import store from '@/store'
const Home = () => import ('@/pages/Home')   
const Login = () => import ('@/pages/Login')
const MyInfo = () => import ('@/pages/MyInfo')
const ModificationPassword = () => import ('@/pages/ModificationPassword')
// 中央运送
const transHome = () => import('@/pages/transManagementPackage/Home')
const DispatchTask = () => import('@/pages/transManagementPackage/taskPage/DispatchTask')
const CirculationTask = () => import('@/pages/transManagementPackage/taskPage/CirculationTask')
const AppointTask = () => import('@/pages/transManagementPackage/taskPage/AppointTask')
const AutonomicTask = () => import('@/pages/transManagementPackage/taskPage/AutonomicTask')
const DispatchTaskSweepCode = () => import('@/pages/transManagementPackage/sweepCodePage/DispatchTaskSweepCode')
const AppointTaskSweepCode = () => import('@/pages/transManagementPackage/sweepCodePage/AppointTaskSweepCode')
const CirculationTaskSweepCode = () => import('@/pages/transManagementPackage/sweepCodePage/CirculationTaskSweepCode')
const CirculationTaskCollectMessage = () => import('@/pages/transManagementPackage/taskMessagePage/CirculationTaskCollectMessage')
const NewCirculationTaskCollectMessage = () => import('@/pages/transManagementPackage/taskMessagePage/NewCirculationTaskCollectMessage')
const NewCirculationTaskConnectMessage = () => import('@/pages/transManagementPackage/taskMessagePage/NewCirculationTaskConnectMessage')
const CirculationTaskCollectMessageSure = () => import('@/pages/transManagementPackage/taskMessagePage/CirculationTaskCollectMessageSure')
const CirculationTaskMessageConnect = () => import('@/pages/transManagementPackage/taskMessagePage/CirculationTaskMessageConnect')
const CirculationTaskConnectMessageSure = () => import('@/pages/transManagementPackage/taskMessagePage/CirculationTaskConnectMessageSure')
const CirculationTaskCondition = () => import('@/pages/transManagementPackage/taskMessagePage/CirculationTaskCondition')
const CurrentCirculationTaskSampleMessage = () => import('@/pages/transManagementPackage/taskMessagePage/CurrentCirculationTaskSampleMessage')
const NewCirculationTaskHistoryDetails = () => import('@/pages/transManagementPackage/taskMessagePage/NewCirculationTaskHistoryDetails')
const TransportTypeMessage = () => import('@/pages/transManagementPackage/medicalTaskPage/TransportTypeMessage')
const DispatchTaskTransferForm = () => import('@/pages/transManagementPackage/taskFormPage/DispatchTaskTransferForm')
const DispatchTaskCancelForm = () => import('@/pages/transManagementPackage/taskFormPage/DispatchTaskCancelForm')
const AppointTaskForm = () => import('@/pages/transManagementPackage/taskFormPage/AppointTaskForm')
const AppointTaskCustomerInfo = () => import('@/pages/transManagementPackage/taskFormPage/AppointTaskCustomerInfo')
const DispatchTaskJudge = () => import('@/pages/transManagementPackage/taskJudgePage/dispatchTaskJudge')
const TaskDetailsMessage = () => import('@/pages/transManagementPackage/taskMessagePage/TaskDetailsMessage')
const PadDispatchTaskCancelForm = () => import('@/pages/transManagementPackage/medicalTaskPage/PadDispatchTaskCancelForm')
const CirculationDetails = () => import('@/pages/transManagementPackage/taskDetailsPage/CirculationDetails')
const DispatchDetails = () => import('@/pages/transManagementPackage/taskDetailsPage/DispatchDetails')
const AppointDetails = () => import('@/pages/transManagementPackage/taskDetailsPage/AppointDetails')
const DispatchTaskPhotoSure = () => import('@/pages/transManagementPackage/sweepCodePage/DispatchTaskPhotoSure')
const DispatchTakePhoto = () => import('@/pages/transManagementPackage/takePhotoPage/DispatchTakePhoto')
const TaskScheduling = () => import('@/pages/transManagementPackage/taskSchedulingPage/TaskScheduling')
const SchedulingDispathTaskDetails = () => import('@/pages/transManagementPackage/taskSchedulingPage/SchedulingDispathTaskDetails')
const SchedulingAppointTaskDetails = () => import('@/pages/transManagementPackage/taskSchedulingPage/SchedulingAppointTaskDetails')
const CreateDispathTask = () => import('@/pages/transManagementPackage/taskSchedulingPage/CreateDispathTask')
const CreateAppointTask = () => import('@/pages/transManagementPackage/taskSchedulingPage/CreateAppointTask')
const EditDispathTask = () => import('@/pages/transManagementPackage/taskSchedulingPage/EditDispathTask')
const EditAppointTask = () => import('@/pages/transManagementPackage/taskSchedulingPage/EditAppointTask')
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
    // 中央运送路由
    {
        path: '/transHome',
        name: 'transHome',
        component: transHome,
        meta: { index: 2 }
    },
    {
        path: '/taskDetailsMessage',
        name: 'taskDetailsMessage',
        component: TaskDetailsMessage
      },
      {
        path: '/dispatchTask',
        name: 'dispatchTask',
        component: DispatchTask
      },
      {
        path: '/circulationTask',
        name: 'circulationTask',
        component: CirculationTask
      },
      {
        path: '/appointTask',
        name: 'appointTask',
        component: AppointTask
      },
      {
        path: '/autonomicTask',
        name: 'autonomicTask',
        component: AutonomicTask
      },
      {
        path: '/dispatchTaskSweepCode',
        name: 'dispatchTaskSweepCode',
        component: DispatchTaskSweepCode
      },
      {
        path: '/appointTaskSweepCode',
        name: 'appointTaskSweepCode',
        component: AppointTaskSweepCode
      },
      {
        path: '/circulationTaskSweepCode',
        name: 'circulationTaskSweepCode',
        component: CirculationTaskSweepCode
      },
      {
        path: '/circulationTaskCollectMessage',
        name: 'circulationTaskCollectMessage',
        component: CirculationTaskCollectMessage
      },
      {
        path: '/newCirculationTaskCollectMessage',
        name: 'newCirculationTaskCollectMessage',
        component: NewCirculationTaskCollectMessage
      },
      {
        path: '/newCirculationTaskConnectMessage',
        name: 'newCirculationTaskConnectMessage',
        component: NewCirculationTaskConnectMessage
      },
      {
        path: '/circulationTaskCollectMessageSure',
        name: 'circulationTaskCollectMessageSure',
        component: CirculationTaskCollectMessageSure
      },
      {
        path: '/circulationTaskMessageConnect',
        name: 'circulationTaskMessageConnect',
        component: CirculationTaskMessageConnect
      },
      {
        path: '/circulationTaskConnectMessageSure',
        name: 'circulationTaskConnectMessageSure',
        component: CirculationTaskConnectMessageSure
      },
      {
        path: '/currentCirculationTaskSampleMessage',
        name: 'currentCirculationTaskSampleMessage',
        component: CurrentCirculationTaskSampleMessage
      },
      {
        path: '/newCirculationTaskHistoryDetails',
        name: 'newCirculationTaskHistoryDetails',
        component: NewCirculationTaskHistoryDetails
      },
      {
        path: '/circulationTaskCondition',
        name: 'circulationTaskCondition',
        component: CirculationTaskCondition
      },
      {
        path: '/transportTypeMessage',
        name: 'transportTypeMessage',
        component: TransportTypeMessage
      },
      {
        path: '/dispatchTaskTransferForm',
        name: 'dispatchTaskTransferForm',
        component: DispatchTaskTransferForm
      },
      {
        path: '/dispatchTaskCancelForm',
        name: 'dispatchTaskCancelForm',
        component: DispatchTaskCancelForm
      },
      {
        path: '/appointTaskForm',
        name: 'appointTaskForm',
        component: AppointTaskForm
      },
      {
        path: '/appointTaskCustomerInfo',
        name: 'appointTaskCustomerInfo',
        component: AppointTaskCustomerInfo
      },
      {
        path: '/dispatchTaskJudge',
        name: 'dispatchTaskJudge',
        component: DispatchTaskJudge
      },
      {
        path: '/padDispatchTaskCancelForm',
        name: 'padDispatchTaskCancelForm',
        component: PadDispatchTaskCancelForm
      },
      {
        path: '/circulationDetails',
        name: 'circulationDetails',
        component: CirculationDetails
      },
      {
        path: '/dispatchDetails',
        name: 'dispatchDetails',
        component: DispatchDetails
      },
      {
        path: '/appointDetails',
        name: 'appointDetails',
        component: AppointDetails
      },
      {
        path: '/dispatchTaskPhotoSure',
        name: 'dispatchTaskPhotoSure',
        component: DispatchTaskPhotoSure
      },
      {
        path: '/dispatchTakePhoto',
        name: 'dispatchTakePhoto',
        component: DispatchTakePhoto
      },
      {
        path: '/taskScheduling',
        name: 'taskScheduling',
        component: TaskScheduling
      },
      {
        path: '/schedulingDispathTaskDetails',
        name: 'schedulingDispathTaskDetails',
        component: SchedulingDispathTaskDetails
      },
      {
        path: '/schedulingAppointTaskDetails',
        name: 'schedulingAppointTaskDetails',
        component: SchedulingAppointTaskDetails
      },
      {
        path: '/createDispathTask',
        name: 'createDispathTask',
        component: CreateDispathTask
      },
      {
        path: '/createAppointTask',
        name: 'createAppointTask',
        component: CreateAppointTask
      },
      {
        path: '/editDispathTask',
        name: 'editDispathTask',
        component: EditDispathTask
      },
      {
        path: '/editAppintTask',
        name: 'editAppintTask',
        component: EditAppointTask
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
    let login = getStore('isLogin');
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