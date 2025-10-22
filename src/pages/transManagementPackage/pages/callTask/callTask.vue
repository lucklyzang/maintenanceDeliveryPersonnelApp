<template>
  <view class="content-box">
   <u-transition :show="showLoadingHint" mode="fade-down">
   	<view class="loading-box" v-if="showLoadingHint">
   		<u-loading-icon :show="showLoadingHint" :text="infoText" size="18" textSize="16"></u-loading-icon>
   	</view>
   </u-transition>
	 <light-hint ref="alertToast"></light-hint>
   <view class="top-background-area" :style="{ 'height': statusBarHeight + navigationBarHeight + 5 + 'px' }"></view>
   <u-toast ref="uToast" />
   <view class="nav">
   	<nav-bar :home="false" :isShowBackText="true" backState='3000' fontColor="#FFF" bgColor="none" :title="titleText" @backClick="backTo">
   	</nav-bar> 
   </view>
    <!-- 病人编辑弹框 -->
		<view class="u-modal-center-box">
			<u-modal :show="patienModalShow" :title="isPressEdit ? `病人${updateIndex+1}`:`病人信息`" 
				:showCancelButton="true"
				:title-style="{color: '#000000',textAlign: 'left',fontSize: '18px'}"
				@confirm="patienModalSure"
				@cancel="patienModalCancel"
				>
				<scroll-view  scroll-y="true" class="scroll-Y slot-content">
					<view class="field-four">
						<view class="contact-isolation-box">
							<view>
								<text>*</text>
								<text>接触隔离:</text>
							</view>
							<view>
								<u-radio-group v-model="patienModalMessage.isContactisolationValue" activeColor="#101010">
									<u-radio name="1" label="是" labelColor="#101010"></u-radio>
									<u-radio name="0" label="否" labelColor="#101010"></u-radio>
								</u-radio-group>
							</view>
						</view>
					</view>
					<view class="bedNumberBox scroll-view-item">
						<view>床号</view>
						<view>
							<u-input v-model="patienModalMessage.bedNumber" border="none" placeholder="请输入床号" />
						</view>
					</view>
					<view class="bedNumberBox scroll-view-item">
						<view>姓名</view>
						<view>
							<u-input v-model="patienModalMessage.patientName" border="none" placeholder="请输入姓名" />
						</view>
					</view>
					<view class="bedNumberBox scroll-view-item">
						<view>住院号</view>
						<view>
							<u-input v-model="patienModalMessage.patientNumber" border="none" placeholder="请输入住院号" />
						</view>
					</view>
					<view class="genderBox scroll-view-item">
						<view>性别</view>
						<view>
							<u-radio-group v-model="patienModalMessage.genderValue" activeColor="#101010">
								<u-radio name="0" label="未知" labelColor="#101010"></u-radio>
								<u-radio name="1" label="男" labelColor="#101010"></u-radio>
								<u-radio name="2" label="女" labelColor="#101010"></u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="bedNumberBox scroll-view-item transport-number">
						<view>运送数量</view>
						<view>
							<u-input v-model="patienModalMessage.actualData" disabled border="none" type="number" />
						</view>
					</view>
					<view class="bedNumberBox scroll-view-item transport-number">
						<view>年龄</view>
						<view>
							<u-input v-model="patienModalMessage.patientAgeValue" type="digit" placeholder="请输入年龄" />
						</view>
					</view>
					<view class="transportBox scroll-view-item">
						<view>运送类型</view>
						<view v-if="xflSelectShow">
							<xfl-select :list="patienModalMessage.sampleList" disabled :clearable="false" :showItemNum="5" :isCanInput="true" :showList="transportParentControlListShow"
							 :style_Container="'height: 50px; font-size: 16px;'" :initValue="patienModalMessage.sampleValue" @change="transportParentChange"
							 @input="transportParentInputEvent" @visible-change="transportParentVisibleChange">
							</xfl-select>
						</view>
					</view>
					<view class="transport-type-child-box scroll-view-item">
						<view class="transport-type-child-content" v-for="(innerItem,innerIndex) in patienModalMessage.transportList"
									:key="innerItem.id">
							<view :class="{'transTypeListStyle': innerItem.typerNumber > 0 }">
								{{innerItem.text}}
							</view>
							<view>
								<stepNumberBox
								  v-model="patienModalMessage.transportList[innerIndex].typerNumber"
									@plus="plusNum(arguments)"
									@inputBlur="inputBlurEvent(arguments)"
									:innerIndex="innerIndex"
									@minus="minusNum(arguments)"
									@change="stepperValChange(arguments)"
								></stepNumberBox>
							</view>
						</view>
					</view>
				</scroll-view>
			</u-modal>
		</view>
    <!-- 起点科室 -->
    <view class="transport-rice-box" v-if="showStartDepartment">
      <ScrollSelection v-model="showStartDepartment" :pickerValues="startDepartmentDefaultIndex" :columns="startDepartmentList" title="起点科室" @sure="startDepartmentSureEvent" @cancel="startDepartmentCancelEvent" @close="startDepartmentCloseEvent" :isShowSearch="true"/>
    </view>
    <!-- 终点科室(模板一单选) -->
    <view class="transport-rice-box" v-if="showEndDepartment">
      <ScrollSelection v-model="showEndDepartment" :pickerValues="endDepartmentDefaultIndex" :columns="endDepartmentList" title="终点科室" @sure="endDepartmentSureEvent" @cancel="endDepartmentCancelEvent" @close="endDepartmentCloseEvent" :isShowSearch="true" />
    </view>
    <!-- 终点科室(模板二多选) -->
    <view class="transport-rice-box" v-if="showGoalSpaces">
      <BottomSelect v-model="showGoalSpaces" :columns="goalSpacesOption" title="终点科室" :currentSelectData="currentGoalSpaces" @sure="goalSpacesSureEvent" @cancel="goalSpacesCancelEvent" @close="goalSpacesCloseEvent" />
    </view>
    <!-- 运送员 -->
    <view class="transport-rice-box" v-if="showTransporter">
      <ScrollSelection v-model="showTransporter" :pickerValues="transporterDefaultIndex" :columns="transporterList" title="运送员" @sure="transporterSureEvent" @cancel="transporterCancelEvent" @close="transporterCloseEvent" />
    </view>
    <!-- 转运工具 -->
    <view class="transport-rice-box" v-if="showTransportTool">
      <ScrollSelection v-model="showTransportTool" :pickerValues="transportToolDefaultIndex" :columns="transportToolList" title="转运工具" @sure="transportToolSureEvent" @cancel="transportToolCancelEvent" @close="transportToolCloseEvent" />
    </view>
     <!-- 性别 -->
    <view class="transport-rice-box" v-if="showGender">
      <ScrollSelection v-model="showGender" :pickerValues="genderDefaultIndex" :columns="genderList" title="性别" @sure="genderSureEvent" @cancel="genderCancelEvent" @close="genderCloseEvent" />
    </view>
	<view class="message-box">
		<view class="message-one">
			<view class="message-one-left">
				优先级
			</view>
			<view class="message-one-right">
				<u-radio-group v-model="priorityRadioValue" direction="horizontal">
					<u-radio name="1" activeColor="#289E8E" labelColor="#289E8E" label="正常"></u-radio>
					<u-radio name="2" activeColor="#E8CB51" labelColor="#E8CB51" label="重要"></u-radio>
					<u-radio name="3" activeColor="#F2A15F" labelColor="#F2A15F" label="紧急"></u-radio>
					<u-radio name="4" activeColor="#E86F50" labelColor="#E86F50" label="紧急重要"></u-radio>
				</u-radio-group>
			</view>
		</view>
		<view class="transport-type" v-if="templateType === 'template_one'">
			<view class="transport-type-left">
				<text>运送类型</text>
			</view>
			<view class="transport-type-right">
				<text class="transport-type-list" :class="{'transportTypeListStyle': transportTypeIndex == index}" 
					v-for="(item,index) in transportTypeList"
					@click="transportTypeEvent(item,index)" 
					:key="index"
					>
					{{ item.text }}
				</text>
			</view>
		</view>
		<view class="select-box">
			<view class="select-box-left">
				<text>*</text>
				<text>起点科室</text>
			</view>
			<view class="select-box-right" @click="showStartDepartment = true">
				<text>{{ currentStartDepartment }}</text>
				<u-icon name="arrow-right" color="#989999" size="20"></u-icon>
			</view>
		</view>
		<view class="message-one is-back task-total" v-if="templateType === 'template_two'">
			<view class="trans-total-title">
				该任务运送总数
			</view>
			<view class="trans-total-content">
				<u-input v-model="taskTransportTotal" type="digit" readonly border="none" />
			</view>
		</view>
		<view class="select-box end-select-box">
			<view class="select-box-left">
				<text>终点科室</text>
			</view>
			<view class="select-box-right" @click="templateType === 'template_one' ? showEndDepartment = true : showGoalSpaces = true">
				<text>{{ templateType === 'template_one' ? currentEndDepartment : disposeTaskPresent(currentGoalSpaces)}}</text>
				<u-icon name="arrow-right" color="#989999" size="20"></u-icon>
			</view>
		</view>
		<view class="select-box end-select-box">
			<view class="select-box-left">
				<text>运送员</text>
			</view>
			<view class="select-box-right" @click="showTransporter = true">
				<text>{{ currentTransporter }}</text>
				<u-icon name="arrow-right" color="#989999" size="20"></u-icon>
			</view>
		</view>
		<view class="select-box end-select-box">
			<view class="select-box-left">
				<text>转运工具</text>
			</view>
			<view class="select-box-right" @click="showTransportTool = true">
				<text>{{ currentTransportTool }}</text>
				<u-icon name="arrow-right" color="#989999" size="20"></u-icon>
			</view>
		</view>
		<view class="patient-message-box" v-if="templateType === 'template_one'">
			<view class="patient-message-top">
				<view class="creat-form-field">
					<text>床号</text>
					<u-input v-model="patientNumberValue" border="bottom" placeholder="请输入" />
				</view>
				<view class="creat-form-field">
					<text>姓名</text>
					<u-input v-model="patientNameValue" border="bottom" placeholder="请输入" />
				</view>
			</view>
			<view class="patient-message-top patient-message-bottom">
				<view class="creat-form-field">
					<text>住院号</text>
					<u-input v-model="admissionNumberValue" border="bottom" placeholder="请输入" />
				</view>
				<view class="creat-form-field">
					<text>年龄</text>
					<u-input v-model="patientAgeValue" type="digit" border="bottom" placeholder="请输入" />
				</view>
			</view>
			<view class="patient-message-bottom-age">
				<view class="patient-message-bottom-right">
					<text>运送数量</text>
					<u-input v-model="transportNumberValue" border="bottom" type="digit" placeholder="请输入运输数量" />
				</view>
				<view class="contact-isolation-box">
					<view>接触隔离</view>
					<view>
						<u-radio-group v-model="isContactisolationValue">
							<u-radio name="1" activeColor="#3B9DF9" label="是"></u-radio>
							<u-radio name="0" activeColor="#3B9DF9" label="否"></u-radio>
						</u-radio-group>
					</view>
				</view>
			</view>
		</view>
		<view class="field-box-wrapper" v-if="templateType === 'template_two'">
			<view class="field-box-two" v-for="(item,index) in templatelistTwo" :key="item">
				<view class="field-title">
					<view class="patient-name">病人{{index+1}}</view>
					<view class="icon-area">
						<u-icon name="trash" v-if="index > 0" @click="deletetMessage(index)" color="#E86F50"  size="22" /></u-icon>
						<u-icon name="edit-pen" @click="editMessage(index)" color="#3B9DF9" size="22"></u-icon>
					</view>
				</view>
				<view class="field-wrapper">
					<view class="field-four">
						<view class="contact-isolation-box">
							<view>接触隔离:</view>
							<view>
							 {{ item.isContactisolationValue == 1 ? '是' : item.isContactisolationValue === null ? '' : '否' }}
							</view>
						</view>
					</view>
					<view class="field-one">
						<view class="creat-form-field">
							<text>床号</text>
							<u-input v-model="item.bedNumber"  border="none" disabled :clearable="false">
							</u-input>
						</view>
						<view class="creat-form-field">
							<text>姓名</text>
							<u-input v-model="item.patientName"  border="none" disabled :clearable="false">
							</u-input>
						</view>
						<view class="creat-form-field">
							<text>性别</text>
							<u-input v-model="item.genderValue" border="none" disabled :clearable="false">
							</u-input>
						</view>
					</view>
					<view class="field-two">
						<view class="creat-form-field">
							<text>住院号</text>
							<u-input v-model="item.patientNumber" border="none" disabled :clearable="false">
							</u-input>
						</view>
						<view class="creat-form-field">
							<text>运送数量</text>
							<u-input disabled v-model="item.actualData" type="text" border="none" disabled :clearable="false">
							</u-input>
						</view>
						<view class="creat-form-field">
							<text>年龄</text>
							<u-input v-model="item.patientAgeValue" border="none" disabled :clearable="false" type="number">
							</u-input>
						</view>
					</view>
					<view class="field-three">
						<view class="sample-box">
							<view>运送类型:</view>
							<view>
								{{item.sampleValue}}
							</view>
							<view>
							{{jointTransportMessage(index)}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="add-message" @click="addMessageEvent" v-if="templateType === 'template_two'">
					<u-icon name="plus" color="#43c3f3" size="16"></u-icon>
					添加病人信息
			</view>
		</view>
		<view class="select-box end-select-box" v-if="templateType === 'template_one'">
			<view class="select-box-left">
				<text>性别</text>
			</view>
			<view class="select-box-right" @click="showGender = true">
				<text>{{ currentGender }}</text>
				<u-icon name="arrow-right" color="#989999" size="20"></u-icon>
			</view>
		</view>
		<view class="message-one is-back">
			<view class="message-one-left">
				运送员是否返回
			</view>
			<view class="transport-isBack">
				<u-radio-group v-model="isBackRadioValue">
					<u-radio name="0" activeColor="#2c9af1" label="否"></u-radio>
					<u-radio name="1" activeColor="#2c9af1" label="是"></u-radio>
				</u-radio-group>
			</view>
		</view>
		<view class="task-describe">
			<text>任务描述</text>
			<u--textarea v-model="taskDescribe" placeholder="请输入任务描述" border="none"></u--textarea>
		</view>
	</view>
	<view class="btn-box">
	  <text class="operate-one" @click="getTransConfig">确认</text>
	  <text class="operate-two" @click="cancelEvent">取消</text>
	</view>
  </view>
</template>
<script>
import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		setCache,
		removeAllLocalStorage
	} from '@/common/js/utils'
	import {
		queryTransportTypeClass,
		queryTransportTools,
		queryTransportType,
		queryAllDestination,
		generateDispatchTask,
		generateDispatchTaskManyNew,
		queryTransConfig,
		getTransporter
} from '@/api/transport.js'
import StepNumberBox from '@/transManagementPackage/pages/components/step-number-box/step-number-box.vue'
import _ from 'lodash'
import navBar from "@/components/zhouWei-navBar"
import ScrollSelection from "@/components/scrollSelection/scrollSelection";
import BottomSelect from "@/components/bottomSelect/bottomSelect";
import LightHint from "@/components/light-hint/light-hint.vue";
export default {
  components: {
    ScrollSelection,
    BottomSelect,
    StepNumberBox,
		navBar,
		LightHint
  },
  data() {
    return {
			titleText: '',
			showLoadingHint: false,
			infoText: '加载中···',
      taskDescribe: '',
      patientNumberValue: '',
      patientNameValue: '',
      taskTransportTotal: 12,
      admissionNumberValue: '',
      transportNumberValue: '',
      patientAgeValue: '',
      commonTransportList: [],
      transportPartentSelected: true,
      isContactisolationValue: null,
      showStartDepartment: false,
      currentStartDepartment: '请选择',
      startDepartmentList: [],
			startDepartmentDefaultIndex: [0],
      showEndDepartment: false,
      currentEndDepartment: '请选择',
      endDepartmentList: [],
			endDepartmentDefaultIndex: [0],
      showTransporter: false,
      currentTransporter: '请选择',
      currentTransporterValue: '',
      transporterList: [],
			transporterDefaultIndex: [0],
      showTransportTool: false,
      currentTransportTool: '无工具',
      transportToolList: [],
			transportToolDefaultIndex: [0],
      showGender: false,
      currentGender: '请选择',
			genderDefaultIndex: [0],
      genderList: [
        {
        	id: '0',
        	text: '未知'
        },
        {
        	id: '1',
        	text: '男'
        },
        { 
        	id: '2',
        	text: '女'
        }
      ],
      currentTransportRice: '请选择',
      currentTransportRiceValue: '',
      transportTypeIndex: null,
      currentTransportType: '',
      transportTypeList: [],
      moveInfo: {
        startX: ''
      },
      priorityRadioValue: '1',
      isBackRadioValue: '0',
      functionListIndex: 0,
      overlayShow: false,
      rightMenuShow: false,
      patienModalShow: false,
      transportParentControlListShow: false,
      goalSpacesOption: [],
      showGoalSpaces: false,
      currentGoalSpaces: [],
      transportTypeParent: [],
      templatelistTwo: [
        {
          bedNumber: '',
          patientName: '',
          patientNumber: '',
          patientAgeValue: '',
          genderValue: '未知',
          actualData: 0,
          sampleValue: '',
          sampleList: [],
          sampleId: '',
          transportList: [],
          generList: [],
          isContactisolationValue: null
        }
      ],
      patienModalMessage: {
        bedNumber: '',
        patientName: '',
        patientNumber: '',
        patientAgeValue: '',
				patientAgeValue: '',
        actualData: 0,
        genderValue: '0',
        isContactisolationValue: null,
        transportList: [],
        sampleList: [],
        sampleValue: '',
        sampleId: ''
      },
      xflSelectShow: false,
      isPressEdit: false,
      updateIndex: 0
    }
  },
	
	onLoad: function (option) {
		this.currentTransportRice = JSON.parse(option.msg)['text'];
		this.currentTransportRiceValue = JSON.parse(option.msg)['value'];
		this.titleText =this.currentTransportRice;
		this.parallelFunction();
		// 根据运送大类查询运送类型小类
		this.querytransportChildByTransportParent('',this.currentTransportRiceValue,this.templateType);
	},

  watch: {
    // 监听每个病人对应的运送类型数量
    templatelistTwo: {
      handler(newVal,oldVal) {
        this.taskTransportTotal  = this.templatelistTwo.reduce((accumulator, currentValue) => {
          return accumulator + Number(currentValue.actualData)
        },0);
        if (this.taskTransportTotal >= 1) {
          this.transportPartentSelected = false
        } else {
          this.transportPartentSelected = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters([
			"userInfo",
			"templateType",
			'statusBarHeight',
			'navigationBarHeight',
			'chooseHospitalArea'
		]),
		userName() {
			return this.userInfo['name']
		},
		proName () {
		  return this.userInfo['proName']
		},
		proId() {
			return this.userInfo['proId']
		},
		workerId() {
			return this.userInfo['user']['id']
		},
		depId() {
			return this.userInfo['depId'] === null ? '' : this.userInfo['depId']
		},
		depName() {
			return this.userInfo['depName'] === null ? '' : this.userInfo['depName']
		},
		userAccount() {
			return this.userInfo['userName']
		}
  },

  methods: {
    ...mapMutations(["storeCurrentIndex"]),
		
		// 顶部导航返回事件
		backTo () {
			uni.navigateBack()
		},
		
    // 添加病人信息事件
    addMessageEvent () {
      // 必须选择运送大类后才能添加病人信息
      if (this.currentTransportRice == '请选择' || !this.currentTransportRice) {
				this.$refs.uToast.show({
					message: '请选择运送大类',
				});
        return
      };
      this.isPressEdit = false;
      this.patienModalShow = true;
      this.xflSelectShow = true;
      this.patienModalMessage = {};
      this.patienModalMessage = _.cloneDeep({
        bedNumber: '',
        patientName: '',
        patientNumber: '',
        patientAgeValue: '',
        isContactisolationValue: null,
        actualData: 0,
        genderValue: '0',
        transportList: _.cloneDeep(this.commonTransportList), //病人信息模态框中根据运送大类查询出的运送小类列表
        sampleList: this.transportTypeParent, //病人信息模态框中运送大类列表
        sampleValue: this.currentTransportRice, //病人信息模态框中选中的运送大类名称
        sampleId: this.transportRiceList.filter((item) => { return item.text ==  this.currentTransportRice })[0]['value'] //病人信息模态框中选中的运送大类id
      })
    },

    // 病人信息删除事件
    deletetMessage (index) {
      this.templatelistTwo.splice(index,1)
    },

    // 病人信息编辑事件
    editMessage(index) {
      // 没有选择运送大类时禁止编辑
      if (this.currentTransportRice == '请选择' || !this.currentTransportRice) {
				this.$refs.uToast.show({
					message: '请选择运送大类',
				});
        return
      };
      this.updateIndex = index;
      this.isPressEdit = true;
      this.xflSelectShow = true;
      this.patienModalShow = true;
      this.patienModalMessage = {};
      this.patienModalMessage = _.cloneDeep(this.templatelistTwo[index]);
      this.transferGenderTwo();
      //病人信息展示框运送大类、运送小类为空时,给编辑病人信息模态框的运送大类和小类赋值)
      if (!this.templatelistTwo[index]['sampleValue']) {
        this.patienModalMessage['sampleList']  = this.transportTypeParent; //病人信息模态框中运送大类列表 
        this.patienModalMessage['sampleValue'] = this.currentTransportRice; //病人信息模态框中选中的运送大类名称
        this.patienModalMessage['sampleId'] = this.transportRiceList.filter((item) => { return item.text ==  this.currentTransportRice })[0]['value']; //病人信息模态框中选中的运送大类id
        this.patienModalMessage['transportList'] = _.cloneDeep(this.commonTransportList) //病人信息模态框中根据运送大类查询出的运送小类列表
      };
      if (this.templatelistTwo[index].actualData == 0) {
        this.patienModalMessage['transportList'] = _.cloneDeep(this.commonTransportList) //病人信息模态框中根据运送大类查询出的运送小类列表
      }
    },

    // 病人模态框信息确认事件
    patienModalSure () {
			this.patienModalShow = false;
      if (this.isPressEdit) {
        this.templatelistTwo.splice(this.updateIndex, 1,_.cloneDeep(this.patienModalMessage));
        this.transferGenderOne(this.updateIndex)
      } else {
        this.templatelistTwo.push(_.cloneDeep(this.patienModalMessage));
        if (this.templatelistTwo[this.templatelistTwo.length-1].genderValue === '1') {
          this.templatelistTwo[this.templatelistTwo.length-1].genderValue = '男'
        } else if (this.templatelistTwo[this.templatelistTwo.length-1].genderValue === '2') {
          this.templatelistTwo[this.templatelistTwo.length-1].genderValue = '女'
        } else if (this.templatelistTwo[this.templatelistTwo.length-1].genderValue === '0'){
          this.templatelistTwo[this.templatelistTwo.length-1].genderValue = '未知'
        }
      };
      this.xflSelectShow = false
    },

    // 病人模态框信息取消事件
    patienModalCancel() {
			this.patienModalShow = false;
      this.xflSelectShow = false;
    },

    // 运送类型大类下拉框值变化时事件
    sampleListValueChange (index) {
      this.querytransportChildByTransportParent(index,this.templatelistTwo[index].sampleValue,this.templateType);
      this.templatelistTwo[index].actualData = 0
    },

    // 运送类型大类选择列表变化时
    transportParentChange(val) {
      this.querytransportChildByTransportParent(val.parentIndex, val.orignItem.id,this.templateType);
      this.patienModalMessage.actualData = 0;
      this.patienModalMessage.sampleValue = val.orignItem.value;
      this.patienModalMessage.sampleId = val.orignItem.id;
    },

    // 运送类型大类下拉框隐藏或显示时事件
    transportParentVisibleChange() {

    },

    // 运送类型大类input中的数据变化时触发
    transportParentInputEvent(val) {},

    // 转换性别
    transferGenderOne (index) {
      if (this.templatelistTwo[index].genderValue === '1') {
        this.templatelistTwo[index].genderValue = '男'
      } else if (this.templatelistTwo[index].genderValue === '2') {
        this.templatelistTwo[index].genderValue = '女'
      } else if (this.templatelistTwo[index].genderValue === '0'){
        this.templatelistTwo[index].genderValue = '未知'
      }
    },

    transferGenderTwo () {
      if (this.patienModalMessage.genderValue == '男') {
        this.patienModalMessage.genderValue = '1'
      } else if (this.patienModalMessage.genderValue == '女') {
        this.patienModalMessage.genderValue = '2'
      } else if (this.patienModalMessage.genderValue === '未知'){
        this.patienModalMessage.genderValue = '0'
      }
    },

    // 拼接运送类型信息函数
    jointTransportMessage (index) {
      let finalMsg = '';
      let targetMsg = this.templatelistTwo[index].transportList.filter((item) => {
        return item.typerNumber > 0
      });
      for (let item of targetMsg) {
        finalMsg += `${item.text}${item.typerNumber}个,`
      };
      if (targetMsg.length == 0) {
        return finalMsg
      };
      return `(${finalMsg})`
    },
    
    // 根据运送类型大类查询运送类型小类
    querytransportChildByTransportParent (index,id,flag) {
      this.infoText = '加载中...';
      this.showLoadingHint = true;
      this.commonTransportList = [];
      queryTransportType({
        proId: this.proId,
        state: 0,
        parentId: id
      }).then((res) => {
      this.showLoadingHint = false;
        if (res && res.data.code == 200) {
          if (flag == 'template_two') {
            this.patienModalMessage['transportList'] = [];
            for(let item of res.data.data) {
              this.patienModalMessage['transportList'].push({
                text: item.typeName,
                value: item.id,
                checked: false,
                typerNumber: 0
              });
              this.commonTransportList.push({
                text: item.typeName,
                value: item.id,
                checked: false,
                typerNumber: 0
              })
            }
          } else if (flag == 'template_one') {
            this.transportTypeList = [];
            for(let item of res.data.data) {
              this.transportTypeList.push({
                text: item.typeName,
                value: item.id
              })
            }
          }
        } else {
					this.$refs.uToast.show({
						message: `${res.data.msg}`,
						type: 'error'
					})
				}
      })
      .catch((err) => {
        this.showLoadingHint = false;
				this.$refs.uToast.show({
					message: `${err}`,
					type: 'error'
				})
      })
    },

    // 查询运送类型小类
    getTransPorttype (data) {
      return new Promise((resolve,reject) => {
        queryTransportType(data)
        .then((res) => {
          if (res && res.data.code == 200) {
            resolve(res.data.data)
          } else {
						reject({message:res.data.msg});
						this.showLoadingHint = false;
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
						})
					}
        })
        .catch((err) => {
          reject({message:err})
        })
      })
    },

    // 查询运送类型大类
    getTransportsTypeParent () {
      return new Promise((resolve,reject) => {
        queryTransportTypeClass({proId: this.proId, state: 0}).then((res) => {
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              resolve(res.data.data)
            }
          } else {
						reject({message:res.data.msg});
						this.showLoadingHint = false;
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
						})
					}
        })
          .catch((err) => {
            reject({message:err.message})
          })
      })
    },
		
		//运送类型子类步进器失去焦点事件 
		inputBlurEvent () {},

    // 运送类型子类步进器值改变事件
    stepperValChange(msg) {
      this.reduceTotal(msg[1]);
    },

    // 步进器增加或减少事件
    plusNum(msg) {
			this.$set(this.patienModalMessage.transportList[msg[2]],'typerNumber',msg[1]);
      this.reduceTotal(msg[2])
    },
    minusNum(msg) {
      this.$set(this.patienModalMessage.transportList[msg[2]],'typerNumber',msg[1]);
      this.reduceTotal(msg[2])
    },

    // 求和函数
    reduceTotal(index) {
      // 求该病人信息对应的运送数量
      let targetMsg = this.patienModalMessage.transportList.filter((item) => {
        return item.typerNumber > 0
      });
      this.patienModalMessage.actualData = targetMsg.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.typerNumber
      }, 0);
    },

    // 并行查询目的地、转运工具、运送类型大类、运送员
    parallelFunction () {
       this.infoText = '加载中...';
       this.showLoadingHint = true;
        Promise.all([this.getAllDestination(),this.getTransportTools(),this.getTransportsTypeParent(),this.queryTransporter()])
        .then((res) => {
          this.showLoadingHint = false;
          if (res && res.length > 0) {
            this.transportRiceList = [];
            this.startDepartmentList = [];
            this.endDepartmentList = [];
            this.goalSpacesOption = [];
            this.transportTypeParent = [];
            this.transporterList = [];
            let [item1,item2,item3,item4] = res;
            if (item1) {
              Object.keys(item1).forEach((item,index) => {
                // 起点科室
                this.startDepartmentList.push({
                  text: item1[item],
                  value: item,
                  id: index
                });
                if (this.templateType === 'template_one') {
                  // 终点科室(模板一)
                  this.endDepartmentList.push({
                    text: item1[item],
                    value: item,
                    id: index
                  })
                } else {
                  // 终点科室(模板二)
                  this.goalSpacesOption.push({
                    text: item1[item],
                    value: item,
                    selected: false
                  })
                }
              })
            };
            if (item2) {
              // 转运工具
              this.transportToolList = [
                {
                  text: '无工具',
                  value: null,
                  id: 0 
                }
              ];
              for (let i = 0, len = item2.length; i < len; i++) {
                this.transportToolList.push({
                  text: item2[i].toolName,
                  value: item2[i].id,
                  id: i + 1
                })
              }
            };
            if (item3) {
              // 运送大类
              for (let i = 0, len = item3.length; i < len; i++) {
                this.transportTypeParent.push({
                  id: item3[i].id,
                  value: item3[i].typeName
                });
                this.transportRiceList.push({
                  text: item3[i].typeName,
                  value: item3[i].id,
                  id: i
                })
              }
            };
            if (item4) {
              for (let i = 0, len = item4.length; i < len; i++) {
                this.transporterList.push({
                  text: item4[i].name,
                  value: item4[i]['workerId'],
                  complete: item4[i].complete, // 完成数量
                  ongoing: item4[i].ongoing, // 进行中数量
                  id: i
                })
              }
            }
          }
        })
        .catch((err) => {
          this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: `${err.message}`,
						type: 'error'
					})
        })
      },

      // 查询目的地
      getAllDestination () {
        return new Promise((resolve,reject) => {
          queryAllDestination(this.proId).then((res) => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            } else {
							reject({message:res.data.msg});
							this.showLoadingHint = false;
							this.$refs.uToast.show({
								message: res.data.msg,
								type: 'error',
							})
						}
          })
          .catch((err) => {
            reject({message:err})
          })
        })
      },

    // 查询转运工具
    getTransportTools () {
      return new Promise((resolve,reject) => {
        queryTransportTools({proId: this.proId, state: 0})
        .then((res) => {
          if (res && res.data.code == 200) {
            resolve(res.data.data)
          } else {
						reject({message:res.data.msg});
						this.showLoadingHint = false;
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
						})
					}
        })
        .catch((err) => {
          reject({message:err})
        })
      })
    },

    // 查询运送员
    queryTransporter () {
      return new Promise((resolve,reject) => {
        getTransporter(this.proId, this.workerId)
        .then((res) => {
          if (res && res.data.code == 200) {
            resolve(res.data.data)
          } else {
						reject({message:res.data.msg});
						this.showLoadingHint = false;
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
						})
					}
        })
        .catch((err) => {
          reject({message:err})
        })
      })
    },

    // 起点科室下拉选择框确认事件
    startDepartmentSureEvent (val,value,id) {
      if (val) {
				this.startDepartmentDefaultIndex = [id];
        this.currentStartDepartment =  val
      } else {
        this.currentStartDepartment = '请选择'
      };
      this.showStartDepartment = false
    },

    // 起点科室下拉选择框取消事件
    startDepartmentCancelEvent () {
      this.showStartDepartment = false
    },

    // 起点科室下拉选择框关闭事件
    startDepartmentCloseEvent () {
      this.showStartDepartment = false
    },

    // 终点科室下拉选择框确认事件(模板一)
    endDepartmentSureEvent (val,value,id) {
      if (val) {
				this.endDepartmentDefaultIndex = [id];
        this.currentEndDepartment =  val
      } else {
        this.currentEndDepartment = '请选择'
      };
      this.showEndDepartment = false
    },

    // 终点科室下拉选择框取消事件(模板一)
    endDepartmentCancelEvent () {
      this.showEndDepartment = false
    },

    // 终点科室下拉选择框关闭事件(模板一)
    endDepartmentCloseEvent () {
      this.showEndDepartment = false
    },

    // 处理终点科室
    disposeTaskPresent (item) {
      if (!item) { return '请选择'};
      if (item.length == 0) { return '请选择'};
      let temporaryArray = [];
      for (let innerItem of item) {
        temporaryArray.push(innerItem.text)
      };
      return temporaryArray.join('、')
    },

    // 终点科室下拉选择框确认事件(模板二)
    goalSpacesSureEvent (val) {
      if (val.length > 0) {
        this.currentGoalSpaces =  val
      } else {
        this.currentGoalSpaces = []
      };
      this.showGoalSpaces = false
    },

    // 终点科室下拉选择框取消事件(模板二)
    goalSpacesCancelEvent () {
      this.showGoalSpaces = false
    },

    // 终点科室下拉选择框关闭事件(模板二)
    goalSpacesCloseEvent () {
      this.showGoalSpaces = false
    },

    // 运送员下拉选择框确认事件
    transporterSureEvent (val,value,id) {
      if (val) {
				this.transporterDefaultIndex = [id];
        this.currentTransporter =  val;
        this.currentTransporterValue = value
      } else {
        this.currentTransporter = '请选择';
        this.currentTransporterValue = ''
      };
      this.showTransporter = false
    },

    // 运送员下拉选择框取消事件
    transporterCancelEvent () {
      this.showTransporter = false
    },

    // 运送员下拉选择框关闭事件
    transporterCloseEvent () {
      this.showTransporter = false
    },

    // 转运工具下拉选择框确认事件
    transportToolSureEvent (val,value,id) {
      if (val) {
				this.transportToolDefaultIndex = [id];
        this.currentTransportTool =  val
      } else {
				this.transportToolDefaultIndex = [0];
        this.currentTransportTool = '无工具'
      };
      this.showTransportTool = false
    },

    // 转运工具下拉选择框取消事件
    transportToolCancelEvent () {
      this.showTransportTool = false
    },

    // 转运工具下拉选择框关闭事件
    transportToolCloseEvent () {
      this.showTransportTool = false
    },

    // 性别下拉选择框确认事件
    genderSureEvent (val,value,id) {
      if (val) {
				this.genderDefaultIndex = [id];
        this.currentGender =  val
      } else {
        this.currentGender = '请选择'
      };
      this.showGender = false
    },

    // 性别下拉选择框取消事件
    genderCancelEvent () {
      this.showGender = false
    },

    // 性别下拉选择框关闭事件
    genderCloseEvent () {
      this.showGender = false
    },

    // 运送类型点击事件
    transportTypeEvent (item,index) {
      this.transportTypeIndex = index;
      this.currentTransportType = item
    },

      // 根据科室名称获取科室id
      getDepartmentIdByName(text) {
        return this.startDepartmentList.filter((item) => {return item['text'] == text })[0]['value']
      },

      // 根据运送员名称获取运送员id
      getCurrentTransporterIdByName(text) {
        return this.transporterList.filter((item) => {return item['text'] == text })[0]['value']
      },

    // 查询是否配置接触隔离选项0-没配置1-配置
    getTransConfig () {
      if (this.templateType === 'template_one') {
        if (this.currentTransportRice == '请选择' || !this.currentTransportRice) {
          this.$refs.uToast.show({
          	message: '请选择运送大类',
          });
          return
        };
        if (this.currentStartDepartment == '请选择' || !this.currentStartDepartment) {
					this.$refs.uToast.show({
						message: '请选择起点科室',
					});
          return
        };
        // 起始地与目的地不能相同
        if (this.currentStartDepartment == this.currentEndDepartment) {
					this.$refs.uToast.show({
						message: '起点科室与终点科室不能相同',
					});
          return
        }
      } else if (this.templateType === 'template_two') {
        if (this.currentTransportRice == '请选择' || !this.currentTransportRice) {
					this.$refs.uToast.show({
						message: '请选择运送大类',
					});
          return
        };
        if (this.currentStartDepartment == '请选择' || !this.currentStartDepartment) {
					this.$refs.uToast.show({
						message: '请选择起点科室',
					});
          return
        }
        // 终点科室不能包含起点科室
        if (this.currentGoalSpaces.length > 0) {
          if (this.currentGoalSpaces.filter((item) => { return item.text == this.currentStartDepartment}).length > 0) {
						this.$refs.uToast.show({
							message: '终点科室不能包含起点科室',
						});
            return
          }
        }
      };  
			this.infoText = '查询中...';
			this.showLoadingHint = true;
      queryTransConfig(this.proId,'TRANS_QUARANTINE').then((res) => {
        if (res && res.data.code == 200) {
          if (JSON.parse(res.data.data)[0]['value'] == 1) {
            if (this.templateType === 'template_one') {
              if (this.currentTransportRice == '检查') {
                if (this.isContactisolationValue === null) {
									this.$refs.uToast.show({
										message: '请确认病人是否需要接触隔离'
									})
                } else {
                  this.sureEvent(true)
                }
              } else {
                this.sureEvent(false)
              }  
            } else if (this.templateType === 'template_two') {
              if (this.currentTransportRice == '检查') {
                let temporaryFlag = this.templatelistTwo.some((item) => { return item.isContactisolationValue === null });
                if (temporaryFlag) {
									this.$refs.uToast.show({
										message: '请确认病人是否需要接触隔离'
									})
                } else {
                  this.sureEvent(true)
                }
              } else {
                this.sureEvent(false)
              } 
            }  
          } else {
            this.sureEvent(false)
          }
        } else {
          this.$refs.uToast.show({
          	message: res.data.msg,
          	type: 'error',
          })
        };
        this.showLoadingHint = false;
      })
      .catch((err) => {
				this.showLoadingHint = false;
        this.$refs.uToast.show({
        	message: `${err}`,
        	type: 'error'
        })
      })
    },

    // 确认事件(创建调度任务)
    sureEvent (flag) {
      if (this.templateType === 'template_one') {
        let taskMessage = {
          setOutPlaceId: this.currentStartDepartment == '请选择' ? '' : this.getDepartmentIdByName(this.currentStartDepartment), //出发地ID
          setOutPlaceName: this.currentStartDepartment == '请选择' ? '' : this.currentStartDepartment,//出发地名称
          destinationId: this.currentEndDepartment == '请选择' ? '' : this.getDepartmentIdByName(this.currentEndDepartment), //目的地ID
          destinationName: this.currentEndDepartment == '请选择' ? '' : this.currentEndDepartment,  //目的地名称
          parentTypeId:  this.currentTransportRiceValue, //运送父类型Id
          parentTypeName: this.currentTransportRice,//运送父类型名称
          taskTypeId: this.currentTransportType['value'],  //运送类型 ID
          taskTypeName: this.currentTransportType['text'],  //运送类型名称
          priority: this.priorityRadioValue,   //优先级   1-正常, 2-重要,3-紧急, 4-紧急重要
          toolId: this.currentTransportTool == '无工具' || this.currentTransportTool == '无' ? 0 : this.transportToolList.filter((item) => { return item.text == this.currentTransportTool })[0]['value'], //运送工具ID
          toolName: this.currentTransportTool, //运送工具名称
          actualCount: this.transportNumberValue,   //实际数量
          patientName: this.patientNameValue,  //病人姓名
          sex: this.currentGender == '未选择' || this.currentGender == '未知' || this.currentGender == '请选择' ? 0 : this.currentGender == '男' ? 1 : 2,    //病人性别  0-未指定,1-男, 2-女
          age: this.patientAgeValue,   //年龄
          number: this.admissionNumberValue,   //住院号
          bedNumber: this.patientNumberValue,  //床号
          taskRemark: this.taskDescribe,   //备注
          quarantine: this.isContactisolationValue === null ? -1 : this.isContactisolationValue,// 接触隔离
          assignId: this.workerId,   //分配者ID  当前登录者
          assignName: this.userName,   //分配者名称  当前登陆者
          createId: this.workerId,   //创建者ID  当前登录者
          createName: this.userName,   //创建者名称  当前登陆者
          proId: this.proId,   //项目ID
          workerId: this.currentTransporter == '请选择' ? '' : this.currentTransporterValue, // 运送员ID
          workerName: this.currentTransporter == '请选择' ? '' : this.currentTransporter, // 运送员姓名
          proName: this.proName,   //项目名称
          isBack: this.isBackRadioValue,  //是否返回出发地  0-不返回，1-返回
          createType: 3 //创建类型   0-web端,1-手机端(医护),3-手机端(任务调度)
        };
        // 创建调度任务
        this.postGenerateDispatchTask(taskMessage);
      } else if (this.templateType === 'template_two') {
        let taskMessageTwo = {
          setOutPlaceId: this.getDepartmentIdByName(this.currentStartDepartment), //出发地ID
          setOutPlaceName: this.currentStartDepartment, //出发地名称
          destinations: [],//多个目的地列表
          patientInfoList: [], //多个病人信息列表
          priority: this.priorityRadioValue, //优先级   1-正常, 2-重要,3-紧急, 4-紧急重要
          toolId: this.currentTransportTool == '无工具' || this.currentTransportTool == '无' ? 0 : this.transportToolList.filter((item) => { return item.text == this.currentTransportTool })[0]['value'], //运送工具ID
          toolName: this.currentTransportTool, //运送工具名称
          actualCount: this.taskTransportTotal, //实际数量
          taskRemark: this.taskDescribe, //备注
          parentTypeId:  this.currentTransportRiceValue, //运送父类型Id
          parentTypeName: this.currentTransportRice,//运送父类型名称
          createId: this.workerId,   //创建者ID  当前登录者
          createName: this.userName,   //创建者名称  当前登陆者
          workerId: this.currentTransporter == '请选择' ? '' : this.currentTransporterValue, // 运送员id
          workerName: this.currentTransporter == '请选择' ? '' : this.currentTransporter, // 运送员姓名
          proId: this.proId, //项目ID
          proName: this.proName, //项目名称
          isBack: this.isBackRadioValue, //是否返回出发地  0-不返回，1-返回
          createType: 1 //创建类型   0-web端,1-手机端(医护),3-手机端(任务调度)
        };
        // 处理多个终点科室信息
        if (this.currentGoalSpaces.length > 0) {
          for (let item of this.currentGoalSpaces) {
            taskMessageTwo['destinations'].push({
              destinationId: item.value,
              destinationName: item.text
            })
          };
        };
        // 后端需要这种数据格式
        taskMessageTwo['destinations'] = JSON.stringify(taskMessageTwo['destinations']);
        // 获取多个病人信息列表数据
        for (let patientItem of this.templatelistTwo) {
          taskMessageTwo.patientInfoList.push({
            bedNumber: patientItem['bedNumber'],
            patientName: patientItem['patientName'],
            age: patientItem['patientAgeValue'],
            number: patientItem['patientNumber'],
            quarantine: patientItem['isContactisolationValue'] === null ? -1 : patientItem['isContactisolationValue'], // 接触隔离
            sex: patientItem['genderValue'] == '未知' ? 0 : patientItem['genderValue'] == '男' ?  1 : 2,
            quantity: patientItem['actualData'],
            typeList: []
          })
        };
        // 获取每个病人的运送类型数据
        for (let i = 0, len = this.templatelistTwo.length; i < len; i++) {
          if (this.templatelistTwo[i]['transportList'].length > 0) {
            // 获取选中的运送类型小类
            let checkChildTypeList = this.templatelistTwo[i]['transportList'].filter((item) => {return item.typerNumber > 0});
            // 运送类型小类存在没选的情况
            if (checkChildTypeList.length > 0) {
              for (let innerItem of checkChildTypeList) {
                taskMessageTwo.patientInfoList[i]['typeList'].push({
                  quantity: innerItem['typerNumber'],
                  parentTypeId: this.currentTransportRiceValue,
                  parentTypeName: this.currentTransportRice,
                  taskTypeId: innerItem['value'],
                  taskTypeName: innerItem['text']
                })
              }
            } else {
              taskMessageTwo.patientInfoList[i]['typeList'].push({
                quantity: 0,
                parentTypeId: this.currentTransportRiceValue,
                parentTypeName: this.currentTransportRice,
                taskTypeId: '',
                taskTypeName: ''
              });
              // 没选运送类型小类时,大类也算一个数量
              taskMessageTwo.patientInfoList[i]['quantity'] = 1;
              this.templatelistTwo[i]['actualData'] = 1;
              // 重新计算运送类型总数
              this.totalNumber  = this.templatelistTwo.reduce((accumulator, currentValue) => {
                return accumulator + Number(currentValue.actualData)
              },0);
              taskMessageTwo['actualCount'] = this.totalNumber
            }
          }
        };
        taskMessageTwo['patientInfoList'] = JSON.stringify(taskMessageTwo['patientInfoList']);
        this.postGenerateDispatchTaskMany(taskMessageTwo)
      }
    },

    // 生成调度任务(一个病人)
    postGenerateDispatchTask (data) {
			this.infoText = '提交中...';
			this.showLoadingHint = true;
      generateDispatchTask(data).then((res) => {
        if (res && res.data.code == 200) {
					this.$refs.alertToast.show({
						type: 'success',
						message: '提交成功!',
						isShow: true
					});
					setTimeout(() => {
						this.backTo();
					},2000);
        } else {
          this.$refs.alertToast.show({
          	type: 'error',
          	message: res.data.msg,
          	isShow: true
          })
        };
        this.showLoadingHint = false;
      })
      .catch((err) => {
        this.showLoadingHint = false;
        this.$refs.alertToast.show({
        	type: 'error',
        	message: err,
        	isShow: true
        })
      })
    },

    //生成调度任务(多个病人)
    postGenerateDispatchTaskMany(data) {
			this.infoText = '提交中...';
			this.showLoadingHint = true;
      generateDispatchTaskManyNew(data).then((res) => {
        if (res && res.data.code == 200) {
					this.$refs.alertToast.show({
						type: 'success',
						message: '提交成功!',
						isShow: true
					});
					setTimeout(() => {
						this.backTo();
					},2000);
        } else {
					this.$refs.alertToast.show({
						type: 'error',
						message: res.data.msg,
						isShow: true
					})
        };
        this.showLoadingHint = false;
      })
      .catch((err) => {
        this.showLoadingHint = false;
				this.$refs.alertToast.show({
					type: 'error',
					message: err,
					isShow: true
				})
      })
    },

    // 取消事件
    cancelEvent () {
      this.backTo()
    }
  }
};
</script>
<style lang='scss' scoped>
@import "~@/common/stylus/variable.scss";
	page {
		width: 100%;
		height: 100%;
	};
  .content-box {
		@include content-wrapper;
		height: 100vh !important;
		box-sizing: border-box;
		background: #f7f7f7;
		::v-deep .u-popup {
			flex: none !important
		};
		::v-deep .u-loading-icon {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			z-index: 200000;
		};
		::v-deep .u-transition {
			z-index: 100000 !important;
		};
		.top-background-area {
			width: 100%;
			background: #3890EE;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 10
		};
		/* 病人信息模态框样式 */
		.u-modal-center-box {
			/deep/ .u-modal {
				padding: 16px;
				.u-modal__title {
					padding-top: 0;
					text-align: left;
				};
				.u-modal__content {
					max-height: 500px;
					padding: 0 !important;
					-webkit-overflow-scrolling:touch;
					overflow: auto;
					.slot-content {
						height: 400px;
						.bedNumberBox {
							height: 60px;
							> view {
								height: 60px;
								line-height: 60px;
								&:first-child {
									width: 30%;
									color: #9E9E9A;
									float: left;
								};
								&:last-child {
									width: 70%;
									float: right;
									position: relative;
									.u-input {
										position: absolute;
										width: 100%;
										top: 50%;
										left: 0;
										background: #fff !important;
										transform: translateY(-50%);
										min-height: 59px !important;
										border-bottom: 1px solid #f9f9f9;
										.u-input__input {
											min-height: 59px !important;
										}
									}
								}
							}
						};
						.transport-number {
							> view {
								&:last-child {
									.u-input {
										padding: 0 !important;
										border: none !important;
									}
								}
							}
						};
						.field-four {
							height: 50px;
							display: flex;
							align-items: center;
							.contact-isolation-box {
								width: 100%;
								line-height: 20px;
								display: flex;
								align-items: center;
								>view {
									font-size: 16px;
									display: inline-block;
									height: 100%;
									&:first-child {
										width: 30%;
										margin-right: 10px;
										vertical-align: top;
										>text {
											color: #101010;
											&:first-child {
												color: red !important;
											}
										}
									};
									&:last-child {
										flex: 1;
										.u-radio-group {
											.u-radio {
												&:nth-child(1) {
													margin-right: 14px !important
												}
											}
										}	
									}
								}
							}
						};
						.genderBox {
							height: 60px;
							> view {
								height: 60px;
								line-height: 60px;
								&:first-child {
									width: 30%;
									color: #9E9E9A;
									float: left
								};
								&:last-child {
									width: 70%;
									float: right;
									border-bottom: 1px solid #f9f9f9;
									position: relative;
									.u-radio-group {
										position: absolute;
										top: 50%;
										left: 0;
										transform: translateY(-50%);
										.u-radio {
											&:nth-child(2) {
												margin: 0 14px !important
											}
										}
									}
								}
							}
						};
						.transportBox {
							height: 60px;
							line-height: 60px;
							> view {
								&:first-child {
									float: left;
									width: 30%;
									color: #9E9E9A;
									box-sizing: border-box
								};
								&:last-child {
									height: 60px;
									float: right;
									position: relative;
									width: 70%;
									border-bottom: 1px solid #ececec;
									.show-box {
										color: $color-text-right;
										position: absolute;
										left: 0;
										top: 50%;
										transform: translateY(-50%);
										height: 40px !important;
										background: #f9f9f9;
										border: none;
										.input {
											font-size: 15px !important
										};
										.right-arrow {
											color: $color-text-right !important
										}
									}
								}
							}
						};
						.transport-type-child-box {
							max-height: 100px;
							.transTypeListStyle {
									background: #44c4f3;
									color: #fff !important;
									border-radius: 4px;
								}
							.transport-type-child-content {
								height: 60px;
								line-height: 60px;
								> view {
									&:first-child {
										float: left;
										width: 50%;
										height: 60px;
										color: #9E9E9A;
										box-sizing: border-box;
										-webkit-overflow-scrolling: touch;
										overflow-x: auto;
									};
									&:last-child {
										height: 60px;
										float: right;
										position: relative;
										width: 50%;
										border-bottom: 1px solid #f9f9f9;
										.num-box {
											align-items: center;
											.subtract-box {
												width: 26px;
												height: 26px;
												background: #d3d3d3;
												border-radius: 50%;
												color: #fff;
												text-align: center;
												line-height: 26px
											};
											.plus-box {
												width: 26px;
												height: 26px;
												background: #3d4864;
												border-radius: 50%;
												color: #fff;
												text-align: center;
												line-height: 26px
											}
											input {
												text-align: center;
												background: #fff
											}
										}
									}
								}
							}
						}
					}
				};
				.u-modal__button-group {
					justify-content: space-between;
					.u-modal__button-group__wrapper {
						border-radius: 30px;
						flex: 0 0 45%;
						margin-top: 8px;
						background: #e8e8e8;
						.u-modal__button-group__wrapper__text {
							color: #666666 !important;
						}
					};
					.u-modal__button-group__wrapper--confirm {
						background: #fff;
						color: #43c3f4 !important;
						border: 1px solid #43c3f4;
						.u-modal__button-group__wrapper__text {
							color: #43c3f4 !important;
						}
					};
					.u-line {
						display: none;
					}
				}
			}
		};
		.nav {
			width: 100%;
		};
		.message-box {
			position: relative;
			width: 100%;
			flex: 1;
			-webkit-overflow-scrolling: touch;
			overflow: auto;
			font-size: 14px;
			color: black;
			display: flex;
			flex-direction: column;
			.message-one {
				width: 100%;
				padding: 10px 6px 10px 10px;
				box-sizing: border-box;
				background: #fff;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 14px;
				margin-top: 6px;
				.message-one-left {
					width: 20%;
					color: #101010
				};
				.message-one-right {
					flex: 1;
					height: 20px;
					float: right;
					position: relative;
					/deep/ .u-radio-group {
						position: absolute;
						width: 100% !important;
						top: 50%;
						transform: translateY(-50%);
						left: 0;
						display: flex;
						justify-content: space-between;
						.u-radio {
							flex: 1 0 auto !important;
							justify-content: center;
							.u-radio__label {
								margin-right: 9px;
							}
						}
					}
				}
			};
			.select-box {
				width: 100%;
				padding: 10px 6px 10px 10px;
				box-sizing: border-box;
				background: #fff;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 14px;
				margin-top: 6px;
				.select-box-left {
					padding-right: 10px;
					box-sizing: border-box;
					>text {
						&:nth-child(1) {
							color: red
						};
						&:nth-child(2) {
							color: #9E9E9A;
							padding-right: 6px;
							box-sizing: border-box
						};
					}
				};
				.select-box-right {
					flex: 1;
					justify-content: flex-end;
					align-items: center;
					display: flex;
					width: 0;
					>text {
						color: #101010;
						text-align: right;
						flex: 1;
						@include no-wrap();
					};
					.selectBoxRightStyle {
						color: #d6d6d6 !important 
					}
				}
			};
			.end-select-box {
				.select-box-left {
					padding: 0 6px 0 0;
					box-sizing: border-box;
					>text {
						&:nth-child(1) {
							color: #9E9E9A;
							padding-right: 6px;
							box-sizing: border-box
						};
					}
				};
			};
			.transport-type {
				width: 100%;
				padding: 10px 6px 10px 10px;
				box-sizing: border-box;
				background: #fff;
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				margin-top: 6px;
				.transport-type-left {
					padding-right: 10px;
					box-sizing: border-box;
					>text {
						&:nth-child(1) {
							color: #9E9E9A
						}
					}
				};
				.transport-type-right {
					flex: 1;
					width: 0;
					display: flex;
					flex-wrap: wrap;
					.transport-type-list {
						display: inline-block;
						font-size: 13px;
						color: #9E9E9A;
						background: #F9F9F9;
						text-align: center;
						border-radius: 10px;
						margin-right: 10px;
						margin-bottom: 10px;
						line-height: 20px;
						padding: 6px 10px;
						box-sizing: border-box
					};
					.transportTypeListStyle {
						color: #fff !important;
						background: #3B9DF9 !important
					}
				}
			};
			.patient-message-box {
				width: 100%;
				padding: 10px 6px;
				box-sizing: border-box;
				background: #fff;
				font-size: 14px;
				margin-top: 6px;
				.patient-message-top {
					display: flex;
					width: 100%;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					align-content: flex-start;
					margin: 4px 0;
					.creat-form-field {
						&:first-child {
							margin: 0 6px 0 10px;
						};
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: space-between;
						> text {
							width: 32%;
							margin-right: 4px;
							font-size: 14px;
							color: #9E9E9A;
						};
						/deep/ .u-input {
							flex: 1;
							padding: 4px 2px;
							.u-label-text {
								font-size: 14px;
								color: #9E9E9A;
							};
							.fild-body {
								.uni-input-input {
									color: #9E9E9A !important
								}
							}
						}
					}
				};
				.patient-message-bottom {
				};
				.patient-message-bottom-age {
					display: flex;
					align-items: center;
					.patient-message-bottom-right {
						width: 50%;
						flex: none;
						&:first-child {
							margin: 0 6px 0 10px;
						};
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: space-between;
						> text {
							width: 35%;
							margin-right: 4px;
							font-size: 14px;
							color: #9E9E9A;
						};
						/deep/ .u-input {
							flex: 1;
							padding: 4px 2px;
							.u-label-text {
								font-size: 14px;
								color: #9E9E9A
							};
							.fild-body {
								.uni-input-input {
									color: $color-text-right !important
								}
							}
						}
					};
					.contact-isolation-box {
						flex: 1;
						display: flex;
						align-items: center;
						>view {
							font-size: 14px;
							display: inline-block;
							height: 100%;
							&:first-child {
								color: #9E9E9A;
								margin-right: 14px;
								padding-left: 10px;
								box-sizing: border-box;
								line-height: 44px;
								vertical-align: top;
							};
							&:last-child {
								flex: 1;
								display: flex;
								align-items: center;
								justify-content: flex-end;
								float: right;
								position: relative;
								/deep/ .u-radio-group {
									display: flex;
									justify-content: flex-end;
									position: absolute;
									width: 100%;
									top: 50%;
									transform: translateY(-50%);
									left: 0;
									.u-radio {
										&:last-child {
											margin-left: 10px;
										}
									}
								}
							}
						}
					}  
				}
			};
			.is-back {
				.message-one-left {
					width: 30% !important;
					color: #9E9E9A !important
				};
				.transport-isBack {
					float: right;
					position: relative;
					width: 70%;
					/deep/ .u-radio-group {
						display: flex;
						justify-content: flex-end;
						position: absolute;
						width: 100%;
						top: 50%;
						transform: translateY(-50%);
						left: 0;
						.u-radio {
							&:last-child {
								margin-left: 10px;
							}
						}
					}
				}
			};
			.task-total {
				.trans-total-title {
					float: left;
					width: 40%;
					color: #9E9E9A;
					padding: 0 6px 0 0;
					box-sizing: border-box;
					line-height: 28px !important;
					height: 28px !important;
				};
				.trans-total-content {
					height: 28px !important;
					float: right;
					width: 20%;
					position: relative;
					/deep/ .u-input {
						position: absolute;
						top: 50%;
						width: 100%;
						min-height: 28px;
						transform: translateY(-50%);
						left: 0;
						border: none;
						background: #f9f9f9;
						.u-input__content__field-wrapper__field {
							text-align: center !important;
						}
					}
				}
			};
			.transport-type {
				.transport-type-right {
					/deep/ .van-cell {
						padding: 4px 6px !important;
						background: #F9F9F9
					}
				}
			};
			.field-box-wrapper {
				width: 100%;
				margin: 10px 0;
				background: #fff;
				.field-box-two {
					width: 100%;
					padding: 0 10px;
					box-sizing: border-box;
					.field-title {
						font-size: 18px;
						height: 40px;
						font-weight: bold;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.patient-name {
							height: 40px;
							line-height: 40px;
							font-size: 16px;
							width: 100px;
							padding-left: 4px;
							box-sizing: border-box;
							color: #000000
						};
						.icon-area {
							flex: 1;
							display: flex;
							align-items: center;
							justify-content: flex-end;
							margin-left: 30px;
							padding-right: 10px;
							box-sizing: border-box;
							/deep/ .u-icon {
								&:first-child {
									margin-right: 4px;
								}
							}
						}
					};
					.field-wrapper {
						background: #f9f9f9;
						padding: 14px;
						border-radius: 4px;
						> view {
							> view {
								display: inline-block;
								/deep/ .u-input {
									padding: 2px 0;
									height: 34px;
									background: #f9f9f9;
									.van-field__label {
										width: 50px;
										text-align: left;
										height: 34px;
										line-height: 34px;
										font-size: 14px;
										color: '';
									}
									.van-field__value {
										height: 34px;
										line-height: 34px;
										color: '';
										font-size: 16px;
										.van-field__body {
											.van-field__control:disabled {
												-webkit-text-fill-color: #101010 !important;
											}
										}
									}
								}
							}
						};
						.field-one {
							display: flex;
							width: 100%;
							flex-direction: row;
							flex-wrap: wrap;
							justify-content: space-between;
							align-content: flex-start;
							margin: 4px 0;
							.creat-form-field {
								&:first-child {
									margin: 0 6px 0 4px;
								};
								flex: 1;
								display: flex;
								align-items: center;
								justify-content: space-between;
								> text {
									width: 32%;
									margin-right: 4px;
									font-size: 14px;
									color: #9E9E9A;
								};
								/deep/ .u-input {
									flex: 1;
									padding: 4px 2px;
									.u-label-text {
										font-size: 14px;
										color: #9E9E9A
									};
									.fild-body {
										.uni-input-input {
											color: $color-text-right !important
										}
									}
								}
							}
						};
						.field-two {
							display: flex;
							width: 100%;
							flex-direction: row;
							flex-wrap: wrap;
							justify-content: space-between;
							align-content: flex-start;
							.creat-form-field {
								&:nth-child(2) {
									margin: 0 6px;
								};
								flex: 1;
								display: flex;
								align-items: center;
								justify-content: space-between;
								> text {
									margin-right: 4px;
									font-size: 14px;
									color: #9E9E9A;
								};
								/deep/ .u-input {
									padding: 4px 2px;
									.u-label-text {
										font-size: 14px;
										color: #9E9E9A
									};
									.fild-body {
										.uni-input-input {
											color: $color-text-right !important
										}
									}
								}
							}
						};
						.field-three {
							margin-top: 10px;
							.sample-box {
								width: 100%;
								line-height: 20px;
								display: flex;
								flex-flow: row nowrap;
								> view {
									font-size: 14px;
									display: inline-block;
									height: 100%;
									&:first-child {
										color: '';
										margin-right: 4px;
										vertical-align: top;
									};
									&:nth-child(2) {
										vertical-align: top;
										margin-right: 4px
									};
									&:last-child {
										flex: 1
									}
								}
							};
						};
						.field-four {
							margin-top: 4px;
							.contact-isolation-box {
								width: 100%;
								line-height: 20px;
								display: flex;
								>view {
									font-size: 14px;
									display: inline-block;
									height: 100%;
									&:first-child {
										color: '';
										margin-right: 10px;
										vertical-align: top;
									};
									&:last-child {
										flex: 1;
										/deep/ .u-radio-group {
											.u-radio--horizontal {
												&:nth-child(1) {
													margin-right: 20px !important
												}
											}
										}
									}
								}
							}
						}
					}
					.type-list-box {
						border: 1px solid #bcbcbc;
						padding: 4px 4px 0 4px;
						flex: 1;
						overflow: scroll;
						display: flex;
						flex-flow: row wrap;
						justify-content: space-between;
						align-items: flex-start;
						.type-list {
							border: 1px solid #bcbcbc;
							text-align: center;
							width: 48%;
							height: 40px;
							line-height: 40px;
							margin-bottom: 4px;
							position: relative;
							> view {
								position: absolute;
								top: 0;
								&:first-child {
									left: 2px
								};
								&:last-child {
									right: 2px
								}
							}
						};
						.typeListStyle {
							border: none;
							color: #fff;
							background: #2895ea
						}
					}
				};
				.add-message {
					width: 95%;
					height: 41px;
					margin-top: 8px;
					margin-bottom: 8px;
					margin-left: 2%;
					color: #43c3f3;
					border: 1px solid #44c3f3;
					border-radius: 20px;
					font-size: 16px;
					display: flex;
					align-items: center;
					justify-content: center;
					/deep/ .u-icon {
						margin-right: 6px;
					}
				}
			};
			.task-describe {
				background: #fff;
				height: 120px;
				padding: 10px 6px 10px 10px;
				box-sizing: border-box;
				border-top: 12px solid #f6f6f6;
				display: flex;
				> text {
					padding-top: 10px;
					box-sizing: border-box;
					color: #9E9E9A;
					font-size: 14px;
					margin-right: 10px;
				};
				/deep/ .u-textarea {
					flex: 1;
					padding:10px 0 10px 4px;
					color: #9E9E9A;
					background: #f9f9f9;
				}
			}
		};
		.btn-box {
			width: 90%;
			margin: 0 auto;
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			>text {
				width: 35%;
				display: inline-block;
				height: 45px;
				font-size: 14px;
				line-height: 45px;
				background: #fff;
				text-align: center;
				border-radius: 4px;
				&:nth-child(1) {
					color: #fff;
					background: #2B98FE;
					box-shadow: 0px 2px 6px 0 rgba(0, 0, 0, 0.4);
					margin-right: 30px
				};
				&:nth-child(2) {
					color: #2B98FE;
					border: 1px solid #2B98FE;
					box-sizing: border-box;
					box-shadow: 0px 2px 6px 0 rgba(0, 0, 0, 0.4);
				}
			}
		}	
  }
</style>