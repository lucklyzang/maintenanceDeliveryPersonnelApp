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
// 工程维修
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
// 保洁管理
const CleanHome = () =>
    import ('@/pages/cleanManagementPackage/Home')
const CleanTaskList = () =>
    import ('@/pages/cleanManagementPackage/environmentalManagement/cleaningManagement/TaskList')
const CleaningTask = () =>
    import ('@/pages/cleanManagementPackage/environmentalManagement/cleaningManagement/CleaningTask')
const ForthwithCleaningTaskDetails = () =>
    import ('@/pages/cleanManagementPackage/environmentalManagement/cleaningManagement/ForthwithCleaningTaskDetails')
const ChoosePosition = () =>
    import ('@/pages/cleanManagementPackage/environmentalManagement/cleaningManagement/ChoosePosition')
const SpecialCleaningTaskDetails = () =>
    import ('@/pages/cleanManagementPackage/environmentalManagement/cleaningManagement/SpecialCleaningTaskDetails')
const AddTask = () =>
    import ('@/pages/cleanManagementPackage/environmentalManagement/cleaningManagement/AddTask')
const PollingTaskDetails = () =>
    import ('@/pages/cleanManagementPackage/environmentalManagement/cleaningManagement/PollingTaskDetails')
const PollingTaskDepartmentDetails = () =>
    import ('@/pages/cleanManagementPackage/environmentalManagement/cleaningManagement/PollingTaskDepartmentDetails')
const PollingTaskDepartmentCornerDetails = () =>
    import ('@/pages/cleanManagementPackage/environmentalManagement/cleaningManagement/PollingTaskDepartmentCornerDetails')
const PollingTaskNoCompleteReason = () =>
    import ('@/pages/cleanManagementPackage/environmentalManagement/cleaningManagement/PollingTaskNoCompleteReason')
const ScanQRCode = () =>
    import ('@/pages/cleanManagementPackage/environmentalManagement/cleaningManagement/ScanQRCode')
const AttendanceManagement = () =>
    import ('@/pages/cleanManagementPackage/environmentalManagement/cleaningManagement/AttendanceManagement')
const AttendanceStatistics = () =>
    import ('@/pages/cleanManagementPackage/environmentalManagement/cleaningManagement/AttendanceStatistics')
const AttendanceTypeDetails = () =>
    import ('@/pages/cleanManagementPackage/environmentalManagement/cleaningManagement/AttendanceTypeDetails')
const PersonnelStatisticsDetails = () =>
    import ('@/pages/cleanManagementPackage/environmentalManagement/cleaningManagement/PersonnelStatisticsDetails')
// 设备巡检
const EquipmentPatrolHome = () =>
    import ('@/pages/equipmentPatrolManagementPackage/Home')
const PatrolTaskElectronicSignaturePage = () =>
    import ('@/pages/equipmentPatrolManagementPackage/patrolTask/PatrolTaskElectronicSignaturePage')
const EquipmentPatrolDetails = () =>
    import ('@/pages/equipmentPatrolManagementPackage/patrolTask/EquipmentPatrolDetails')
const EquipmentChecklist = () =>
    import ('@/pages/equipmentPatrolManagementPackage/patrolTask/EquipmentChecklist')
const PatrolAbnormalCheckItemEventList = () =>
    import ('@/pages/equipmentPatrolManagementPackage/patrolTask/PatrolAbnormalCheckItemEventList')
const PatrolAbnormalRecord = () =>
    import ('@/pages/equipmentPatrolManagementPackage/patrolTask/PatrolAbnormalRecord')
const HistoryEquipmPatroLTaskList = () =>
    import ('@/pages/equipmentPatrolManagementPackage/patrolTask/HistoryEquipmPatroLTaskList')
const HistoryEquipmentPatrolDetails = () =>
    import ('@/pages/equipmentPatrolManagementPackage/patrolTask/HistoryEquipmentPatrolDetails')
const HistoryEquipmentChecklist = () =>
    import ('@/pages/equipmentPatrolManagementPackage/patrolTask/HistoryEquipmentChecklist')
const HistoryPatrolAbnormalCheckItemEventList = () =>
    import ('@/pages/equipmentPatrolManagementPackage/patrolTask/HistoryPatrolAbnormalCheckItemEventList')
const HistoryPatrolAbnormalRecord = () =>
    import ('@/pages/equipmentPatrolManagementPackage/patrolTask/HistoryPatrolAbnormalRecord')
const EditPatrolAbnormalRecord = () =>
    import ('@/pages/equipmentPatrolManagementPackage/patrolTask/EditPatrolAbnormalRecord')
const EquipmentSpotCheck = () =>
    import ('@/pages/equipmentPatrolManagementPackage/spotCheckTask/EquipmentSpotCheck')
const EquipmentSpotCheckTaskDetails = () =>
    import ('@/pages/equipmentPatrolManagementPackage/spotCheckTask/EquipmentSpotCheckTaskDetails')
const SpotAbnormalRecord = () =>
    import ('@/pages/equipmentPatrolManagementPackage/spotCheckTask/SpotAbnormalRecord')
const SpotAbnormalCheckItemEventList = () =>
    import ('@/pages/equipmentPatrolManagementPackage/spotCheckTask/SpotAbnormalCheckItemEventList')
const HistoryEquipmSpotTaskList = () =>
    import ('@/pages/equipmentPatrolManagementPackage/spotCheckTask/HistoryEquipmSpotTaskList')
const HistoryEquipmentSpotCheckTaskDetails = () =>
    import ('@/pages/equipmentPatrolManagementPackage/spotCheckTask/HistoryEquipmentSpotCheckTaskDetails')
const HistorySpotAbnormalCheckItemEventList = () =>
    import ('@/pages/equipmentPatrolManagementPackage/spotCheckTask/HistorySpotAbnormalCheckItemEventList')
const HistorySpotAbnormalRecord = () =>
    import ('@/pages/equipmentPatrolManagementPackage/spotCheckTask/HistorySpotAbnormalRecord')
const EquipmentSpotList = () =>
    import ('@/pages/equipmentPatrolManagementPackage/spotTaskDispatchingManagement/EquipmentSpotList')
const CreateSpotTask = () =>
    import ('@/pages/equipmentPatrolManagementPackage/spotTaskDispatchingManagement/CreateSpotTask')
const EditSpotTask = () =>
    import ('@/pages/equipmentPatrolManagementPackage/spotTaskDispatchingManagement/EditSpotTask')
const EquipmentList = () =>
    import ('@/pages/equipmentPatrolManagementPackage/equipmentStatusManagement/EquipmentList')
// 安全巡更
const SecurityPatrolHome = () =>
    import ('@/pages/securityPatrolManagementPackage/Home')
const BeaconList = () =>
  import ('@/pages/securityPatrolManagementPackage/BeaconList')
const SecurityPatrolManagementPatrolTaskElectronicSignaturePage = () =>
    import ('@/pages/securityPatrolManagementPackage/patrolTask/PatrolTaskElectronicSignaturePage')
const EventRegisterElectronicSignaturePage = () =>
    import ('@/pages/securityPatrolManagementPackage/eventPage/EventRegisterElectronicSignaturePage')
const PatrolTasklist = () =>
    import ('@/pages/securityPatrolManagementPackage/patrolTask/PatrolTasklist')
const SecurityPatrolManagementWorkOrderDetails = () =>
    import ('@/pages/securityPatrolManagementPackage/patrolTask/WorkOrderDetails')
const ProblemRecord = () =>
    import ('@/pages/securityPatrolManagementPackage/patrolTask/ProblemRecord')
const AreaPatrolDetails = () =>
    import ('@/pages/securityPatrolManagementPackage/patrolTask/AreaPatrolDetails')
const EventList = () =>
    import ('@/pages/securityPatrolManagementPackage/eventPage/EventList')
const RepairsRegister = () =>
    import ('@/pages/securityPatrolManagementPackage/eventPage/RepairsRegister')
const OtherRegister = () =>
    import ('@/pages/securityPatrolManagementPackage/eventPage/OtherRegister')
const ClaimRegister = () =>
    import ('@/pages/securityPatrolManagementPackage/eventPage/ClaimRegister')
const GuestBook = () =>
    import ('@/pages/securityPatrolManagementPackage/guestBookPage/GuestBook')
const PostMessage = () =>
    import ('@/pages/securityPatrolManagementPackage/guestBookPage/postMessage')
const HistoryClaimRegister = () =>
    import ('@/pages/securityPatrolManagementPackage/eventPage/HistoryClaimRegister')
const MoreHistoryClaimRegister = () =>
    import ('@/pages/securityPatrolManagementPackage/eventPage/MoreHistoryClaimRegister')
const HistoryRepairsRegister = () =>
    import ('@/pages/securityPatrolManagementPackage/eventPage/HistoryRepairsRegister')
const MoreHistoryRepairsRegister = () =>
    import ('@/pages/securityPatrolManagementPackage/eventPage/MoreHistoryRepairsRegister')
const HistoryOtherRegister = () =>
    import ('@/pages/securityPatrolManagementPackage/eventPage/HistoryOtherRegister')
const MoreHistoryOtherRegister = () =>
    import ('@/pages/securityPatrolManagementPackage/eventPage/MoreHistoryOtherRegister')                   
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
        component: CurrentCirculationTaskSampleMessage,
        meta: { index: 5 }
      },
      {
        path: '/newCirculationTaskHistoryDetails',
        name: 'newCirculationTaskHistoryDetails',
        component: NewCirculationTaskHistoryDetails
      },
      {
        path: '/circulationTaskCondition',
        name: 'circulationTaskCondition',
        component: CirculationTaskCondition,
        meta: { index: 4 }
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
        component: CirculationDetails,
        meta: { index: 4 }
      },
      {
        path: '/dispatchDetails',
        name: 'dispatchDetails',
        component: DispatchDetails,
        meta: { index: 4 }
      },
      {
        path: '/appointDetails',
        name: 'appointDetails',
        component: AppointDetails,
        meta: { index: 4 }
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
        component: SchedulingDispathTaskDetails,
        meta: { index: 4 }
      },
      {
        path: '/schedulingAppointTaskDetails',
        name: 'schedulingAppointTaskDetails',
        component: SchedulingAppointTaskDetails,
        meta: { index: 4 }
      },
      {
        path: '/createDispathTask',
        name: 'createDispathTask',
        component: CreateDispathTask,
        meta: { index: 4 }
      },
      {
        path: '/createAppointTask',
        name: 'createAppointTask',
        component: CreateAppointTask,
        meta: { index: 4 }
      },
      {
        path: '/editDispathTask',
        name: 'editDispathTask',
        component: EditDispathTask,
        meta: { index: 4 }
      },
      {
        path: '/editAppintTask',
        name: 'editAppintTask',
        component: EditAppointTask,
        meta: { index: 4 }
      },
      // 工程维修路由
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
        component:  workOrderCheck,
        meta: { index: 4 }
      },
      {
        path: '/departmentWorkOrderDeatils',
        name: 'departmentWorkOrderDeatils',
        component:  DepartmentWorkOrderDeatils,
        meta: { index: 4 }
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
        component: SchedulingRepairsTaskDetails,
        meta: { index: 4 }
      },
      {
        path: '/createRepairsTask',
        name: 'createRepairsTask',
        component: CreateRepairsTask,
        meta: { index: 4 }
      },
      {
        path: '/editRepairsTask',
        name: 'editRepairsTask',
        component: EditRepairsTask,
        meta: { index: 4 }
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
        component: AutoRepairHistoryRecord,
        meta: { index: 4 }
      },
      { 
        path: '/autoRepairCreate',
        name: 'autoRepairCreate',
        component: AutoRepairCreate,
        meta: { index: 4 }
      },
      {
        path: '/autoRepairTaskSignature',
        name: 'autoRepairTaskSignature',
        component: AutoRepairTaskSignature,
        meta: { index: 5 }
      },
      // 保洁管理路由
      {
        path: '/cleanHome',
        name: 'cleanHome',
        component: CleanHome,
        meta: { index: 2 }
    },
    {
        path: '/cleaningTask',
        name: 'cleaningTask',
        component: CleaningTask,
        meta: { index: 4 }
    },
    {
        path: '/cleanTaskList',
        name: 'cleanTaskList',
        component: CleanTaskList,
        meta: { index: 3 }
    },
    {
        path: '/addTask',
        name: 'addTask',
        component: AddTask,
        meta: { index: 4 }
    },
    {
        path: '/forthwithCleaningTaskDetails',
        name: 'forthwithCleaningTaskDetails',
        component: ForthwithCleaningTaskDetails,
        meta: { index: 5 }
    },
    {
        path: '/choosePosition',
        name: 'choosePosition',
        component: ChoosePosition,
        meta: { index: 5 }
    },
    {
        path: '/specialCleaningTaskDetails',
        name: 'specialCleaningTaskDetails',
        component: SpecialCleaningTaskDetails,
        meta: { index: 5 }
    },
    {
        path: '/pollingTaskDetails',
        name: 'pollingTaskDetails',
        component: PollingTaskDetails,
        meta: { index: 5 }
    },
    {
        path: '/pollingTaskDepartmentDetails',
        name: 'pollingTaskDepartmentDetails',
        component: PollingTaskDepartmentDetails,
        meta: { index: 6 }
    },
    {
        path: '/pollingTaskDepartmentCornerDetails',
        name: 'pollingTaskDepartmentCornerDetails',
        component: PollingTaskDepartmentCornerDetails,
        meta: { index: 7 }
    },
    {
        path: '/pollingTaskNoCompleteReason',
        name: 'pollingTaskNoCompleteReason',
        component: PollingTaskNoCompleteReason
    },
    {
        path: '/scanQRCode',
        name: 'scanQRCode',
        component: ScanQRCode,
        meta: { index: 3 }
    },
    {
        path: '/attendanceManagement',
        name: 'attendanceManagement',
        component: AttendanceManagement,
        meta: { index: 3 }
    },
    {
        path: '/attendanceStatistics',
        name: 'attendanceStatistics',
        component: AttendanceStatistics,
        meta: { index: 3 }
    },
    {
        path: '/attendanceTypeDetails',
        name: 'attendanceTypeDetails',
        component: AttendanceTypeDetails,
        meta: { index: 4 }
    },
    {
        path: '/personnelStatisticsDetails',
        name: 'personnelStatisticsDetails',
        component: PersonnelStatisticsDetails,
        meta: { index: 5 }
    },

    // 设备巡检路由
    {
      path: '/equipmentPatrolHome',
      name: 'equipmentPatrolHome',
      component: EquipmentPatrolHome,
      meta: { index: 3 }
  },
  {
      path: '/patrolTaskElectronicSignaturePage',
      name: 'patrolTaskElectronicSignaturePage',
      component: PatrolTaskElectronicSignaturePage
  },
  {
      path: '/equipmentPatrolDetails',
      name: 'equipmentPatrolDetails',
      component: EquipmentPatrolDetails,
      meta: { index: 4 }
  },
  {
      path: '/equipmentChecklist',
      name: 'equipmentChecklist',
      component: EquipmentChecklist,
      meta: { index: 5 }
  },
  {
      path: '/patrolAbnormalCheckItemEventList',
      name: 'patrolAbnormalCheckItemEventList',
      component: PatrolAbnormalCheckItemEventList
  },
  {
      path: '/historyEquipmPatroLTaskList',
      name: 'historyEquipmPatroLTaskList',
      component: HistoryEquipmPatroLTaskList,
      meta: { index: 5 }
  },
  {
      path: '/historyEquipmentPatrolDetails',
      name: 'historyEquipmentPatrolDetails',
      component: HistoryEquipmentPatrolDetails
  },
  {
      path: '/historyEquipmentChecklist',
      name: 'historyEquipmentChecklist',
      component: HistoryEquipmentChecklist
  },
  {
      path: '/historyPatrolAbnormalCheckItemEventList',
      name: 'historyPatrolAbnormalCheckItemEventList',
      component: HistoryPatrolAbnormalCheckItemEventList
  },
  {
      path: '/historyPatrolAbnormalRecord',
      name: 'historyPatrolAbnormalRecord',
      component: HistoryPatrolAbnormalRecord
  },
  {
      path: '/patrolAbnormalRecord',
      name: 'patrolAbnormalRecord',
      component: PatrolAbnormalRecord
  },
  {
      path: '/editPatrolAbnormalRecord',
      name: 'editPatrolAbnormalRecord',
      component: EditPatrolAbnormalRecord
  },
  {
      path: '/equipmentSpotCheck',
      name: 'equipmentSpotCheck',
      component: EquipmentSpotCheck
  },
  {
      path: '/equipmentSpotCheckTaskDetails',
      name: 'equipmentSpotCheckTaskDetails',
      component: EquipmentSpotCheckTaskDetails
  },
  {
      path: '/spotAbnormalRecord',
      name: 'spotAbnormalRecord',
      component: SpotAbnormalRecord
  },
  {
      path: '/spotAbnormalCheckItemEventList',
      name: 'spotAbnormalCheckItemEventList',
      component: SpotAbnormalCheckItemEventList
  },
  {
      path: '/historyEquipmSpotTaskList',
      name: 'historyEquipmSpotTaskList',
      component: HistoryEquipmSpotTaskList
  },
  {
      path: '/historyEquipmentSpotCheckTaskDetails',
      name: 'historyEquipmentSpotCheckTaskDetails',
      component: HistoryEquipmentSpotCheckTaskDetails
  },
  {
      path: '/historySpotAbnormalCheckItemEventList',
      name: 'historySpotAbnormalCheckItemEventList',
      component: HistorySpotAbnormalCheckItemEventList
  },
  {
      path: '/historySpotAbnormalRecord',
      name: 'historySpotAbnormalRecord',
      component: HistorySpotAbnormalRecord
  },
  {
      path: '/equipmentSpotList',
      name: 'equipmentSpotList',
      component: EquipmentSpotList
  },
  {
      path: '/createSpotTask',
      name: 'createSpotTask',
      component: CreateSpotTask
  },
  {
      path: '/editSpotTask',
      name: 'editSpotTask',
      component: EditSpotTask
  },
  {
      path: '/equipmentList',
      name: 'equipmentList',
      component: EquipmentList,
      meta: { index: 4 }
  },

  // 安全巡更
  {
    path: '/securityPatrolHome',
    name: 'securityPatrolHome',
    component: SecurityPatrolHome,
    meta: { index: 3 }
  },
  {
      path: '/beaconList',
      name: 'beaconList',
      component: BeaconList,
      meta: { index: 4 }
  },
  {
      path: '/securityPatrolManagementPatrolTaskElectronicSignaturePage',
      name: 'securityPatrolManagementPatrolTaskElectronicSignaturePage',
      component: SecurityPatrolManagementPatrolTaskElectronicSignaturePage,
      meta: { index: 6 }
  },
  {
      path: '/eventRegisterElectronicSignaturePage',
      name: 'eventRegisterElectronicSignaturePage',
      component: EventRegisterElectronicSignaturePage,
      meta: { index: 6 }
  },
  {
      path: '/patrolTasklist',
      name: 'patrolTasklist',
      component: PatrolTasklist,
      meta: { index: 4 }
  },
  {
      path: '/securityPatrolManagementWorkOrderDetails',
      name: 'securityPatrolManagementWorkOrderDetails',
      component: SecurityPatrolManagementWorkOrderDetails,
      meta: { index: 5 }
  },
  {
      path: '/problemRecord',
      name: 'problemRecord',
      component: ProblemRecord
  },
  {
      path: '/areaPatrolDetails',
      name: 'areaPatrolDetails',
      component: AreaPatrolDetails,
      meta: {
          keepAlive: true
      }
  },
  {
      path: '/eventList',
      name: 'eventList',
      component: EventList,
      meta: { index: 4 }

  },
  {
      path: '/repairsRegister',
      name: 'repairsRegister',
      component: RepairsRegister,
      meta: { index: 5 }

  },
  {
      path: '/otherRegister',
      name: 'otherRegister',
      component: OtherRegister,
      meta: { index: 5 }

  },
  {
      path: '/claimRegister',
      name: 'claimRegister',
      component: ClaimRegister,
      meta: { index: 5 }

  },
  {
      path: '/historyClaimRegister',
      name: 'historyClaimRegister',
      component: HistoryClaimRegister,
      meta: { index: 5 }

  },
  {
      path: '/guestBook',
      name: 'guestBook',
      component: GuestBook,
      meta: { index: 4 }

  },
  {
      path: '/postMessage',
      name: 'postMessage',
      component: PostMessage,
      meta: { index: 5 }

  },
  {
      path: '/moreHistoryClaimRegister',
      name: 'moreHistoryClaimRegister',
      component: MoreHistoryClaimRegister,
      meta: { index: 6 }

  },
  {
      path: '/historyRepairsRegister',
      name: 'historyRepairsRegister',
      component: HistoryRepairsRegister,
      meta: { index: 5 }

  },
  {
      path: '/moreHistoryRepairsRegister',
      name: 'moreHistoryRepairsRegister',
      component: MoreHistoryRepairsRegister,
      meta: { index: 6 }

  },
  {
      path: '/historyOtherRegister',
      name: 'historyOtherRegister',
      component: HistoryOtherRegister,
      meta: { index: 5 }

  },
  {
      path: '/moreHistoryOtherRegister',
      name: 'moreHistoryOtherRegister',
      component: MoreHistoryOtherRegister,
      meta: { index: 6 }

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