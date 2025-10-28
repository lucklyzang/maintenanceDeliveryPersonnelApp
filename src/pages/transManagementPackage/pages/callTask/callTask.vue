<template>
  <div class="content-box" :style="{ 'padding-top': statusBarHeight + 'px' }">
    <!-- 病人编辑弹框 -->
		<div class="u-modal-center-box">
			 <van-dialog v-model="patienModalShow" :title="isPressEdit ? `病人${updateIndex+1}`: `病人${templatelistTwo.length+1}`" show-cancel-button
				use-slot
				@confirm="patienModalSure"
				@cancel="patienModalCancel"
			>
			<div class="slot-content">
				<div class="contact-isolation-box">
				<div>
					<span>接触隔离:</span>
				</div>
				<div>
					<van-radio-group v-model="patienModalMessage.isContactisolationValue" direction="horizontal">
						<van-radio  name="1" checked-color="#333">是</van-radio>
						<van-radio  name="0" checked-color="#333">否</van-radio>
					</van-radio-group>
				</div>
				</div>
				<div class="bedNumberBox">
				<div>床号</div>
				<div>
					<van-field v-model="patienModalMessage.bedNumber" placeholder="请输入床号"/>
				</div>
				</div>
				<div class="bedNumberBox">
				<div>姓名</div>
				<div>
					<van-field v-model="patienModalMessage.patientName" placeholder="请输入姓名"/>
				</div>
				</div>
				<div class="bedNumberBox">
				<div>住院号</div>
				<div>
					<van-field v-model="patienModalMessage.patientNumber" placeholder="请输入住院号"/>
				</div>
				</div>
				<div class="genderBox">
				<div>性别</div>
				<div>
					<van-radio-group v-model="patienModalMessage.genderValue" direction="horizontal">
					<van-radio name="0" checked-color="#333">未知</van-radio>
					<van-radio name="1" checked-color="#333">男</van-radio>
					<van-radio name="2" checked-color="#333">女</van-radio>
					</van-radio-group>
				</div>
				</div>
				<div class="bedNumberBox">
				<div>运送数量</div>
				<div>
					<van-field v-model="patienModalMessage.actualData" disabled/>
				</div>
				</div>
				<div class="bedNumberBox">
				<div>年龄</div>
				<div>
					<van-field v-model="patienModalMessage.patientAgeValue" type="digit" placeholder="请输入年龄" />
				</div>
				</div>
				<div class="transportBox">
				<div>运送类型</div>
				<div v-if="xflSelectShow">
					<Vselect :list="patienModalMessage.sampleList" disabled :clearable="false" :showItemNum="5" :isCanInput="true" :showList="transportParentControlListShow"
					:style_Container="'height: 50px; font-size: 16px;'" :initValue="patienModalMessage.sampleValue" @change="transportParentChange"
					@input="transportParentInputEvent" @visible-change="transportParentVisibleChange">
					</Vselect>
				</div>
				</div>
				<div class="transport-type-child-box">
				<div class="transport-type-child-content" v-for="(innerItem,innerIndex) in patienModalMessage.transportList"
					:key="innerItem.text">
					<div :class="{'transTypeListStyle': innerItem.typerNumber > 0 }">
					{{innerItem.text}}
					</div>
					<div>
					<StepNumberBox v-model="innerItem.typerNumber"
						@plus="plusNum(arguments)"
						:innerIndex="innerIndex"
						@minus="minusNum(arguments)"
						@change="stepperValChange(arguments)"
					></StepNumberBox>
					</div>
				</div>
				</div>
			</div>
			</van-dialog>
		</div>
    <!-- 起点科室 -->
    <div class="transport-rice-box" v-if="showStartDepartment">
      <ScrollSelection :pickerValues="startDepartmentDefaultIndex" :columns="startDepartmentList" title="起点科室" @sure="startDepartmentSureEvent" @cancel="startDepartmentCancelEvent" @close="startDepartmentCloseEvent" :isShowSearch="true"/>
    </div>
    <!-- 终点科室(模板一单选) -->
    <div class="transport-rice-box" v-if="showEndDepartment">
      <ScrollSelection :pickerValues="endDepartmentDefaultIndex" :columns="endDepartmentList" title="终点科室" @sure="endDepartmentSureEvent" @cancel="endDepartmentCancelEvent" @close="endDepartmentCloseEvent" :isShowSearch="true" />
    </div>
    <!-- 终点科室(模板二多选) -->
    <div class="transport-rice-box" v-if="showGoalSpaces">
      <BottomSelect :columns="goalSpacesOption" title="终点科室" :currentSelectData="currentGoalSpaces" @sure="goalSpacesSureEvent" @cancel="goalSpacesCancelEvent" @close="goalSpacesCloseEvent" />
    </div>
    <!-- 运送员 -->
    <div class="transport-rice-box" v-if="showTransporter">
      <ScrollSelection :pickerValues="transporterDefaultIndex" :columns="transporterList" title="运送员" @sure="transporterSureEvent" @cancel="transporterCancelEvent" @close="transporterCloseEvent" />
    </div>
    <!-- 转运工具 -->
    <div class="transport-rice-box" v-if="showTransportTool">
      <ScrollSelection :pickerValues="transportToolDefaultIndex" :columns="transportToolList" title="转运工具" @sure="transportToolSureEvent" @cancel="transportToolCancelEvent" @close="transportToolCloseEvent" />
    </div>
     <!-- 性别 -->
    <div class="transport-rice-box" v-if="showGender">
      <ScrollSelection :pickerValues="genderDefaultIndex" :columns="genderList" title="性别" @sure="genderSureEvent" @cancel="genderCancelEvent" @close="genderCloseEvent" />
    </div>
	<van-loading size="24px" vertical v-show="showLoadingHint">{{ infoText }}</van-loading>
	<div class="top-background-area" :style="{ 'height': statusBarHeight + 'px' }">
		<div class="nav">
			<NavBar :title="currentTransportRice" path="/transIndex" leftText="返回" />
		</div>
	</div>
	<div class="message-box">
		<div class="message-one">
			<div class="message-one-left">
				优先级
			</div>
			<div class="message-one-right">
				<van-radio-group v-model="priorityRadioValue" direction="horizontal">
					<van-radio name="1" checked-color="#289E8E">正常</van-radio>
					<van-radio name="2" checked-color="#F2A15F">重要</van-radio>
					<van-radio name="3" checked-color="#E8CB51">紧急</van-radio>
					<van-radio name="4" checked-color="#E86F50">紧急重要</van-radio>
              </van-radio-group>
			</div>
		</div>
		<div class="transport-type" v-if="templateType === 'template_one'">
			<div class="transport-type-left">
				<span>运送类型</span>
			</div>
			<div class="transport-type-right">
				<span class="transport-type-list" :class="{'transportTypeListStyle': transportTypeIndex == index}" 
					v-for="(item,index) in transportTypeList"
					@click="transportTypeEvent(item,index)"
					:key="index"
					>
					{{ item.text }}
				</span>
			</div>
		</div>
		<div class="select-box">
			<div class="select-box-left">
				<span>*</span>
				<span>起点科室</span>
			</div>
			<div class="select-box-right" @click="showStartDepartment = true">
				<span>{{ currentStartDepartment }}</span>
				<van-icon name="arrow" color="#989999" size="20" />
			</div>
		</div>
		<div class="message-one is-back task-total" v-if="templateType === 'template_two'">
			<div class="trans-total-title">
				该任务运送总数
			</div>
			<div class="trans-total-content">
				<van-field v-model="taskTransportTotal" type="digit" readonly />
			</div>
		</div>
		<div class="select-box end-select-box">
			<div class="select-box-left">
				<span>终点科室</span>
			</div>
			<div class="select-box-right" @click="templateType === 'template_one' ? showEndDepartment = true : showGoalSpaces = true">
				<span>{{ templateType === 'template_one' ? currentEndDepartment : disposeTaskPresent(currentGoalSpaces)}}</span>
				<van-icon name="arrow" color="#989999" size="20" />
			</div>
		</div>
		<div class="select-box end-select-box">
			<div class="select-box-left">
				<span>运送员</span>
			</div>
			<div class="select-box-right" @click="showTransporter = true">
				<span>{{ currentTransporter }}</span>
				<van-icon name="arrow" color="#989999" size="20" />
			</div>
		</div>
		<div class="select-box end-select-box">
			<div class="select-box-left">
				<span>转运工具</span>
			</div>
			<div class="select-box-right" @click="showTransportTool = true">
				<span>{{ currentTransportTool }}</span>
				<van-icon name="arrow" color="#989999" size="20" />
			</div>
		</div>
		<div class="patient-message-box" v-if="templateType === 'template_one'">
			<div class="patient-message-top">
              <div class="patient-message-top-left">
                <van-field v-model="patientNumberValue" label="床号" placeholder="请输入" />
              </div>
              <div class="patient-message-top-right">
                <van-field v-model="patientNameValue" label="姓名" placeholder="请输入" />
              </div>
            </div>
            <div class="patient-message-bottom">
              <div class="patient-message-bottom-left">
                <van-field v-model="admissionNumberValue" label="住院号" placeholder="请输入" />
              </div>
              <div class="patient-message-bottom-right">
                <van-field v-model="patientAgeValue" label="年龄" type="digit" placeholder="请输入" />
              </div>
            </div>
            <div class="patient-message-bottom patient-message-bottom-age">
              <div class="patient-message-bottom-right">
                <van-field v-model="transportNumberValue" label="运送数量" type="digit" placeholder="请输入" />
              </div>
              <div class="contact-isolation-box">
                <p>接触隔离</p>
                <p>
                  <van-radio-group v-model="isContactisolationValue" direction="horizontal" checked-color="#3B9DF9">
                    <van-radio icon-size="14px" name="1">是</van-radio>
                    <van-radio icon-size="14px" name="0">否</van-radio>
                  </van-radio-group>
                </p>
              </div>
            </div>
		</div>
		<div class="field-box-wrapper" v-if="templateType === 'template_two'">
			<div class="field-box-two" v-for="(item,index) in templatelistTwo" :key="index">
				<div class="field-title">
					<div class="patient-name">病人{{index+1}}</div>
					<div class="icon-area">
						<van-icon name="delete" v-if="index > 0" @click="deletetMessage(index)" color="#E86F50"  size="22" />
						<van-icon name="records" @click="editMessage(index)" color="#3B9DF9" size="22" />
					</div>
				</div>
				<div class="field-wrapper">
					<div class="field-four">
						<div class="contact-isolation-box">
							<div>接触隔离:</div>
							<div>
							 {{ item.isContactisolationValue == 1 ? '是' : item.isContactisolationValue === null ? '' : '否' }}
							</div>
						</div>
					</div>
					<div class="field-one">
						<p>
							<van-field v-model="item.bedNumber" label="床号:" disabled/>
						</p>
						<p>
							<van-field v-model="item.patientName"  label="姓名:" disabled/>
						</p>
						<p>
							<van-field v-model="item.genderValue" label="性别:" disabled/>
						</p>
					</div>
					<div class="field-two">
						<p class="admission-number">
							<van-field v-model="item.patientNumber"  label="住院号:" disabled/>
						</p>
						<p>
							<van-field v-model="item.actualData"  type="number" label="运送数量:" placeholder="" disabled/>
						</p>
						<p>
							<van-field v-model="item.patientAgeValue"  type="number" label="年龄:" placeholder="" disabled/>
						</p>
					</div>
					<div class="field-three">
						<div class="sample-box">
							<div>运送类型:</div>
							<div>
								{{item.sampleValue}}
							</div>
							<div>
							{{jointTransportMessage(index)}}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="add-message" @click="addMessageEvent" v-if="templateType === 'template_two'">
				    <van-icon name="plus" color="#43c3f3" size="16" />
					添加病人信息
			</div>
		</div>
		<div class="select-box end-select-box" v-if="templateType === 'template_one'">
			<div class="select-box-left">
				<span>性别</span>
			</div>
			<div class="select-box-right" @click="showGender = true">
				<span>{{ currentGender }}</span>
				<van-icon name="arrow" color="#989999" size="20" />
			</div>
		</div>
		<div class="message-one is-back">
			<div class="message-one-left">
				运送员是否返回
			</div>
			<div class="transport-isBack">
				<van-radio-group v-model="isBackRadioValue" direction="horizontal" checked-color="#3B9DF9">
					<van-radio name="0">否</van-radio>
					<van-radio name="1">是</van-radio>
             	 </van-radio-group>
			</div>
		</div>
		<div class="transport-type">
			<div class="transport-type-left">
              <span>任务描述</span>
            </div>
			<div class="transport-type-right">
              <van-field
                v-model="taskDescribe"
                rows="3"
                autosize
                type="textarea"
                placeholder="请输入任务描述"
              />
            </div>
		</div>
	</div>
	<div class="btn-box">
	  <span class="operate-one" @click="getTransConfig">确认</span>
	  <span class="operate-two" @click="cancelEvent">取消</span>
	</div>
  </div>
</template>
<script>
import {
		mapGetters,
		mapMutations
	} from 'vuex'
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
import StepNumberBox from '@/pages/transManagementPackage/pages/components/step-number-box/step-number-box.vue'
import _ from 'lodash'
import NavBar from "@/components/NavBar";
import ScrollSelection from "@/components/ScrollSelection";
import BottomSelect from "@/components/BottomSelect";
import Vselect from '@/components/Vselect'
export default {
  components: {
    ScrollSelection,
    BottomSelect,
    StepNumberBox,
	NavBar,
	Vselect
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
	startDepartmentDefaultIndex: 0,
	showEndDepartment: false,
	currentEndDepartment: '请选择',
	endDepartmentList: [],
	endDepartmentDefaultIndex: 0,
	showTransporter: false,
	currentTransporter: '请选择',
	currentTransporterValue: '',
	transporterList: [],
	transporterDefaultIndex: 0,
	showTransportTool: false,
	currentTransportTool: '无工具',
	transportToolList: [],
	transportToolDefaultIndex: 0,
	showGender: false,
	currentGender: '请选择',
	genderDefaultIndex: 0,
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
	
mounted () {
	this.currentTransportRice = this.$route.query['text'];
	this.currentTransportRiceValue = this.$route.query['value'];
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
			return this.userInfo['worker']['name']
		},
		workerId() {
			return this.userInfo['worker']['id']
		},
		proName () {
			return this.chooseHospitalArea['text']
		},
		proId() {
			return this.chooseHospitalArea['value']
		},
		depId() {
			return this.userInfo['worker']['departments'].length == 0 ? '' : this.userInfo['worker']['departments'][0]['id']
		},
		depName() {
			return this.userInfo['worker']['departments'].length == 0 ? '' : this.userInfo['worker']['departments'][0]['name']
		},
		userAccount() {
			return this.userInfo['worker']['account']
		}
  },

  methods: {
    ...mapMutations(["storeCurrentIndex"]),
    // 添加病人信息事件
    addMessageEvent () {
      // 必须选择运送大类后才能添加病人信息
      if (this.currentTransportRice == '请选择' || !this.currentTransportRice) {
		this.$toast({message: '请选择运送大类'});
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
		this.$toast({message: '请选择运送大类'});
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
			this.$dialog.alert({
				message: res.data.msg,
				closeOnPopstate: true
			}).then(() => {
			})		
		}
      })
      .catch((err) => {
        this.showLoadingHint = false;
		this.$dialog.alert({
			message: err,
			closeOnPopstate: true
		}).then(() => {
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
				this.$dialog.alert({
					message: res.data.msg,
					closeOnPopstate: true
				}).then(() => {
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
			this.$dialog.alert({
				message: res.data.msg,
				closeOnPopstate: true
			}).then(() => {
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
			this.$dialog.alert({
				message: err.message,
				closeOnPopstate: true
			}).then(() => {
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
				this.$dialog.alert({
					message: res.data.msg,
					closeOnPopstate: true
				}).then(() => {
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
				this.$dialog.alert({
					message: res.data.msg,
					closeOnPopstate: true
				}).then(() => {
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
				this.$dialog.alert({
					message: res.data.msg,
					closeOnPopstate: true
				}).then(() => {
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
		this.startDepartmentDefaultIndex = id;
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
		this.endDepartmentDefaultIndex = id;
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
		this.transporterDefaultIndex = id;
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
		this.transportToolDefaultIndex = id;
        this.currentTransportTool =  val
      } else {
		this.transportToolDefaultIndex = 0;
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
		this.genderDefaultIndex = id;
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
				this.$toast('请选择运送大类');
				return
			};
			if (this.currentStartDepartment == '请选择' || !this.currentStartDepartment) {
				this.$toast('请选择起点科室');
				return
			};
			// 起始地与目的地不能相同
			if (this.currentStartDepartment == this.currentEndDepartment) {
				this.$toast('起点科室与终点科室不能相同');
				return
			}
		} else if (this.templateType === 'template_two') {
			if (this.currentTransportRice == '请选择' || !this.currentTransportRice) {
				this.$toast('请选择运送大类');
				return
			};
			if (this.currentStartDepartment == '请选择' || !this.currentStartDepartment) {
				this.$toast('请选择起点科室');
				return
			}
			// 终点科室不能包含起点科室
			if (this.currentGoalSpaces.length > 0) {
			if (this.currentGoalSpaces.filter((item) => { return item.text == this.currentStartDepartment}).length > 0) {
				this.$toast('终点科室不能包含起点科室');
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
					this.$toast('请确认病人是否需要接触隔离');
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
					this.$toast('请确认病人是否需要接触隔离');
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
			this.$dialog.alert({
				message: res.data.msg,
				closeOnPopstate: true
			}).then(() => {
			})
        };
        this.showLoadingHint = false;
      })
      .catch((err) => {
		this.showLoadingHint = false;
		this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
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
          taskTypeName: this.currentTransportType['span'],  //运送类型名称
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
                  taskTypeName: innerItem['span']
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
			this.$Alert({message:"提交成功!",type:'success'});
			setTimeout(() => {
				this.$router.push({ path: "/transIndex" });
			},2000)
        } else {
			this.$Alert({message: res.data.msg,type:'error'});
        };
        this.showLoadingHint = false;
      })
      .catch((err) => {
        this.showLoadingHint = false;
		this.$Alert({message: err,type:'error'})
      })
    },

    //生成调度任务(多个病人)
    postGenerateDispatchTaskMany(data) {
		this.infoText = '提交中...';
		this.showLoadingHint = true;
      	generateDispatchTaskManyNew(data).then((res) => {
        if (res && res.data.code == 200) {
			this.$Alert({message:"提交成功!",type:'success'});
			setTimeout(() => {
				this.$router.push({ path: "/transIndex" });
			},2000);
        } else {
			this.$Alert({message: res.data.msg,type:'error'})
        };
        this.showLoadingHint = false;
      })
      .catch((err) => {
        this.showLoadingHint = false;
		this.$Alert({message: err,type:'error'})
      })
    },

    // 取消事件
    cancelEvent () {
      this.$router.push({ path: "/transIndex"})
    }
  }
};
</script>
<style lang='less' scoped>
	@import "~@/common/stylus/variable.less";	
    @import "~@/common/stylus/mixin.less";
    @import "~@/common/stylus/modifyUi.less";
  .content-box {
		.content-wrapper();
		height: 100vh !important;
		box-sizing: border-box;
		background: #f7f7f7;
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
			/deep/ .van-dialog {
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			padding: 16px 16px 0 16px;
			max-height: 80%;
			display: flex;
			flex-flow: column;
			width: 92% !important;
			box-sizing: border-box;
			.van-dialog__header {
				padding-top: 0;
				text-align: left;
				font-size: 18px;
				color: #333;
				font-weight: bold;
			};
			.van-dialog__content {
				flex: 1;
				overflow: scroll;
				.slot-content {
				.bedNumberBox {
					display: flex;
					flex-flow: row nowrap;
					height: 60px;
					> div {
					height: 60px;
					line-height: 60px;
					&:first-child {
						width: 90px;
						font-size: 16px;
						color: #9E9E9A;
					};
					&:last-child {
						border-bottom: 1px solid #f9f9f9;
						flex: 1;
						position: relative;
						.van-cell {
						position: absolute;
						width: 100%;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
						padding: 0;
						min-height: 59px !important;
						.van-cell__value {
							min-height: 59px !important;
							.van-field__body {
							min-height: 59px !important;
							.van-field__control {
								font-size: 16px;
								color: #101010;
							}
							}
						}
						}
					}
					}
				};
				.genderBox {
					height: 60px;
					display: flex;
					flex-flow: row nowrap;
					> div {
					height: 60px;
					line-height: 60px;
					&:first-child {
						width: 90px;
						color: #9E9E9A;
						font-size: 16px
					};
					&:last-child {
						flex: 1;
						border-bottom: 1px solid #ececec;
						position: relative;
						/deep/ .van-radio-group {
						width: 100%;
						position: absolute;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
						font-size: 16px;
						color: #101010;
						.van-radio--horizontal {
							&:nth-child(2) {
							margin: 0 20px !important
							}  
						}
						}
					}
					}
				};
				.contact-isolation-box {
					height: 50px;
					display: flex;
					flex-flow: row nowrap;
					> div {
					height: 60px;
					line-height: 60px;
					&:first-child {
						margin-right: 20px;
						font-size: 16px;
						>span {
						&:first-child {
							color: #101010
						}
						}
					};
					&:last-child {
						flex: 1;
						border-bottom: 1px solid #ececec;
						position: relative;
						/deep/ .van-radio-group {
						width: 100%;
						position: absolute;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
						font-size: 16px;
						color: #101010;
						.van-radio--horizontal {
							&:nth-child(1) {
							margin-right: 20px !important
							}  
						}
						}
					}
					}
				};
				.transportBox {
					height: 60px;
					line-height: 60px;
					display: flex;
					> div {
					&:first-child {
						float: left;
						width: 90px;
						font-size: 16px;
						color: #9E9E9A;
						box-sizing: border-box
					};
					&:last-child {
						height: 60px;
						float: right;
						position: relative;
						flex: 1;
						border-bottom: 1px solid #ececec;
						.show-box {
						color: #101010;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						height: 40px !important;
						background: #f9f9f9;
						border: none;
						.input {
							font-size: 15px !important;
							background: #f9f9f9;
							font-size: 16px;
						};
						.right-arrow {
							color: #101010 !important
						}
						}
					}
					}
				};
				.transport-type-child-box {
					.transTypeListStyle {
					background: #44c4f3;
					color: #fff !important;
					border-radius: 4px;
					}
					.transport-type-child-content {
					width: 100%;
					height: 60px;
					line-height: 60px;
					display: flex;
					flex-flow: row nowrap;
					justify-content: space-between;
					> div {
						&:first-child {
						width: 50%;
						margin-right: 6px;
						height: 60px;
						font-size: 16px;
						color: #9E9E9A;
						overflow-x: auto;
						flex-shrink: 0;
						};
						&:last-child {
						flex: 1;
						height: 60px;
						.num-box {
							align-items: center;
							justify-content: space-between;
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
					};
					}
				}
				}
			};
			.van-dialog__footer {
				justify-content: center;
				min-height: 80px;
				box-sizing: border-box;
				padding: 4px 0;
				align-items: center;
				.van-dialog__cancel {
				border-radius: 30px;
				flex: 0 0 40%;
				margin-right: 40px;
				color: #1864FF;
				box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1)
				};
				.van-dialog__cancel:before {
				display: none
				}
				.van-dialog__confirm {
				border-radius: 30px;
				flex: 0 0 40%;
				background: #fff;
				color: #fff;
				background: linear-gradient(to right, #6cd2f8, #2390fe);
				box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1)
				};
				.van-dialog__confirm:after {
				display: none
				}
			}
			}
		};
		.nav {
			width: 100%;
			/deep/ .tabBar-box {
				.van-nav-bar {
					.van-nav-bar__left {
						.van-icon {
							color: #fff !important;
							font-size: 20px !important;
						};
						.van-nav-bar__text {
							color: #fff !important;
							font-size: 14px !important;
							margin-left: 10px;
						}
					};
					.van-nav-bar__title {
						color: #fff !important;
						font-size: 14px !important;
					}
				}	
			}
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
					/deep/ .van-radio-group {
						justify-content: space-between;
						.van-radio--horizontal {
						margin-right: 0 !important;
						&:nth-child(1) {
							.van-radio__label {
							color: #289E8E !important
							}
						};
						&:nth-child(2) {
							.van-radio__label {
							color: #E8CB51 !important
							}
						};
						&:nth-child(3) {
							.van-radio__label {
							color: #F2A15F !important
							}
						};
						&:nth-child(4) {
							.van-radio__label {
							color: #E86F50 !important
							}
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
					>span {
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
					>span {
						color: #101010;
						text-align: right;
						flex: 1;
						.no-wrap();
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
					>span {
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
					padding: 6px 10px 0 0;
					box-sizing: border-box;
					>span {
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
				.patient-message-top-left {
					flex: 1;
					/deep/ .van-cell {
					padding: 10px !important;
					.van-field__label {
						width: 60px !important;
						color: #9E9E9A !important
					};
					.van-cell__value {
						background: #F9F9F9 !important;
						color: #101010 !important;
						font-size: 14px !important;
						padding-left: 4px !important
					}
					}
				};
				.patient-message-top-right {
					flex: 1;
					/deep/ .van-cell {
					padding: 10px !important;
					.van-field__label {
						width: 60px !important;
						color: #9E9E9A !important
					};
					.van-cell__value {
						background: #F9F9F9 !important;
						color: #101010 !important;
						font-size: 14px !important;
						padding-left: 4px !important
					}
					}
				}
				};
				.patient-message-bottom {
				display: flex;
				.patient-message-bottom-left {
					flex: 1;
					/deep/ .van-cell {
					padding: 10px !important;
					.van-field__label {
						width: 60px !important;
						color: #9E9E9A !important
					};
					.van-cell__value {
						background: #F9F9F9 !important;
						color: #101010 !important;
						font-size: 14px !important;
						padding-left: 4px !important
					}
					}
				};
				.patient-message-bottom-right {
					flex: 1;
					/deep/ .van-cell {
					padding: 10px !important;
					.van-field__label {
						width: 60px !important;
						color: #9E9E9A !important
					};
					.van-cell__value {
						background: #F9F9F9 !important;
						color: #101010 !important;
						font-size: 14px !important;
						padding-left: 4px !important
					}
					}
				}
				};
				.patient-message-bottom-age {
				.patient-message-bottom-right {
					width: 50%;
					flex: none
				};
				.contact-isolation-box {
					width: 50%;
					line-height: 20px;
					display: flex;
					>p {
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
						/deep/ .van-radio-group {
						.van-radio--horizontal {
							&:nth-child(1) {
							margin-right: 14px !important
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
				.message-one-right {
				/deep/ .van-radio-group {
					justify-content: flex-end !important;
					.van-radio--horizontal {
					margin-right: 10px !important;
					&:last-child {
						margin-right: 0 !important
					}; 
					&:nth-child(1) {
						.van-radio__label {
						color: #101010 !important
						}
					};
					&:nth-child(2) {
						.van-radio__label {
						color: #101010 !important
						}
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
					/deep/ .van-cell {
						padding: 2px 6px !important;
						background: #F9F9F9;
						.van-cell__value {
						.van-field__control {
							text-align: center !important
						}
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
							/deep/ .van-icon {
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
						> div {
							> div {
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
												-webkit-span-fill-color: #101010 !important;
											}
										}
									}
								}
							}
						};
						.field-one {
							display: flex;
							flex-flow: row nowrap;
							justify-content: space-between;
							> p {
								margin-right: 4px;
								flex: 1;
								/deep/ .van-cell {
									background: #f9f9f9;
									justify-content: center;
									padding: 4px !important;
									.van-field__label {
										color: #9E9E9A;
										width: auto !important;
									};
									.van-field__value {
										.van-field__control:disabled{
											color: #303133 !important;
											-webkit-text-fill-color: #303133 !important;
										}
									}
								};
								&:last-child {
									margin-right: 0 !important
								}
							}
						};
						.field-two {
							display: flex;
							flex-flow: row nowrap;
							justify-content: flex-start;
							> p {
								margin-right: 4px;
								flex: 1;
								/deep/ .van-cell {
									background: #f9f9f9;
									justify-content: center;
									padding: 4px !important;
									.van-field__label {
										color: #9E9E9A;
										width: auto !important;
									};
									.van-field__value {
										.van-field__control:disabled{
											color: #303133 !important;
											-webkit-text-fill-color: #303133 !important;
										}
									}
								};
								&:last-child {
									margin-right: 0 !important
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
								> div {
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
								>div {
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
							> div {
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
					/deep/ .van-icon {
						margin-right: 6px;
					}
				}
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
              box-sizing: border-box;
              >span {
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
          }
		};
		.btn-box {
			width: 90%;
			margin: 0 auto;
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			>span {
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