<template>
  <div class="memberList" v-loading.fullscreen.lock="fullscreenLoading">
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/' }"> 会员管理</el-breadcrumb-item>
      <el-breadcrumb-item>会员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <div class="inputs">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="会员姓名">
          <el-input v-model="search.realname" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="会员昵称">
          <el-input v-model="search.nickname" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="会员状态">
          <el-select v-model="search.status" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="1"></el-option>
            <el-option label="失效" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchgoods">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="newEdits">新增会员</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <el-table ref="multipleTable" :data="tableData.dataList" border style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="realname" label="会员名称" width="150" show-overflow-tooltip>
        <template scope="scope">
          <el-button type="text" size="small" @click="showDel(scope.row)">
            {{scope.row.realname}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="会员昵称" width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="mobile" label="联系电话" width="130">
      </el-table-column>
      <el-table-column prop="gender" :formatter="gender" label="性别" width="90">
      </el-table-column>
      <el-table-column prop="simpleSpelling" label="简拼" width="160">
      </el-table-column>
      <el-table-column prop="recommendCode" label="推荐人" width="160">
      </el-table-column>
      <el-table-column prop="IntegralAccount" label="积分账户" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="description" label="备注" min-width="120" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="270">
        <template scope="scope">
          <el-button type="text" size="small" @click="dataEidt(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="carList(scope.row)">车辆管理</el-button>
          <el-button type="text" size="small">修改密码</el-button>
          <el-button type="text" size="small">无效</el-button>
          <el-button type="text" size="small">有效</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleCurrentChange" :page-size="20" layout="prev, pager, next, jumper" :page-count="tableData.totalPage">
    </el-pagination>



    <!-- 新增会员 -->
    <el-dialog title="新增会员" :visible.sync="newVisible" class="Edit">
      <el-form :model="newEdit">
        <el-form-item label="真实姓名" :label-width="formLabelWidth">
          <el-input v-model="newEdit.realname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" :label-width="formLabelWidth">
          <el-input v-model="newEdit.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="newEdit.nickname" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="头像" :label-width="formLabelWidth">
          <el-upload class="avatar-uploader" :action="url+'/imageUpload'" name="file" :data="datas" :show-file-list="false" :on-success="uploadSuss">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="简拼" :label-width="formLabelWidth">
          <el-input v-model="newEdit.simpleSpelling" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <template>
            <el-radio-group v-model="newEdit.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="生日" :label-width="formLabelWidth">

          <el-date-picker v-model="newEdit.birthday" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="newEdit.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件" :label-width="formLabelWidth">
          <el-input v-model="newEdit.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="QQ号" :label-width="formLabelWidth">
          <el-input v-model="newEdit.qq" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信号" :label-width="formLabelWidth">
          <el-input v-model="newEdit.wechat" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="推荐人" :label-width="formLabelWidth">
          <el-input v-model="newEdit.recommendCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="newEdit.description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="积分账户" :label-width="formLabelWidth">
          <el-input v-model="newEdit.integralAccount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付密码" :label-width="formLabelWidth">
          <el-input v-model="newEdit.paymentPassword" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendNewAdd">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 编辑会员 -->
    <el-dialog title="编辑会员" :visible.sync="editVisible" class="Edit">
      <el-form :model="form" >
        <el-form-item label="真实姓名" :label-width="formLabelWidth">
          <el-input v-model="form.realname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.nickname" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="头像" :label-width="formLabelWidth">
          <el-upload class="avatar-uploader" :action="url+'/imageUpload'" name="file" :data="datas" :show-file-list="false" :on-success="uploadSussEdit">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="简拼" :label-width="formLabelWidth">
          <el-input v-model="form.simpleSpelling" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <template>
            <el-radio-group v-model="form.gender">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="生日" :label-width="formLabelWidth">

          <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件" :label-width="formLabelWidth">
          <el-input v-model="form.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="QQ号" :label-width="formLabelWidth">
          <el-input v-model="form.qq" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信号" :label-width="formLabelWidth">
          <el-input v-model="form.wechat" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="推荐人" :label-width="formLabelWidth">
          <el-input v-model="form.recommendCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="form.description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="积分账户" :label-width="formLabelWidth">
          <el-input v-model="form.integralAccount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付密码" :label-width="formLabelWidth">
          <el-input v-model="form.paymentPassword" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendEdit">确 定</el-button>
      </div>
    </el-dialog>

    <!--会员详情 -->
    <el-dialog title="会员详情" :visible.sync="showVisible">
      <el-form label-position="left" inline class="demo-table-expand">
        <el-form-item label="会员名称" :label-width="formLabelWidth">
          <span>{{detailList.realname}}</span>
        </el-form-item>
        <el-form-item label="会员昵称" :label-width="formLabelWidth">
          <span>{{detailList.nickname}}</span>
        </el-form-item>
        <el-form-item label="简拼" :label-width="formLabelWidth">
          <span>{{detailList.simpleSpelling}}</span>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <span v-if="detailList.gender == 1">男</span>
          <span v-if="detailList.gender == 2">女</span>
        </el-form-item>
        <el-form-item label="积分账户" :label-width="formLabelWidth">
          <span>{{detailList.IntegralAccount}}</span>
        </el-form-item>
        <el-form-item label="生日" :label-width="formLabelWidth">
          <span>{{detailList.birthday}}</span>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <span>{{detailList.mobile}}</span>
        </el-form-item>
        <el-form-item label="电子邮箱" :label-width="formLabelWidth">
          <span>{{detailList.email}}</span>
        </el-form-item>
        <el-form-item label="QQ号" :label-width="formLabelWidth">
          <span>{{detailList.qq}}</span>
        </el-form-item>
        <el-form-item label="微信号" :label-width="formLabelWidth">
          <span>{{detailList.wechat}}</span>
        </el-form-item>
        <el-form-item label="应许多用户同时登录" :label-width="formLabelWidth">
          <span>{{detailList.checkOnline}}</span>
        </el-form-item>
        <el-form-item label="第一次访问时间" :label-width="formLabelWidth">
          <span>{{detailList.firstVisit}}</span>
        </el-form-item>
        <el-form-item label="上一次访问时间" :label-width="formLabelWidth">
          <span>{{detailList.previousVisit}}</span>
        </el-form-item>
        <el-form-item label="最后访问时间" :label-width="formLabelWidth">
          <span>{{detailList.lastVisit}}</span>
        </el-form-item>
        <el-form-item label="推荐人" :label-width="formLabelWidth">
          <span>{{detailList.recommendCode}}</span>
        </el-form-item>
        <el-form-item label="删除标记" :label-width="formLabelWidth">
          <span>{{detailList.deleteMark}}</span>
        </el-form-item>
        <el-form-item label="有效标记" :label-width="formLabelWidth">
          <span>{{detailList.enabledMark}}</span>
        </el-form-item>

        <el-form-item label="创建日期" :label-width="formLabelWidth">
          <span>{{detailList.createDate}}</span>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" style="width: 100%">
              <span>{{detailList.description}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showVisible = false">取 消</el-button>
      </div>
    </el-dialog>


    <!--carList弹出 -->
    <el-dialog class="Edit" title="车辆" :visible.sync="carListVisible">

      <el-form>
        <el-form-item>
          <el-button type="warning" @click="carNewShow">新增车辆</el-button>
        </el-form-item>
        <!-- car列表 -->
        <el-table ref="multipleTable" :data="carData" border style="width: 100%" v-loading="loading">
          <el-table-column type="index" width="51">
          </el-table-column>
          <el-table-column prop="carNo" label="车牌号" width="150" show-overflow-tooltip>
            <template scope="scope">
              <el-button type="text" size="small" @click="showCarDels(scope.row)">
                {{scope.row.carNo}}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="groupName" label="集团" width="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="carBrandName" label="车辆品牌" width="130">
          </el-table-column>

          <el-table-column prop="account" label="账户余额" width="160">
          </el-table-column>
          <el-table-column prop="isDefault" label="默认车辆" width="160">
          </el-table-column>
          <el-table-column prop="carVin" label="车架号" min-width="100" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="benefitName" label="账户等级" min-width="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="createDate" label="创建日期" min-width="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="270">
            <template scope="scope">
              <!--<el-button type="text" size="small" @click="carNewShow(scope.row)">新增</el-button>-->
              <el-button type="text" size="small" @click="carEditShow(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="delCar(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="carListVisible = false">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 新增车辆 -->
    <el-dialog title="新增会员" :visible.sync="newCarVisible" class="Edit">
      <el-form :model="carNewData">
        <el-form-item label="车牌号码" :label-width="formLabelWidth">
          <el-input v-model="carNewData.carNo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序码" :label-width="formLabelWidth">
          <el-input v-model="carNewData.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="车型信息" :label-width="formLabelWidth">
          <el-input v-model="carNewData.carTypeInfo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否默认车辆" :label-width="formLabelWidth">
          <template>
            <el-radio-group v-model="carNewData.isDefault ">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="是否虚拟车辆" :label-width="formLabelWidth">
          <template>
            <el-radio-group v-model="carNewData.isVirtual ">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="车架号" :label-width="formLabelWidth">
          <el-input v-model="carNewData.carVin" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="接送次数" :label-width="formLabelWidth">
          <el-input v-model="carNewData.giveCount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="救援次数" :label-width="formLabelWidth">
          <el-input v-model="carNewData.helpCount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="充值总额" :label-width="formLabelWidth">
          <el-input v-model="carNewData.accountRechargeTotal" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="carNewData.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newCarVisible = false">取 消</el-button>
        <el-button type="primary" @click="carSend">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑车辆 -->
    <el-dialog title="新增会员" :visible.sync="editCarVisible" class="Edit">
      <el-form :model="editFrom">
        <el-form-item label="车牌号码" :label-width="formLabelWidth">
          <el-input v-model="editFrom.carNo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序码" :label-width="formLabelWidth">
          <el-input v-model="editFrom.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="车型信息" :label-width="formLabelWidth">
          <el-input v-model="editFrom.carTypeInfo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否默认车辆" :label-width="formLabelWidth">
          <template>
            <el-radio-group v-model="editFrom.isDefault ">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="是否虚拟车辆" :label-width="formLabelWidth">
          <template>
            <el-radio-group v-model="editFrom.isVirtual ">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="车架号" :label-width="formLabelWidth">
          <el-input v-model="editFrom.carVin" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="接送次数" :label-width="formLabelWidth">
          <el-input v-model="editFrom.giveCount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="救援次数" :label-width="formLabelWidth">
          <el-input v-model="editFrom.helpCount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="充值总额" :label-width="formLabelWidth">
          <el-input v-model="editFrom.accountRechargeTotal" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="editFrom.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editCarVisible = false">取 消</el-button>
        <el-button type="primary" @click="carEditSend">确 定</el-button>
      </div>
    </el-dialog>



    <!--车详情 -->
    <el-dialog title="车辆详情" :visible.sync="showChrVisible">
      <el-form label-position="left" inline class="demo-table-expand">
        <el-form-item label="车牌号" :label-width="formLabelWidth">
          <span>{{showCardel.carNo}}</span>
        </el-form-item>
        <el-form-item label="集团名称" :label-width="formLabelWidth">
          <span>{{showCardel.groupName}}</span>
        </el-form-item>
        <el-form-item label="车辆品牌名称" :label-width="formLabelWidth">
          <span>{{showCardel.carBrandName}}</span>
        </el-form-item>
        <el-form-item label="是否默认车辆" :label-width="formLabelWidth">
          <span v-if="showCardel.isDefault == true">是</span>
          <span v-if="showCardel.isDefault == false">不是</span>
        </el-form-item>
        <el-form-item label="是否虚拟车辆" :label-width="formLabelWidth">
          <span v-if="showCardel.isVirtual == true">是</span>
          <span v-if="showCardel.isVirtual == false">不是</span>
        </el-form-item>
        <el-form-item label="车型信息" :label-width="formLabelWidth">
          <span>{{showCardel.carTypeInfo}}</span>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <span>{{showCardel.sort}}</span>
        </el-form-item>
        <el-form-item label="账户" :label-width="formLabelWidth">
          <span>{{showCardel.account}}</span>
        </el-form-item>
        <el-form-item label="等级名称" :label-width="formLabelWidth">
          <span>{{showCardel.email}}</span>
        </el-form-item>
        <el-form-item label="接送次数" :label-width="formLabelWidth">
          <span>{{showCardel.qq}}</span>
        </el-form-item>
        <el-form-item label="救援次数" :label-width="formLabelWidth">
          <span>{{showCardel.wechat}}</span>
        </el-form-item>
        <el-form-item label="创建日期" :label-width="formLabelWidth">
          <span>{{showCardel.checkOnline}}</span>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showChrVisible = false">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: true,
        fullscreenLoading: false,
        dialogVisible: false,
        showVisible: false,
        newVisible: false,
        editVisible:false,
        carListVisible:false,
        newCarVisible:false,
        editCarVisible:false,
        showChrVisible:false,
        formLabelWidth: "120px",

        form: {},
        editFrom:{},
        value: "",
        search: {
          pageIndex: 0,
          pageSize: 20,
          realname: "",
          nickname: "",
          status: ""
        },
        tableData: [],
        showData: {},
        showUer: {},
        goodsList: [],
        detailList: {},
        carData:[],
        carNewData:{
          carNo:'',
          sort:'',
          carTypeInfo:'',
          isDefault :'',
          isVirtual:'',
          description:'',
          carVin:'',
          giveCount:'',
          helpCount:'',
          accountRechargeTotal:''
        },
        newEdit: {
          password: '',
          realname: '',
          nickname: '',
          headicon: '',
          simpleSpelling: '',
          gender: 1,
          birthday: '',
          mobile: '',
          email: '',
          qq: '',
          wechat: '',
          checkOnline: '',
          recommendCode: '',
          description: '',
          integralAccount: '',
          paymentPassword: ''
        },
        datas: {
          fileType: 2
        },
        imageUrl: '',
        url: '',
        customerId:'',
        showCardel:{

        }
      };
    },
    created() {
      this.url = url
      this.getList();
    },
    methods: {
      gender(data) {
        //taxStatus 布尔值
        switch (data.gender) {
          case 1:
            return "男";
            break;
          case 2:
            return "女";
            break;

        }
      },
      getList() {
        this.loading = true;
        let that = this;
        this.$http({
          method: "post",
          url: url + "/clientFindCustomerListAndPaged",
          data: that.search
        }).then(function (res) {
          that.loading = false;
          that.tableData = JSON.parse(res.data);
        });
      },
      //点击分页
      handleCurrentChange(val) {
        this.search.pageIndex = val - 1;
        this.getList();
      },
      //查询
      searchgoods() {
        this.getList();
      },
      //删除
      delGoods(row) {
        let that = this;
        this.$confirm("是否删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          that.$http({
            method: "post",
            url: url + "/clientDeleteReservationOrder",
            data: {
              roId: row.roId
            }
          }).then(function (res) {
            if (res.data.apiStatus == 1) {
              that.getList();
              that.$message({
                message: res.data.msg,
                type: "success"
              });
            } else {
              that.$message.error(res.data.msg);
            }
          });
        })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      //新增会员
      newEdits() {
        this.newVisible = true
      },
      //确定新增
      sendNewAdd() {
        let that = this
        this.$http({
          method: "post",
          url: url + "/clientAddOrEditCustomer",
          data: that.newEdit
        }).then(function (res) {
          let datas = JSON.parse(res.data)
          if (datas.apiStatus == 1) {
            that.newVisible = false
            that.getList();
            that.$message({
              message: datas.msg,
              type: "success"
            });
          } else {
            that.$message.error(datas.msg);
          }

        });
      },
      //编辑弹出
      dataEidt(row){
        this.editVisible = true
        let that = this
        this.$http({
          method: "post",
          url: url + "/clientFindCustomerDetail",
          data: {
            cId:row.cId
          }
        }).then(function (res) {
          let datas = JSON.parse(res.data).data
          that.form = datas
          that.imageUrl = url +'/'+ datas.headicon
        });
      },
      //确定编辑

      sendEdit() {
        let that = this
        this.$http({
          method: "post",
          url: url + "/clientAddOrEditCustomer",
          data: that.form
        }).then(function (res) {
          let datas = JSON.parse(res.data)
          if (datas.apiStatus == 1) {
            that.editVisible = false
            that.getList();
            that.$message({
              message: datas.msg,
              type: "success"
            });
          } else {
            that.$message.error(datas.msg);
          }

        });
      },
      //上传成功
      uploadSuss(response, file, fileList) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.newEdit.headicon = response.data;
        console.log(this.newEdit.headicon)
      },
      uploadSussEdit(response, file, fileList) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.form.headicon = response.data;
      },
      //详情展示
      showDel(row) {
        this.showVisible = true
        let that = this
        this.$http({
          method: "post",
          url: url + "/clientFindCustomerDetail",
          data: {
            cId: row.cId
          }
        }).then(function (res) {
          let datas = JSON.parse(res.data).data
          that.detailList = datas
        });
      },
      //车辆列表展示
      carList(row){
        this.carData = []
        this.carNewData.customerId = row.cId
        this.customerId = row.cId
        this.getLists()
      },getLists(){
        let that = this;
        this.$http({
          method: "post",
          url: url + "/clientFindCustomerCarList",
          data: {
            customerId: this.customerId
          }
        }).then(function (res) {
          let datas = JSON.parse(res.data);
          that.carListVisible = true
          if(datas.apiStatus == 1){

            that.carData = datas.data
            console.log(that.carData)
          }else {
            that.$message.error(datas.msg);
          }
        });
      },
      //新增弹出
      carNewShow(row){
        this.newCarVisible = true
      },
      //新车确定增加
      carSend(row){
        let that = this
        this.$http({
          method: "post",
          url: url + "/clientAddOrEditCar",
          data: that.carNewData
        }).then(function (res) {
          let datas = JSON.parse(res.data)
          if (datas.apiStatus == 1) {
            that.newCarVisible = false
            that.getLists();
            that.$message({
              message: datas.msg,
              type: "success"
            });
          } else {
            that.$message.error(datas.msg);
          }
        });
      },
      //编辑弹出
      carEditShow(row){
        this.editCarVisible = true
        let that = this
        this.$http({
          method: "post",
          url: url + "/clientFindCarDetail",
          data: {
            carId:row.carId
          }
        }).then(function (res) {
          let datas = JSON.parse(res.data).data
          that.editFrom = datas
        });


//
//          console.log(_item)
      },
      //编辑确定
      carEditSend(){
        let that = this
        this.$http({
          method: "post",
          url: url + "/clientAddOrEditCar",
          data: that.editFrom
        }).then(function (res) {
          let datas = JSON.parse(res.data)
          if (datas.apiStatus == 1) {
            that.editCarVisible = false
            that.getLists();
            that.$message({
              message: datas.msg,
              type: "success"
            });
          } else {
            that.$message.error(datas.msg);
          }
        });
      },
      //删除
      delCar(row){
        let that = this;
        this.$confirm("此操作将永久车辆, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {

            that
              .$http({
                method: "post",
                url: url + "/clientDeleteCar",
                data: {
                  carId: row.carId
                }
              })
              .then(function(res) {
                let datas = JSON.parse(res.data)
                if (datas.apiStatus == 1) {

                  that.getLists();
                  that.$message({
                    message: datas.msg,
                    type: "success"
                  });
                } else {
                  that.$message.error(datas.msg);
                }
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      //车详情展示
      showCarDels(row){
        let that = this
        this.showChrVisible = true
        this.$http({
          method: "post",
          url: url + "/clientFindCarDetail",
          data: {
            carId:row.carId
          }
        }).then(function (res) {
          let datas = JSON.parse(res.data).data
          that.showCardel = datas
        });
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">
  .memberList {
    .demo-table-expand {
      font-size: 0;
    }

    .demo-table-expand label {
      width: 90px;
      color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hipositionTypeen;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #20a0ff;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-table .cell {
      text-align: center;
    }
    .inputs {
      height: 40px;
      width: 100%;
      text-align: left;
      padding-bottom: 5px;
      .el-input {
        height: 30px;
        width: 180px;
        display: inline-block;
        input {
          display: inline-block;
          width: 180px;
          height: 31px;
          vertical-align: middle;
        }
      }
    }
    .Edit {
      .el-input__inner {
        width: 200px;
      }
    }
  }
</style>



