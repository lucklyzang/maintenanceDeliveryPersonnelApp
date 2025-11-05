import Vue from 'vue'
import Router from 'vue-router'
import { getStore } from '@/common/js/utils.js'
import store from '@/store'
const Home = () => import ('@/pages/Home')   
const Login = () => import ('@/pages/Login')
const MyInfo = () => import ('@/pages/MyInfo')
const ModificationPassword = () => import ('@/pages/ModificationPassword')
// 中央运送
const TransHome = () => import('@/pages/transManagementPackage/Home')
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
// 工程维护
const ProjectHome = () => import('@/pages/projectManagementPackage/Home')
const RepairsWorkOrder = () => import('@/pages/projectManagementPackage/taskPage/RepairsWorkOrder')
const DeviceService = () => import('@/pages/projectManagementPackage/taskPage/DeviceService')
const DepartmentService = () => import('@/pages/projectManagementPackage/taskPage/DepartmentService')
const WorkOrderDetails = () => import('@/pages/projectManagementPackage/taskDetailsPage/WorkOrderDetails')
const FillConsumable = () => import('@/pages/projectManagementPackage/taskMessagePage/workOrderMessage/FillConsumable')
const WorkOrderSignature = () => import('@/pages/projectManagementPackage/taskMessagePage/workOrderMessage/WorkOrderSignature')
const workOrderCheck = () => import('@/pages/projectManagementPackage/taskDetailsPage/WorkOrderCheck')
const DepartmentWorkOrderDeatils = () => import('@/pages/projectManagementPackage/taskDetailsPage/DepartmentWorkOrderDeatils')
const DepartmentServiceSignature = () => import('@/pages/projectManagementPackage/taskMessagePage/departmentService/DepartmentServiceSignature')
const DepartmentServiceBill = () => import('@/pages/projectManagementPackage/taskMessagePage/departmentService/DepartmentServiceBill')
const DepartmentServiceIssueReport = () => import('@/pages/projectManagementPackage/taskMessagePage/departmentService/DepartmentServiceIssueReport')
const DeviceServiceDetails = () => import('@/pages/projectManagementPackage/taskDetailsPage/DeviceServiceDetails')
const OperateRecordOrderDetails = () => import('@/pages/projectManagementPackage/taskDetailsPage/OperateRecordOrderDetails')
const CopyDetails = () => import('@/pages/projectManagementPackage/taskDetailsPage/CopyDetails')
const DeviceServiceBill = () => import('@/pages/projectManagementPackage/taskMessagePage/deviceService/DeviceServiceBill')
const OperateRecordBill = () => import('@/pages/projectManagementPackage/taskMessagePage/deviceService/OperateRecordBill')
const CopyRecordBill = () => import('@/pages/projectManagementPackage/taskMessagePage/deviceService/CopyRecordBill')
const DepartmentServiceFillConsumable = () => import('@/pages/projectManagementPackage/taskMessagePage/departmentService/DepartmentServiceFillConsumable')
const EngineeringTaskManagement = () => import('@/pages/projectManagementPackage/engineeringTaskManagementPage/EngineeringTaskManagement')
const SchedulingRepairsTaskDetails = () => import('@/pages/projectManagementPackage/engineeringTaskManagementPage/SchedulingRepairsTaskDetails')
const CreateRepairsTask = () => import('@/pages/projectManagementPackage/engineeringTaskManagementPage/createRepairsTask')
const EditRepairsTask = () => import('@/pages/projectManagementPackage/engineeringTaskManagementPage/EditRepairsTask')
const AutoRepairList = () => import('@/pages/projectManagementPackage/autoRepair/AutoRepairList')
const AutoRepairHistoryRecord = () => import('@/pages/projectManagementPackage/AutoRepair/autoRepairHistoryRecord')
const AutoRepairCreate = () => import('@/pages/projectManagementPackage/autoRepair/AutoRepairCreate')
const AutoRepairTaskSignature = () => import('@/pages/projectManagementPackage/autoRepair/AutoRepairTaskSignature')
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
        component: TransHome,
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
        component: DispatchTask,
        meta: { index: 3 }
      },
      {
        path: '/circulationTask',
        name: 'circulationTask',
        component: CirculationTask,
        meta: { index: 3 }
      },
      {
        path: '/appointTask',
        name: 'appointTask',
        component: AppointTask,
        meta: { index: 3 }
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
        component: TaskScheduling,
        meta: { index: 3 }
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
      },
      // 工程维护路由
      {
        path: '/projectHome',
        name: 'projectHome',
        component: ProjectHome,
        meta: { index: 2 }
      },
      {
        path: '/repairsWorkOrder',
        name: 'repairsWorkOrder',
        component: RepairsWorkOrder,
        meta: { index: 3 }
      },
      {
        path: '/deviceService',
        name: 'deviceService',
        component: DeviceService,
        meta: { index: 3 }
      },
      {
        path: '/departmentService',
        name: 'departmentService',
        component: DepartmentService,
        meta: { index: 3 }
      },
      {
        path: '/workOrderDetails',
        name: 'workOrderDetails',
        component:  WorkOrderDetails
      },
      {
        path: '/fillConsumable',
        name: 'fillConsumable',
        component:  FillConsumable
      },
      {
        path: '/workOrderSignature',
        name: 'workOrderSignature',
        component:  WorkOrderSignature
      },
      {
        path: '/workOrderCheck',
        name: 'workOrderCheck',
        component:  workOrderCheck
      },
      {
        path: '/departmentWorkOrderDeatils',
        name: 'departmentWorkOrderDeatils',
        component:  DepartmentWorkOrderDeatils
      },
      {
        path: '/departmentServiceSignature',
        name: 'departmentServiceSignature',
        component:  DepartmentServiceSignature
      },
      {
        path: '/departmentServiceBill',
        name: 'departmentServiceBill',
        component:  DepartmentServiceBill
      },
      {
        path: '/departmentServiceIssueReport',
        name: 'departmentServiceIssueReport',
        component:  DepartmentServiceIssueReport
      },
      {
        path: '/deviceServiceDetails',
        name: 'deviceServiceDetails',
        component: DeviceServiceDetails
      },
      {
        path: '/deviceServiceBill',
        name: 'deviceServiceBill',
        component: DeviceServiceBill
      },
      {
        path: '/operateRecordBill',
        name: 'operateRecordBill',
        component: OperateRecordBill
      },
      {
        path: '/copyRecordBill',
        name: 'copyRecordBill',
        component: CopyRecordBill
      },
      {
        path: '/operateRecordOrderDetails',
        name: 'operateRecordOrderDetails',
        component: OperateRecordOrderDetails
      },
      {
        path: '/copyDetails',
        name: 'copyDetails',
        component: CopyDetails
      },
      {
        path: '/departmentServiceFillConsumable',
        name: 'departmentServiceFillConsumable',
        component: DepartmentServiceFillConsumable
      },
      {
        path: '/engineeringTaskManagement',
        name: 'engineeringTaskManagement',
        component: EngineeringTaskManagement,
        meta: { index: 3 }
      },
      {
        path: '/schedulingRepairsTaskDetails',
        name: 'schedulingRepairsTaskDetails',
        component: SchedulingRepairsTaskDetails
      },
      {
        path: '/createRepairsTask',
        name: 'createRepairsTask',
        component: CreateRepairsTask
      },
      {
        path: '/editRepairsTask',
        name: 'editRepairsTask',
        component: EditRepairsTask
      },
      {
        path: '/autoRepairList',
        name: 'autoRepairList',
        component: AutoRepairList,
        meta: { index: 3 }
      },
      {
        path: '/autoRepairHistoryRecord',
        name: 'autoRepairHistoryRecord',
        component: AutoRepairHistoryRecord
      },
      { 
        path: '/autoRepairCreate',
        name: 'autoRepairCreate',
        component: AutoRepairCreate
      },
      {
        path: '/autoRepairTaskSignature',
        name: 'autoRepairTaskSignature',
        component: AutoRepairTaskSignature
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