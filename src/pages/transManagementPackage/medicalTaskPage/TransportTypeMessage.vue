<template>
  <div class="content-wrapper">
    <van-overlay :show="overlayShow" style="z-index:10000"/>
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
      <!-- <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon>  -->
    </HeaderTop>
     <!-- 右边下拉框菜单 -->
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="loading">
      <loading :isShow="showLoadingHint" textContent="创建中,请稍候····" textColor="#2895ea"></loading>
    </div>
    <div class="templateOne" v-if="templateType === 'template_one'">
      <div class="transport-type-title">
        <h3>{{transportantTaskMessage.value}}</h3>
      </div>
      <div class="transport-type-area">
        <div class="destination-box">
          <div class="destination-title">优先级</div>
            <div class="destination-content">
              <van-radio-group v-model="checkResult" direction="horizontal" checked-color="#afe897">
                <van-radio name="1">正常</van-radio>
                <van-radio name="2">重要</van-radio>
                <van-radio name="3">紧急</van-radio>
                <van-radio name="4">紧急重要</van-radio>
              </van-radio-group>
            </div>
          </div>
        <div class="destination-box-department">
          <div class="destination-title">请选择起点科室</div>
          <div class="destination-content creat-chooseHospital-content-two" v-if="destinListShow">
            <Ldselect :list="destinationList"
                       label-key="value" value-key="id"
                       clearable
                       placeholder="请选择"
                       color="#333"
                       selectColor="#43c3f3"
                       bgColor="#f9f9f9"
                       v-model="destinationListOneValue"
                       @change="destinationOneChange">
            </Ldselect>
          </div>
        </div>
        <div class="transport-type-box">
          <div class="transport-type-title-inner">运送类型</div>
          <div class="transport-type-list">
            <span :class="{spanStyle:typeIndex === index}" v-for="(item,index) in typeOperationList" :key="`${item}-${index}`" @click="typeEvent(item,index)">
              {{item.text}}
            </span>
          </div>
        </div>
        <div class="field-box">
          <p>
            <van-field v-model="bedNumber" label="床号" placeholder=""/>
          </p>
          <p>
            <van-field v-model="patientName"  label="姓名" placeholder=""/>
          </p>
          <p>
            <van-field v-model="patientNumber"  label="住院号" placeholder=""/>
          </p>
          <p>
            <van-field v-model="actualData"  type="number" label="运送数量" placeholder=""/>
          </p>
          <div class="contact-isolation-box">
            <p>接触隔离</p>
            <p>
              <van-radio-group v-model="isContactisolationValue" direction="horizontal" checked-color="#afe897">
                <van-radio icon-size="20px" name="1">是</van-radio>
                <van-radio icon-size="20px" name="0">否</van-radio>
              </van-radio-group>
            </p>
          </div>
        </div>
        <div class="tool-box" @click="toolEvent">
          <div class="tool-title">
            转运工具
          </div>
          <div class="tool-name">
            {{toolName}}
          </div>
          <div class="tool-sign">
            <van-icon name="arrow"/>
          </div>
        </div>
        <div class="destination-box">
          <div class="destination-title destination-title-inner">运送员是否返回</div>
          <div class="destination-content destination-content-inner">
            <van-radio-group v-model="judgeResult" direction="horizontal" checked-color="#afe897">
              <van-radio name="0">否</van-radio>
              <van-radio name="1">是</van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="describle-box">
          <van-field v-model="taskDescribe"   type="textarea"
          autosize label="任务描述" placeholder="请输入任务描述"/>
        </div>
      </div>
    </div>
    <div class="templateTwo" v-else-if="templateType === 'template_two'">
      <div class="transport-type-area">
        <div class="destination-box">
          <div class="destination-title">优先级</div>
          <div class="destination-content">
            <van-radio-group v-model="checkResult" direction="horizontal" checked-color="#afe897">
              <van-radio name="1">正常</van-radio>
              <van-radio name="2">重要</van-radio>
              <van-radio name="3">紧急</van-radio>
              <van-radio name="4">紧急重要</van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="tool-box" @click="toolEvent">
          <div class="tool-title">
            转运工具
          </div>
          <div class="tool-name">
            {{toolName}}
          </div>
          <div class="tool-sign">
            <van-icon name="arrow"/>
          </div>
        </div>
        <div class="destination-box">
          <div class="destination-title destination-title-inner">运送员是否返回</div>
          <div class="destination-content destination-content-inner">
            <van-radio-group v-model="judgeResult" direction="horizontal" checked-color="#afe897">
              <van-radio name="0">否</van-radio>
              <van-radio name="1">是</van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="destination-box-department">
            <div class="destination-title">请选择起点科室</div>
            <div class="destination-content creat-chooseHospital-content-two" v-if="destinListShow">
              <Ldselect :list="destinationList"
                         label-key="value" value-key="id"
                         clearable
                         placeholder="请选择"
                         color="#333"
                         selectColor="#43c3f3"
                         bgColor="#f9f9f9"
                         v-model="destinationListValue"
                         @change="destinationChange">
              </Ldselect>
            </div>
          </div>
        <div class="destination-box destination-box-taskTotal">
          <div class="destination-title destination-title-inner">该任务运送总数</div>
          <div class="destination-content destination-content-inner">
            <van-field v-model="totalNumber" placeholder="" disabled />
          </div>
        </div>
        <div class="field-box-wrapper">
            <div class="field-box-two" v-for="(item,index) in templatelistTwo" :key="`${item}-${index}`">
              <div class="field-title">
                <div class="patient-name">病人{{index+1}}</div>
                <van-icon v-show="index > 0" name="delete"  @click="deletetMessage(index)"/>
                <van-icon name="records" @click="editMessage(index)"/>
              </div>
              <div class="field-wrapper">
                <div class="field-four">
                  <div class="contact-isolation-box">
                    <p>接触隔离:</p>
                    <p>
                     {{ item.isContactisolationValue == 1 ? '是' : item.isContactisolationValue === null ? '' : '否' }}
                    </p>
                  </div>
                </div>
                <div class="field-one">
                  <p>
                    <van-field v-model="item.bedNumber" label="床号" disabled/>
                  </p>
                  <p>
                    <van-field v-model="item.patientName"  label="姓名" disabled/>
                  </p>
                  <p class="admission-number">
                    <van-field v-model="item.patientNumber"  label="住院号" disabled/>
                  </p>
                </div>
                <div class="field-two">
                  <p>
                    <van-field v-model="item.genderValue" label="性别" disabled/>
                  </p>
                  <p>
                    <van-field v-model="item.actualData"  type="number" label="运送数量" placeholder="" disabled/>
                  </p>
                  <p>
                    <van-field v-model="item.age"  type="digit" label="年龄" placeholder="" disabled/>
                  </p>
                </div>
                <div class="field-three">
                  <div class="sample-box">
                    <p>运送类型</p>
                    <p>
                      {{item.sampleValue}}
                    </p>
                    <p>
                    {{jointTransportMessage(index)}}
                    </p>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div class="add-message" @click="addMessageEvent">
            <span>
              <van-icon name="plus" />
            </span>
            添加病人信息
        </div>
        <div class="describle-box">
          <van-field v-model="taskDescribe"   type="textarea" rows="1"
                     autosize label="任务描述" placeholder="请输入任务描述"/>
        </div>
      </div>
    </div>
    <div class="btn-area">
        <span  @click="getTransConfig">
          确 认
        </span>
      <span @click="dispatchTaskCancel">
          取 消
        </span>
    </div>
    <div class="tool-show">
      <van-dialog v-model="toolShow" title="请选择运送工具" show-cancel-button width="92%"
          @confirm="toolSure" @cancel="toolCancel"
        >
          <div class="tool-name-list">
            <div class="tool-name-list-content">
              <span :class="{spanStyle:toolIndex === index}" v-for="(item,index) in vehicleOperationList" :key="`${item}-${index}`" @click="toolCheck(item,index)">
                {{item.text}}
              </span>
            </div>
          </div>
    </van-dialog>
    </div>
    <div class="patien-modal-box">
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
            <van-field v-model="patienModalMessage.age" type="digit" placeholder="请输入年龄" />
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
                 @inputBlur="inputBlurEvent(arguments)"
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
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import FooterBottom from '@/components/FooterBottom'
import { queryTransConfig } from '@/api/trans/taskScheduling.js'
import {queryAllDestination, queryTransportTypeClass, queryTransportTools, generateDispatchTask, quereDeviceMessage, queryTransportType, generateDispatchTaskMany} from '@/api/trans/medicalPort.js'
import {userSignOut} from '@/api/trans/workerPort.js'
import NoData from '@/components/NoData'
import Vselect from '@/components/Vselect'
import Ldselect from '@/components/Ldselect'
import Loading from '@/components/Loading'
import _ from 'lodash'
import StepNumberBox from '@/components/StepNumberBox'
import { mapGetters, mapMutations } from 'vuex'
import { setStore,  IsPC,  removeAllLocalStorage } from '@/common/js/utils'
export default {
  name: 'transportTypeMessage',
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      destinListShow: false,
      xflSelectShow: false,
      isPressEdit: false,
      updateIndex: 0,
      transportParentControlListShow: false,
      destinationId: '',
      destinationName: '',
      destinationListOneValue: '',
      destinationListValue: '',
      isContactisolationValue: null,
      transportTypeParent: [],
      transportTypeChild: [],
      templatelistTwo: [
        {
          bedNumber: '',
          patientName: '',
          patientNumber: '',
          genderValue: '未知',
          age: '',
          actualData: 0,
          sampleValue: '',
          sampleList: [],
          sampleId: '',
          isContactisolationValue: null,
          transportList: [],
          generList: []
        }
      ],
      patienModalMessage: {
        bedNumber: '',
        patientName: '',
        patientNumber: '',
        actualData: 0,
        age: '',
        genderValue: '0',
        isContactisolationValue: null,
        transportList: [],
        sampleList: [],
        sampleValue: '',
        sampleId: ''
      },
      patienModalShow: false,
      showLoadingHint: false,
      overlayShow: false,
      liIndex: null,
      toolShow: false,
      typeIndex: '',
      typeText: '',
      toolName: '',
      toolIndex: '',
      toolText: '',
      toolValue: '',
      typeValue: '',
      checkResult: '1',
      destinationAddress: 0,
      destinationList: [],
      vehicleOperationList: [],
      typeOperationList: [],
      typeList: [],
      returnDepartureOperation: 0,
      judgeResult: '',
      bedNumber: '',
      patientName: '',
      patientNumber: '',
      taskDescribe: '',
      actualData: '',
      taskSurePng: require('@/components/images/task-sure.png'),
      taskCancelPng: require('@/components/images/task-cancel.png')
    }
  },

  components: {
    HeaderTop,
    NoData,
    Loading,
    FooterBottom,
    Vselect,
    Ldselect,
    StepNumberBox,
    VanFieldSelectPicker
  },

  // 监听每个病人对应的运送类型数量
  watch: {
    templatelistTwo: {
      handler(newVal,oldVal) {
        this.totalNumber  = this.templatelistTwo.reduce((accumulator, currentValue) => {
          return accumulator + Number(currentValue.actualData)
        },0);
      },
      deep: true,
      immediate: true
    }
  },

  computed: {
    ...mapGetters([
      'navTopTitle',
      'transportantTaskMessage',
      'userInfo',
      'globalTimer',
      'templateType'
    ]),
    proId () {
      return this.userInfo.extendData.proId
    },
    userName () {
      return this.userInfo.userName
    },
    proName () {
      return this.userInfo.extendData.proName
    },
    workerId () {
      return this.userInfo.extendData.userId
    },
    transportTypeParentInitValue () {
      return this.transportantTaskMessage.id
    }
  },

  mounted () {
    console.log(this.transportantTaskMessage.value);
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        this.changeIsFreshHomePage(false);
        this.$router.push({path: 'home'});
        this.changeTitleTxt({tit:'首页'});
        setStore('currentTitle','首页')
      })
    };
    this.parallelFunction();
    let me = this;
    window['setDeviceInfo'] = (val) => {
      me.setDeviceInfo(val);
    }
  },


  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeDispatchTaskMessage',
      'changeOverDueWay',
      'changeCatchComponent',
      'changeIsFreshHomePage'
    ]),

      // 返回上一页
      backTo () {
        this.changeIsFreshHomePage(false);
        this.$router.push({path: 'home'});
        this.changeTitleTxt({tit:'中央运送'});
        setStore('currentTitle','中央运送')
      },

      // 步进器增加或减少事件
      plusNum(msg) {
        this.patienModalMessage.transportList[msg[2]]['typerNumber'] = msg[1];
        this.reduceTotal(msg[2]);
      },
      minusNum(msg) {
        this.patienModalMessage.transportList[msg[2]]['typerNumber'] = msg[1];
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

      // 右边下拉菜单点击事件
      leftLiCLick (index) {
        this.liIndex = index;
        this.userLoginOut(this.proId, this.userInfo.userName)
      },

      // 用户签退
      userLoginOut (proId,workerId) {
        this.changeOverDueWay(true);
        setStore('storeOverDueWay',true);
        userSignOut(proId,workerId).then((res) => {
          if (res && res.data.code == 200) {
            if(this.globalTimer) {window.clearInterval(this.globalTimer)};
            removeAllLocalStorage();
            this.changeCatchComponent([]);
            this.$router.push({path:'/'})
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
            this.changeOverDueWay(false);
            setStore('storeOverDueWay',false);
          }
        }).
        catch((err) => {
          this.changeOverDueWay(false);
          setStore('storeOverDueWay',false);
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      // 跳转到我的页
      skipMyInfo () {
        this.leftDownShow = !this.leftDownShow;
      },

      // 运送类型大类下拉框值变化时事件
      sampleListValueChange (index) {
        this.querytransportChildByTransportParent(index,this.templatelistTwo[index].sampleValue);
        this.templatelistTwo[index].actualData = 0;
        console.log('飒飒',this.templatelistTwo[index].sampleValue)
      },

      // 运送类型大类选择列表变化时
      transportParentChange(val) {
        this.querytransportChildByTransportParent(val.parentIndex, val.orignItem.id);
        this.patienModalMessage.actualData = 0;
        this.patienModalMessage.sampleValue = val.orignItem.value;
        this.patienModalMessage.sampleId = val.orignItem.id;
      },

      // 运送类型大类下拉框隐藏或显示时事件
      transportParentVisibleChange() {

      },

      // 运送类型大类input中的数据变化时触发
      transportParentInputEvent(val) {},

      inpuntClick () {

      },

      // 目的地模板一选择列表变化事件
      destinationOneChange(val) {
        this.destinationListOneValue = val;
      },

      // 目的地模板二选择列表变化事件
      destinationChange(val) {
        this.destinationListValue = val;
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

      // 模板二运送类型点击事件
      sampleTypeEvent(innerItem, innerIndex) {
        this.patienModalMessage.transportList[innerIndex].checked = !this.patienModalMessage.transportList[innerIndex].checked;
        if (!this.patienModalMessage.transportList[innerIndex].checked) {
          if (this.patienModalMessage.transportList[innerIndex]['typerNumber'] != 0) {
            this.patienModalMessage.transportList[innerIndex]['typerNumber'] = 0
          }
        };
        this.reduceTotal(0)
      },

      // 运送类型子类步进器值改变事件
      stepperValChange(msg) {
        this.reduceTotal(msg[1]);
      },

    // 根据运送类型大类查询运送类型小类
    querytransportChildByTransportParent (index,id, flag) {
      queryTransportType({
        proId: this.proId,
        state: 0,
        parentId: id
      }).then((res) => {
        if (res && res.data.code == 200) {
          this.patienModalMessage['transportList'] = [];
          for(let item of res.data.data) {
            this.patienModalMessage['transportList'].push({
              text: item.typeName,
              value: item.id,
              checked: false,
              typerNumber: 0
            })
          };
          console.log('飒飒',this.patienModalMessage);
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {})
      })
    },

      // 查询运送类型小类
      getTransPorttype (data) {
        return new Promise((resolve,reject) => {
          queryTransportType(data)
          .then((res) => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            }
          })
          .catch((err) => {
            reject(err.message)
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
          }
        })
          .catch((err) => {
            reject(err.message)
          })
      })
    },

      // 获取设备信息
      getDeviceMessage () {
        window.android.getDeviceInfo()
      },

      // 获取设备信息回调函数
      setDeviceInfo (val) {
        if (val) {
          try {
            this.searchDeviceMessage({ proId: this.proId, deviceNumber: val['IMEI']})
          } catch (err) {
            this.$dialog.alert({
              message: `${err}`,
              closeOnPopstate: true
            }).then(() => {})
          }
        }
      },

      // 查询设备信息
      searchDeviceMessage (data) {
        quereDeviceMessage(data)
        .then((res) => {
          if (res && res.data.code == 200) {
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {})
        })
      },

      // 运送类型点击事件
      typeEvent (item,index) {
        this.typeIndex = index;
        this.typeText = item.text;
        this.typeValue = item.value
      },

      // 转运工具点击事件
      toolCheck (item, index) {
        this.toolIndex = index;
        this.toolText = item.text;
        this.toolName = item.text
        this.toolValue = item.value
      },

      // 转运工具弹框确认事件
      toolSure () {
        this.toolShow = false;
      },

      // 转运工具弹框取消事件
      toolCancel () {
        this.toolIndex = '';
        this.toolName = '';
        this.toolShow = false
      },

      // 转运工具点击事件
      toolEvent () {
        this.toolShow = true;
      },

      // 并行查询目的地、转运工具、运送类型小类、运送类型大类
      parallelFunction (type) {
        Promise.all([this.getAllDestination(),this.getTransportTools(), this.getTransPorttype({
          proId: this.proId,
          state: 0,
          parentId: this.transportantTaskMessage.id
        }),this.getTransportsTypeParent()])
        .then((res) => {
          if (res && res.length > 0) {
            this.destinationList = [];
            this.vehicleOperationList = [];
            this.typeOperationList = [];
            this.transportTypeParent = [];
            this.transportTypeChild = [];
            this.templatelistTwo[0].sampleList = [];
            this.templatelistTwo[0].transportList = [];
            let [item1,item2,item3,item4] = res;
            if (item1) {
              Object.keys(item1).forEach((item) => {
                this.destinationList.push({
                  value: item1[item],
                  id: item
                })
              });
              this.destinListShow = true;
            };
            if (item2) {
              for (let item of item2) {
                this.vehicleOperationList.push({
                  text: item.toolName,
                  value: item.id
                })
              };
              this.vehicleOperationList.push({
                text: '无工具',
                value: 0,
                checked: false
              })
            };
            if (item3) {
              for(let item of item3) {
                this.typeOperationList.push({
                  text: item.typeName,
                  value: item.id
                });
                this.templatelistTwo[0].transportList.push({
                  text: item.typeName,
                  value: item.id,
                  checked: false,
                  typeNumber: ''
                });
                this.patienModalMessage['transportList'].push({
                  text: item.typeName,
                  value: item.id,
                  checked: false,
                  typerNumber: 0
                });
                this.transportTypeChild.push({
                  text: item.typeName,
                  value: item.id,
                  checked: false,
                  typeNumber: ''
                })
              };
            };
            if (item4) {
              for (let item of item4) {
                this.transportTypeParent.push({
                  id: item.id,
                  value: item.typeName
                })
              };
              this.templatelistTwo[0].sampleList = this.transportTypeParent;
              this.templatelistTwo[0].sampleValue = this.transportantTaskMessage.value;
              this.templatelistTwo[0].sampleId = this.transportantTaskMessage.id;
              this.patienModalMessage.sampleList = this.transportTypeParent;
              this.patienModalMessage.sampleValue = this.transportantTaskMessage.value;
              this.patienModalMessage.sampleId = this.transportantTaskMessage.id;
            }
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err}`,
            closeOnPopstate: true
          }).then(() => {})
        })
      },

      // 查询目的地
      getAllDestination () {
        return new Promise((resolve,reject) => {
          queryAllDestination(this.proId).then((res) => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            }
          })
          .catch((err) => {
            reject(err.message)
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
            }
          })
          .catch((err) => {
            reject(err.message)
          })
        })
      },


      // 病人信息删除事件
      deletetMessage (index) {
        this.templatelistTwo.splice(index,1)
      },

      // 病人信息编辑事件
      editMessage(index) {
        this.updateIndex = index;
        this.isPressEdit = true;
        this.xflSelectShow = true;
        this.patienModalMessage = {};
        this.patienModalMessage = _.cloneDeep(this.templatelistTwo[index]);
        this.transferGenderTwo();
        this.patienModalShow = true
      },

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

      // 添加病人信息事件
      addMessageEvent () {
        this.isPressEdit = false;
        this.patienModalShow = true;
        this.xflSelectShow = true;
        this.patienModalMessage = {};
        this.patienModalMessage = _.cloneDeep({
          bedNumber: '',
          patientName: '',
          patientNumber: '',
          actualData: 0,
          genderValue: '0',
          age: '',
          isContactisolationValue: null,
          transportList: this.transportTypeChild,
          sampleList: this.transportTypeParent,
          sampleValue: this.transportantTaskMessage.value,
          sampleId: this.transportantTaskMessage.id
        });
        console.log('病人信息',this.templatelistTwo)
      },

      // 病人模态框信息确认事件
      patienModalSure () {
        if (this.isPressEdit) {
          this.templatelistTwo.splice(this.updateIndex, 1,_.cloneDeep(this.patienModalMessage));
          this.transferGenderOne(this.updateIndex);
          console.log('病人信息',this.templatelistTwo);
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
        this.xflSelectShow = false;
      },

      // 生成调度任务(一个病人)
      postGenerateDispatchTask (data) {
        this.showLoadingHint = true;
        this.overlayShow = true;
        generateDispatchTask(data).then((res) => {
          if (res && res.data.code == 200) {
            this.$toast(`${res.data.msg}`);
            this.$router.push({path:'/home'});
            this.changeTitleTxt({tit:'中央运送'});
            setStore('currentTitle','中央运送');
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
          };
          this.showLoadingHint = false;
          this.overlayShow = false
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
          this.showLoadingHint = false;
          this.overlayShow = false
        })
      },

    // 根据科室id获取科室名称
    getDepartmentNameById(id) {
      return this.destinationList.filter((item) => {return item['id'] == id})[0]['value']
    },

    //生成调度任务(多个病人)
    postGenerateDispatchTaskMany(data) {
      this.showLoadingHint = true;
      this.overlayShow = true;
      generateDispatchTaskMany(data).then((res) => {
        if (res && res.data.code == 200) {
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          });
          setTimeout(() => {
            this.backTo()
          }, 1000)
        } else {
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          });
        };
        this.showLoadingHint = false;
        this.overlayShow = false
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
        this.showLoadingHint = false;
        this.overlayShow = false
      })
    },

    // 查询是否配置接触隔离选项0-没配置1-配置
    getTransConfig () {
      this.showLoadingHint = true;
      this.overlayShow = true;
      queryTransConfig(this.proId,'TRANS_QUARANTINE').then((res) => {
        if (res && res.data.code == 200) {
          if (JSON.parse(res.data.data)[0]['value'] == 1) {
            if (this.templateType === 'template_one') {
              if (this.transportantTaskMessage.value == '检查') {
                if (this.isContactisolationValue === null) {
                  this.$toast('请确认病人是否需要接触隔离!')
                } else {
                  this.dispatchTaskSure(true)
                }
              } else {
                this.dispatchTaskSure(false)
              } 
            } else if (this.templateType === 'template_two') {
              if (this.transportantTaskMessage.value == '检查') {
                let temporaryFlag = this.templatelistTwo.some((item) => { return item.isContactisolationValue === null });
                if (temporaryFlag) {
                  this.$toast('请确认病人是否需要接触隔离!')
                } else {
                  this.dispatchTaskSure(true)
                }
              } else {
                this.dispatchTaskSure(false)
              } 
            }  
          } else {
            this.dispatchTaskSure(false)
          }
        } else {
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          })
        };
        this.showLoadingHint = false;
        this.overlayShow = false;
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
        this.showLoadingHint = false;
        this.overlayShow = false;
      })
    },

      // 运送类型信息确认事件
      dispatchTaskSure (flag) {
        if (this.templateType === 'template_one') {
          // if (!this.destinationListOneValue) {
          //   this.$dialog.alert({
          //     message: '科室不能为空',
          //     closeOnPopstate: true
          //   }).then(() => {
          //   });
          //   return
          // };
          let taskMessage = {
            // setOutPlaceId: this.userInfo.depId,  //出发地ID
            // setOutPlaceName: this.userInfo.depName,  //出发地名称
            setOutPlaceId: this.destinationListOneValue == '' ? this.userInfo.depId : this.destinationListOneValue, //出发地ID
            setOutPlaceName: this.destinationListOneValue == '' ? this.userInfo.depName : this.getDepartmentNameById(this.destinationListOneValue),//出发地名称
            // destinationId: !this.destinationListOneValue ? '' : this.destinationListOneValue,   //目的地ID
            // destinationName: !this.destinationListOneValue ? '' : this.getDepartmentNameById(this.destinationListOneValue),  //目的地名称
            parentTypeId:  this.transportantTaskMessage.id, //运送父类型Id
            parentTypeName: this.transportantTaskMessage.value,//运送父类型名称
            taskTypeId: this.typeValue,  //运送类型 ID
            taskTypeName: this.typeText,  //运送类型 名 称
            priority: this.checkResult,   //优先级   0-正常, 1-重要,2-紧急, 3-紧急重要
            toolId: this.toolValue === 0 ? 0 : this.toolValue === '' ? '' : this.toolValue, //运送工具ID
            toolName: this.toolName === '无工具' ? '无工具' : this.toolName === '' ? '' : this.toolName, //运送工具名称
            actualCount: this.actualData,   //实际数量
            patientName: this.patientName,  //病人姓名
            sex: 0,    //病人性别  0-未指定,1-男, 2-女
            age: "",   //年龄
            number: this.patientNumber,   //住院号
            quarantine: this.isContactisolationValue === null ? -1 : this.isContactisolationValue, // 接触隔离
            bedNumber: this.bedNumber,  //床号
            taskRemark: this.taskDescribe,   //备注
            createId: this.workerId,   //创建者ID  当前登录者
            createName: this.userName,   //创建者名称  当前登陆者
            proId: this.proId,   //项目ID
            proName: this.proName,   //项目名称
            isBack: this.judgeResult,  //是否返回出发地  0-不返回，1-返回
            createType: 1,   //创建类型   0-调度员,1-医务人员(平板创建),2-医务人员(小程序)
            startTerminal: 1 // 发起客户端类型 1-安卓APP，2-微信小程序  
          };
          // 创建调度任务
          this.postGenerateDispatchTask(taskMessage);
        } else if (this.templateType === 'template_two') {
          // if (this.destinationListValue.length == 0) {
          //   this.$dialog.alert({
          //     message: '科室不能为空',
          //     closeOnPopstate: true
          //   }).then(() => {
          //   });
          //   return
          // };
          let taskMessageTwo = {
            setOutPlaceId: this.destinationListValue == '' ? this.userInfo.depId : this.destinationListValue, //出发地ID
            setOutPlaceName: this.destinationListValue == '' ? this.userInfo.depName : this.getDepartmentNameById(this.destinationListValue),//出发地名称
            destinations: [],//多个目的地列表
            patientInfoList: [], //多个病人信息列表
            priority: this.checkResult, //优先级   0-正常, 1-重要,2-紧急, 3-紧急重要
            toolId: this.toolValue === 0 ? 0 : this.toolValue === '' ? '' : this.toolValue, //运送工具ID
            toolName: this.toolName === '无工具' ? '无工具' : this.toolName === '' ? '' : this.toolName, //运送工具名称
            actualCount: this.totalNumber, //实际数量
            taskRemark: this.taskDescribe, //备注
            createId: this.workerId,   //创建者ID  当前登录者
            createName: this.userName,   //创建者名称  当前登陆者
            proId: this.proId, //项目ID
            proName: this.proName, //项目名称
            isBack: this.judgeResult, //是否返回出发地  0-不返回，1-返回
            createType: 1, //创建类型   0-调度员,1-医务人员(平板创建),2-医务人员(小程序)
            startTerminal: 1 // 发起客户端类型 1-安卓APP，2-微信小程序
          };
          // 获取目的地列表数据
          // if (this.destinationListValue.length > 0) {
          //   for (let item of this.destinationListValue) {
          //     taskMessageTwo.destinations.push({
          //       destinationId: item,
          //       destinationName: this.getDepartmentNameById(item)
          //     })
          //   }
          // };
          // 获取多个病人信息列表数据
          for (let patientItem of this.templatelistTwo) {
            taskMessageTwo.patientInfoList.push({
              bedNumber: patientItem['bedNumber'],
              patientName: patientItem['patientName'],
              age: patientItem['age'],
              number: patientItem['patientNumber'],
              sex: patientItem['genderValue'] == '未知' ? 0 : patientItem['genderValue'] == '男' ?  1 : 2,
              quarantine: patientItem['isContactisolationValue'] === null ? -1 : patientItem['isContactisolationValue'], // 接触隔离
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
                    parentTypeId: this.templatelistTwo[i]['sampleId'],
                    parentTypeName: this.templatelistTwo[i]['sampleValue'],
                    taskTypeId: innerItem['value'],
                    taskTypeName: innerItem['text']
                  })
                }
              } else {
                taskMessageTwo.patientInfoList[i]['typeList'].push({
                  quantity: 1,
                  parentTypeId: this.templatelistTwo[i]['sampleId'],
                  parentTypeName: this.templatelistTwo[i]['sampleValue'],
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
          this.postGenerateDispatchTaskMany(taskMessageTwo);
          console.log('最终数据',taskMessageTwo)
        }
      },

      // 运送类型信息取消事件
      dispatchTaskCancel () {
        this.$router.push({path:'/home'});
        this.changeTitleTxt({tit:'中央运送'});
        setStore('currentTitle','中央运送')
      }
  }
}

</script>
<style lang='less' scoped>
  @import "~@/common/stylus/variable.less";
  @import "~@/common/stylus/mixin.less";
  @import "~@/common/stylus/modifyUi.less";
  .content-wrapper {
    .van-overlay{
      z-index: 1000;
    };
    .btn-area {
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px;
      margin: 0 auto;
      height: 80px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      span {
        width: 47%;
        height: 60px;
        display: inline-block;
        font-size: 18px;
        text-align: center;
        line-height: 60px;
        &:first-child {
          border-radius: 4px;
          background-image: linear-gradient(to right, #37d5fc , #429bff);
          color: #fff
        };
        &:last-child {
          border-radius: 4px;
          background: #e8e8e8;
          border: none;
          color: #666666
        }
      }
    };
    .tool-show {
      /deep/ .van-dialog {
        width: 90% !important;
        .van-dialog__content {
          margin-bottom: 6px;
          height: 300px;
          margin: 10px 0;

          .tool-name-list {
            width: 90%;
            margin: 0 auto;
            display: flex;
            height: 300px;
            flex-flow: row wrap;
            justify-content: space-between;
            align-items: center;
            overflow: auto;

            .tool-name-list-content {
              width: 100%;
              height: 100%;
              padding: 6px;

              .spanStyle {
                background: #d6f4ff;
                color: #01a6ff;
                border: 1px solid #4cc5f2;
              }

              span {
                display: inline-block;
                width: 45%;
                height: 40px;
                text-align: center;
                margin-bottom: 8px;
                margin-right: 10px;
                line-height: 40px;
                background: #f9f9f9;
                color: @color-text-right;

                &:nth-child(even) {
                  margin-right: 0
                }
              }
            }
          }
        };
        .van-dialog__footer {
          justify-content: space-between;
          padding: 6px;
          .van-dialog__cancel {
            border-radius: 30px;
            flex: 0 0 45%;
            margin-top: 8px;
            background: #e8e8e8;
            color: #666666
          };
          .van-dialog__cancel:before {
            display: none
          };
          .van-dialog__confirm {
            border-radius: 30px;
            flex: 0 0 45%;
            margin-top: 8px;
            background: #fff;
            color: #43c3f4 !important;
            border: 1px solid #43c3f4
          };
          .van-dialog__confirm:after {
            display: none
          }
        }
      }
    }
    // 病人信息模态框样式
    .patien-modal-box {
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
        }
      ;

        .van-dialog__content {
          flex: 1;
          overflow: auto;
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
                  color: @color-text-left;
                }
              ;

                &:last-child {
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
                    border-bottom: 1px solid #f9f9f9;

                    .van-cell__value {
                      min-height: 59px !important;

                      .van-field__body {
                        min-height: 59px !important;

                        .van-field__control {
                          font-size: 16px;
                          color: @color-text-right;
                        }
                      }
                    }
                  }
                }
              }
            }
          ;

            .genderBox {
              height: 60px;
              display: flex;
              flex-flow: row nowrap;
              > div {
                height: 60px;
                line-height: 60px;

                &:first-child {
                  width: 90px;
                  color: @color-text-left;
                  font-size: 16px
                }
              ;

                &:last-child {
                  flex: 1;
                  border-bottom: 1px solid #ececec;
                  position: relative;

                  .van-radio-group {
                    width: 100%;
                    position: absolute;
                    top: 50%;
                    left: 0;
                    transform: translateY(-50%);
                    font-size: 16px;
                    color: @color-text-left;
                  }
                }
              }
            }
          ;
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
                    color: #101010;
                  }
                }
              };
              &:last-child {
                flex: 1;
                border-bottom: 1px solid #ececec;
                align-items: center;
                display: flex;
                /deep/ .van-radio-group {
                  width: 100%;
                  font-size: 16px;
                  color: @color-text-left;
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
                  color: @color-text-left;
                  box-sizing: border-box
                }
              ;

                &:last-child {
                  height: 60px;
                  float: right;
                  position: relative;
                  flex: 1;
                  border-bottom: 1px solid #ececec;

                  .show-box {
                    color: @color-text-right;
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
                    }
                  ;

                    .right-arrow {
                      color: @color-text-right !important
                    }
                  }
                }
              }
            }
          ;

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
                    color: @color-text-left;
                    overflow-x: auto;
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
                      }
                    ;

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
              ;
              }
            }
          }
        }
      ;

        .van-dialog__footer {
          justify-content: space-between;
          min-height: 80px;
          box-sizing: border-box;
          padding: 4px 0;
          align-items: center;
          .van-dialog__cancel {
            border-radius: 30px;
            flex: 0 0 45%;
            background: #e8e8e8;
            color: #666666;
          };
          .van-dialog__cancel:before {
            display: none
          }
          .van-dialog__confirm {
            border-radius: 30px;
            flex: 0 0 45%;
            background: #fff;
            color: #43c3f4 !important;
            border: 1px solid #43c3f4
          };
          .van-dialog__confirm:after {
            display: none
          }
        }
      }
    }
    .loading {
      position: absolute;
      top: 300px;
      left: 0;
      width: 100%;
      height: 50px;
      text-align: center;
      pointer-events: none
    };
    position: relative;
    .content-wrapper();
    font-size: 14px;
      .left-dropDown {
      .rightDropDown
    };
    .templateOne {
      flex:1;
      overflow: auto;
      overflow-x: hidden;
      margin: 0 auto;
      width: 100%;
      display: flex;
      flex-flow: column nowrap;
      .transport-type-title {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        background: #e2e2e2;
        h3 {
          font-size: 14px;
          color: #1699e8
        }
      };
      .transport-type-area {
        flex:1;
        overflow: auto;
        margin: 0 auto;
        width: 100%;
        .destination-box {
          width: 100%;
          margin: 0 auto;
          padding: 12px;
          box-sizing: border-box;
          border-bottom: 12px solid #f6f6f6;
          > div {
            display: inline-block;
            vertical-align: middle;
          };
          .destination-title {
            width: 20%;
            color: @color-text-left
          }
          .destination-title-inner {
            width: 30%
          }
          .destination-content {
            width: 78%;
            position: relative;
            /deep/ .van-radio-group {
              justify-content: space-between;
              .van-radio--horizontal {
                margin-right: 0;
                &:nth-child(1) {
                  .van-radio__label {
                    color: #0ac30a
                  }
                }
                &:nth-child(2) {
                  .van-radio__label {
                    color: #fdc050
                  }
                }
                &:nth-child(3) {
                  .van-radio__label {
                    color: #ff4141
                  }
                }
                &:nth-child(4) {
                  .van-radio__label {
                    color: #cc0000
                  }
                }
              }
            }
          }
          .destination-content-inner {
            width: 68%;
            /deep/ .van-radio-group {
              justify-content: flex-start;
              .van-radio--horizontal {
                margin-right: 4%;
                &:last-child {
                  margin-right: 0
                }
              }
            }
          }
          &:last-child {
            margin-bottom: 0
          }
        };
        .destination-box-department {
          width: 100%;
          height: 60px;
          padding: 0 12px;
          box-sizing: border-box;
          border-bottom: 1px solid  @color-underline;
          > div {
            display: inline-block;
          };
          .destination-title {
            height: 59px;
            width: 30%;
            line-height: 59px;
            color: @color-text-left;
            box-sizing: border-box;
            vertical-align: top;
          };
          .destination-content {
            height: 60px;
            position: relative;
            width: 68%;
            overflow-x: hidden;
            .main {
              color: @color-text-right;
              position: absolute;
              left: 0;
              top: 10px;
              width: 100%;
              height: 40px !important;
              background: #f9f9f9;
              border: none;
              /deep/ .input {
                height: 40px !important;
                padding: 0 4px !important;
                box-sizing: border-box;
                border: none;
                input {
                  background: #f9f9f9;
                  overflow: auto;
                  font-size: 15px !important
                }
              };
              /deep/.text-blue {
                color: #969696 !important
              };
              /deep/ .text-green {
                color: #43c3f3 !important
              }
            }
          }
        };
        .tool-box {
          width: 100%;
          margin: 0 auto;
          padding: 10px;
          box-sizing: border-box;
          border-bottom: 1px solid  @color-underline;
          position: relative;
          > div {
            display: inline-block;
            vertical-align: middle;
          };
          .tool-title {
            width: 20%;
            color: @color-text-left
          };
          .tool-name {
            width: 78%;
            color: @color-text-right
          };
          .tool-sign {
            position: absolute;
            right: 6px;
            color: @color-text-right;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .transport-type-box {
          width: 100%;
          margin: 0 auto;
          max-height:320px;
          overflow: auto;
          padding: 10px;
          box-sizing: border-box;
          border-top: 12px solid #f6f6f6;
          border-bottom: 12px solid #f6f6f6;
          overflow: auto;
          display: flex;
          flex: 1;
          flex-direction: row;
          .transport-type-title-inner {
            color: @color-text-left;
            width: 20%;
            height: 35px;
            line-height: 35px
          }
          .transport-type-list {
            flex: 1;
            display: flex;
            font-size: 15px;
            color: @color-text-right;
            width: 100%;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            padding:0;
            box-sizing: border-box;
            overflow: auto;
            .spanStyle {
              background: #d6f4ff;
              color: #01a6ff;
              border: 1px solid #4cc5f2;
            }
            span {
              display: inline-block;
              width: 30%;
              height: 40px;
              text-align: center;
              line-height: 40px;
              background: #f9f9f9;
              margin-bottom: 4px;
              border-radius: 16px;
              overflow-x: auto;
            }
          }
        }
        .field-box {
          width: 100%;
          margin: 0 auto;
          padding: 10px;
          box-sizing: border-box;
          border-top: 6px solid #f6f6f6;
          border-bottom: 12px solid #f6f6f6;
          > p {
            display: inline-block;
            width: 49%;
            /deep/ .van-cell {
              padding: 10px 2px;
              .van-field__label {
                width: 70px;
                text-align: left;
                font-size: 14px;
                color:@color-text-left;
                margin-top: 6px
              }
              .van-field__value {
                border-bottom: 1px solid @color-underline;
                height: 30px;
                line-height: 30px;
                padding-left: 4px;
                font-size: 16px;
                color:@color-text-right;
              }
            }
          };
          .contact-isolation-box {
            width: 60%;
            line-height: 20px;
            display: flex;
            align-items: center;
            >p {
              font-size: 14px;
              display: inline-block;
              height: 100%;
              &:first-child {
                color: #7d7d7d;
                margin-right: 30px;
                line-height: 44px;
                vertical-align: top;
              };
              &:last-child {
                flex: 1;
                display: flex;
                align-items: center;
                /deep/ .van-radio-group {
                  .van-radio--horizontal {
                    &:nth-child(1) {
                      margin-right: 14px !important;
                      .van-radio__label {
                        color: #fdc050
                      }
                    };
                    &:nth-child(2) {
                      .van-radio__label {
                        color: #0ac30a
                      }
                    }
                  }
                }
              }
            }
          }  
        }
        .describle-box {
          width: 100%;
          border-bottom: 12px solid #f6f6f6;
          /deep/ .van-cell {
            padding: 10px 10px;
            .van-field__label {
              width: 80px;
              text-align: left;
              font-size: 14px;
              color: @color-text-left;
              margin-top: 6px
            }
            .van-field__value {
              .van-field__body {
                height: 100px;
                padding-top: 6px;
                background: #f9f9f9;
                .van-field__control {
                  height: 100% !important;
                  background: #f9f9f9;
                  height: 80px;
                  color: @color-text-right;
                  font-size: 15px;
                  padding-left: 4px
                }
              }
            }
          }
        }
      }
    };
    .templateTwo {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
      overflow-x: hidden;
      .transport-type-area {
        width: 100%;
        flex:1;
        display: flex;
        flex-flow: column nowrap;
        overflow: auto;
        .destination-box {
          width: 100%;
          margin: 0 auto;
          padding: 12px;
          box-sizing: border-box;
          border-bottom: 12px solid #f6f6f6;
          > div {
            display: inline-block;
            vertical-align: middle;
          };
          .destination-title {
            width: 20%;
            color: @color-text-left
          }
          .destination-title-inner {
            width: 30%
          }
          .destination-content {
            width: 78%;
            position: relative;
            /deep/ .van-radio-group {
              justify-content: space-between;
              .van-radio--horizontal {
                margin-right: 0;
                &:nth-child(1) {
                  .van-radio__label {
                    color: #0ac30a
                  }
                }
                &:nth-child(2) {
                  .van-radio__label {
                    color: #fdc050
                  }
                }
                &:nth-child(3) {
                  .van-radio__label {
                    color: #ff4141
                  }
                }
                &:nth-child(4) {
                  .van-radio__label {
                    color: #cc0000
                  }
                }
              }
            }
          }
          .destination-content-inner {
            width: 68%;
            /deep/ .van-radio-group {
              justify-content: flex-start;
              .van-radio--horizontal {
                margin-right: 4%;
                &:last-child {
                  margin-right: 0
                }
              }
            }
          }
          &:last-child {
            margin-bottom: 0
          }
        };
        .destination-box-department {
          width: 100%;
          height: 60px;
          padding: 0 12px;
          box-sizing: border-box;
          border-bottom: 1px solid  @color-underline;
          > div {
            display: inline-block;
          };
          .destination-title {
            height: 59px;
            width: 30%;
            line-height: 59px;
            color: @color-text-left;
            box-sizing: border-box;
            vertical-align: top;
          };
          .destination-content {
            height: 60px;
            position: relative;
            width: 68%;
            overflow-x: hidden;
            .main {
              color: @color-text-right;
              position: absolute;
              left: 0;
              top: 10px;
              width: 100%;
              height: 40px !important;
              background: #f9f9f9;
              border: none;
              /deep/ .input {
                height: 40px !important;
                padding: 0 4px !important;
                border: none;
                box-sizing: border-box;
                input {
                  background: #f9f9f9;
                  overflow: auto;
                  font-size: 15px !important
                }
              };
              /deep/.text-blue {
                color: #969696 !important
              };
              /deep/ .text-green {
                color: #43c3f3 !important
              }
            }
          }
        };
        .destination-box-taskTotal {
          width: 100%;
          height: 72px;
          padding: 0 12px;
          box-sizing: border-box;
          .destination-title {
            height: 60px;
            width: 30%;
            line-height: 60px;
            color: @color-text-left;
            box-sizing: border-box
          };
          .destination-content {
            width: 68%;
            /deep/ .van-cell {
              height: 40px;
              padding: 0 4px;
              background: #f9f9f9;
              .van-cell__value {
                .van-field__body {
                  font-size: 18px;
                  height: 40px;
                  line-height: 40px;
                  .van-field__control:disabled {
                    color: @color-text-right !important;
                  }
                }
              }
            }
          }
        };
        .field-box-wrapper {
          width: 100%;
          margin: 0 auto;
          flex:1;
          overflow: auto;
          .field-box-two {
            width: 100%;
            margin: 0 auto;
            padding: 0 12px;
            box-sizing: border-box;
            span {

            };
            .field-title {
              position: relative;
              font-size: 18px;
              color: @color-text-right;
              height: 50px;
              font-weight: bold;
              .patient-name {
                position: absolute;
                top: 0;
                height: 50px;
                line-height: 50px;
                font-size: 16px;
                width: 100px;
                left: 4px;
                color: #000000
              };
              /deep/ .van-icon-delete {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 6px;
                color: #000000 !important;
                font-size: 20px !important
              };
              .van-icon-records  {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 50px;
                color: #000000 !important;
                font-size: 20px !important
              }
            };
            .field-wrapper {
              background: #f9f9f9;
              padding: 14px;
              border-radius: 4px;
              > div {
                > p {
                  display: inline-block;
                  /deep/ .van-cell {
                    padding: 2px 0;
                    height: 34px;
                    background: #f9f9f9;
                    .van-field__label {
                      width: 50px;
                      text-align: left;
                      height: 34px;
                      line-height: 34px;
                      font-size: 14px;
                      color: @color-text-left;
                    }
                    .van-field__value {
                      height: 34px;
                      line-height: 34px;
                      color: @color-text-right;
                      font-size: 16px;
                      .van-field__body {
                        .van-field__control:disabled {
                          color: @color-text-right !important;
                        }
                      }
                    }
                  }
                }
              };
              .field-one {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                > p {
                }
              };
              .field-two {
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                > p {
                  display: inline-block;
                  height: 36px;
                  line-height: 36px;
                  &:first-child {
                    color: @color-text-left;
                    text-align: left;
                  };
                  &:last-child {
                    /deep/ .van-cell {
                      padding: 2px 0;
                      height: 34px;
                      background: #f9f9f9;
                      .van-field__label {
                        width: 50px;
                        text-align: left;
                        height: 34px;
                        line-height: 34px;
                        font-size: 14px;
                        color: @color-text-left;
                      }
                      .van-field__value {
                        height: 34px;
                        line-height: 34px;
                        color: @color-text-right;
                        font-size: 16px;
                        .van-field__body {
                          .van-field__control:disabled {
                            color: @color-text-right !important;
                          }
                        }
                      }
                    }
                  }
                }
              };
              .field-three {
                .sample-box {
                  width: 100%;
                  height: 40px;
                  line-height: 40px;
                  display: flex;
                  flex-flow: row nowrap;
                  > p {
                    display: inline-block;
                    height: 100%;
                    &:first-child {
                      color: @color-text-left;
                      font-size: 15px;
                      margin-right: 4px;
                      vertical-align: top;
                    };
                    &:nth-child(2) {
                      vertical-align: top;
                      margin-right: 4px;
                      /deep/.van-dropdown-menu {
                        height: 100%;
                        .van-dropdown-menu__bar {
                          height: 100%;
                          box-shadow: none;
                          .van-dropdown-menu__item {
                            background: #f9f9f9;
                            .van-dropdown-menu__title {
                              color: @color-text-right;
                              font-size: 15px;
                              line-height: normal !important;
                              :after {
                                display: none
                              }
                            }
                          }
                        };
                        /deep/ .van-dropdown-item {
                          .van-popup {
                            .van-cell {
                              .van-cell__title {
                                font-size: 18px;
                              }
                            }
                          }
                        }
                      }
                    };
                    &:last-child {
                      height: 40px;
                      flex: 1;
                      overflow-y: auto;
                      > p {
                        &:first-child {
                          color: @color-text-right;
                          font-size: 15px;
                        };
                      }
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
                  >p {
                    font-size: 14px;
                    display: inline-block;
                    height: 100%;
                    &:first-child {
                      color: @color-text-left;
                      margin-right: 10px;
                      vertical-align: top;
                    };
                    &:last-child {
                      flex: 1;
                      /deep/ .van-radio-group {
                        .van-radio--horizontal {
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
              overflow: auto;
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
            };
          };
        };
        .tool-box {
          width: 100%;
          margin: 0 auto;
          padding: 12px;
          box-sizing: border-box;
          border-bottom: 1px solid  @color-underline;
          position: relative;
          > div {
            display: inline-block;
            vertical-align: middle;
          };
          .tool-title {
            width: 20%;
            color: @color-text-left
          };
          .tool-name {
            width: 78%;
            color: @color-text-right
          };
          .tool-sign {
            position: absolute;
            right: 6px;
            color: @color-text-right;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .transport-type-box {
          width: 96%;
          margin: 0 auto;
          max-height:320px;
          overflow: auto;
          padding: 10px;
          box-sizing: border-box;
          margin-bottom: 8px;
          border: 1px solid #b2b2b2;
          .transport-type-title-inner {

          }
          .transport-type-list {
            padding: 6px;
            margin-top: 10px;
            .spanStyle {
              color: #fff;
              background: #2895ea
            }
            span {
              display: inline-block;
              width: 45%;
              height: 40px;
              text-align: center;
              margin-bottom: 8px;
              line-height: 40px;
              background: #f3f3f3;
              margin-right: 10%;
              &:nth-child(even) {
                margin-right: 0
              }
            }
          }
        }
        .add-message {
          width: 96%;
          height: 41px;
          line-height: 41px;
          margin-top: 8px;
          margin-bottom: 8px;
          margin-left: 2%;
          color: #43c3f3;
          text-align: center;
          border: 1px solid #44c3f3;
          border-radius: 20px;
          font-size: 16px;
          span {
            vertical-align: top;
            .van-icon {
              width: 20px;
              // vertical-align: -2px;
            }
          }
        };
        .describle-box {
          width: 100%;
          border-top: 12px solid #f6f6f6;
          border-bottom: 12px solid #f6f6f6;
          /deep/ .van-cell {
            padding: 10px 10px;
            .van-field__label {
              width: 80px;
              text-align: left;
              font-size: 14px;
              color: @color-text-left;
              margin-top: 6px
            }
            .van-field__value {
              .van-field__body {
                height: 60px;
                padding-top: 6px;
                background: #f9f9f9;
                .van-field__control {
                  height: 100% !important;
                  background: #f9f9f9;
                  height: 80px;
                  color: @color-text-right;
                  font-size: 15px;
                  padding-left: 4px
                }
              }
            }
          }
        }
      }
      .btn-area {
        width: 100%;
        box-sizing: border-box;
        padding: 0 20px;
        margin: 0 auto;
        height: 80px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        span {
          width: 47%;
          height: 60px;
          display: inline-block;
          font-size: 18px;
          text-align: center;
          line-height: 60px;
          &:first-child {
            border-radius: 4px;
            background-image: linear-gradient(to right, #37d5fc , #429bff);
            color: #fff
          };
          &:last-child {
            border-radius: 4px;
            background: #e8e8e8;
            border: none;
            color: #666666
          }
        }
      }
    }
  }
</style>
