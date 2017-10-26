<template>
    <div class="coupon" v-loading.fullscreen.lock="fullscreenLoading">
        <el-breadcrumb separator="/" style="margin-bottom:10px">
            <el-breadcrumb-item :to="{ path: '/' }"> 营销管理</el-breadcrumb-item>
            <el-breadcrumb-item>优惠券管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <div class="inputs">
            <el-row>
               <el-col :span="24">
            <el-form :inline="true" :model="search" class="demo-form-inline">
                <el-form-item label="券名称">
                    <el-input v-model="search.couponName" placeholder="请输入"></el-input>
                </el-form-item>
                  <el-form-item label="券类型">
                  <el-select v-model="search.couponType" placeholder="全部">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="服务券" value="1"></el-option>
                      <el-option label="兑换券" value="2"></el-option>
                      <el-option label="抵扣券" value="3"></el-option>
                      <el-option label="折扣券" value="4"></el-option>
                  </el-select>
                </el-form-item>
                 <el-form-item label="开始时间">
                    <el-date-picker v-model="search.startDateOne" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="-">
                    <el-date-picker v-model="search.startDateTwo" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchgoods">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="warning" @click="newEditShow">新增券</el-button>
                </el-form-item>
            </el-form>
            </el-col>
              </el-row>
               
        </div>
        <!-- 列表 -->
        <el-table ref="multipleTable" :data="tableData.dataList" border style="width: 100%" v-loading="loading" >
        <el-table-column  type="index" width="50" >
            </el-table-column >    
            <el-table-column  prop="couponName" label="券名" width="140" show-overflow-tooltip>
                <template scope="scope">
                    <el-button type="text" size="small" @click="showDataFun(scope.row)">
                        {{scope.row.couponName}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column  prop="couponType" label="券类型" width="100" :formatter="couponType">
            </el-table-column>
           
            <el-table-column prop="changeGrade" label="换购级别" width="100" :formatter="changeGrade">
            </el-table-column>
            <el-table-column prop="changeIntegral" label="换购积分" width="90">
            </el-table-column>
            <el-table-column prop="couponQuantity" label="券数量" width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="couponQuantityGet" label="领取数量" width="120" :formatter="couponQuantityGet">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="160">
            </el-table-column>
            <el-table-column prop="validTimeStart"  label="开始时间" >
            </el-table-column>
            <el-table-column prop="validTimeEnd"  label="结束时间" >
            </el-table-column>
            
            <el-table-column fixed="right" label="操作" width="180">
                <template scope="scope">
                    <el-button @click="goodsSetShow(scope.row)" v-if="scope.row.couponType != 3" type="text" size="small">商品设置</el-button>
                    <el-button @click="editShow(scope.row)"  type="text" size="small">编辑</el-button>
                    <el-button @click="del(scope.row)" style="color:#FF4949" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @current-change="handleCurrentChange" :page-size="20" layout="prev, pager, next, jumper" :page-count="tableData.totalPage">
        </el-pagination>


        <!-- 新增 -->
        <el-dialog title="新增券" :visible.sync="newCouponVisible">
            <el-form>
              <el-form-item label="券名称" :label-width="formLabelWidth">
                <el-input v-model="newEdit.couponName" auto-complete="off"></el-input>
              </el-form-item>
               <el-form-item label="券类型" :label-width="formLabelWidth">
                  <el-select v-model="newEdit.couponType" placeholder="">
                      <el-option label="服务券" :value="1"></el-option>
                      <el-option label="兑换券" :value="2"></el-option>
                      <el-option label="抵扣券" :value="3"></el-option>
                      <el-option label="折扣券" :value="4"></el-option>
                  </el-select>
                </el-form-item>
                  <!-- <el-form-item v-if="newEdit.couponType == 1" label="服务券类型" :label-width="formLabelWidth">
                  <el-select v-model="newEdit.serviceCouponType" placeholder="">
                      <el-option label="普洗券" :value="1"></el-option>
                      <el-option label="精洗券" :value="2"></el-option>
                      <el-option label="单面喷漆券" :value="3"></el-option>
                  </el-select>
                </el-form-item> -->
             
              <el-form-item  v-if="newEdit.couponType == 3" label="面值" :label-width="formLabelWidth">
                <el-input v-model="newEdit.faceValue" auto-complete="off"></el-input>
              
              </el-form-item>
               <el-form-item  v-if="newEdit.couponType == 4" label="折扣值" :label-width="formLabelWidth">
                <el-input v-model="newEdit.discount" auto-complete="off"></el-input>
             
              </el-form-item>

              <el-form-item label="换购级别" :label-width="formLabelWidth">
                <el-select v-model="newEdit.changeGrade" placeholder="">
                    <el-option label="普通" :value="1"></el-option>
                    <el-option label="白金" :value="2"></el-option>
                    <el-option label="蓝金" :value="3"></el-option>
                    <el-option label="白钻" :value="4"></el-option>
                    <el-option label="蓝钻" :value="5"></el-option>
                </el-select>
              </el-form-item>
               
                
               
              
              <el-form-item label="换购积分" :label-width="formLabelWidth">
                <el-input v-model="newEdit.changeIntegral" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="数量" :label-width="formLabelWidth">
                <el-input v-model="newEdit.couponQuantity" auto-complete="off"></el-input>
              </el-form-item>
            
              <el-form-item label="开始时间" :label-width="formLabelWidth">
                <el-date-picker v-model="newEdit.validTimeStart" type="datetime" placeholder="选择日期时间" @change="(value) => newBeginTime(value)" >
                </el-date-picker>
              </el-form-item>

              <el-form-item label="结束时间" :label-width="formLabelWidth">
                <el-date-picker v-model="newEdit.validTimeEnd" type="datetime" placeholder="选择日期时间"  @change="(value) => newEndTime(value)">
                </el-date-picker>
              </el-form-item>
               <el-form-item label="券说明" :label-width="formLabelWidth">
                <el-input v-model="newEdit.couponExplain" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input v-model="newEdit.description" auto-complete="off"></el-input>
              </el-form-item>
              
              <el-row>
                <el-col :span="12">
                  <el-form-item label="大图" :label-width="formLabelWidth">
                    <el-upload class="avatar-uploader" :action="url+'/imageUpload'" :data="datas" name="file" :show-file-list="false" :on-success="uploadSussBig">
                      <img v-if="imageUrl.big" :src="imageUrl.big" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="小图" :label-width="formLabelWidth">
                    <el-upload class="avatar-uploader" :action="url+'/imageUpload'" :data="datas" name="file" :show-file-list="false" :on-success="uploadSussSml">
                      <img v-if="imageUrl.sml" :src="imageUrl.sml" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
              
             
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="newCouponVisible = false">取 消</el-button>
              <el-button type="primary" @click="sendNewAdd">确 定</el-button>
            </div>
    </el-dialog>

    <!-- //编辑 -->
        <el-dialog title="编辑券" :visible.sync="editCouponVisible">
            <el-form>
               <el-form-item label="券名称" :label-width="formLabelWidth">
                <el-input v-model="form.couponName" auto-complete="off"></el-input>
              </el-form-item>
               <el-form-item label="券类型" :label-width="formLabelWidth">
                  <el-select v-model="form.couponType" placeholder="">
                      <el-option label="服务券" :value="1"></el-option>
                      <el-option label="兑换券" :value="2"></el-option>
                      <el-option label="抵扣券" :value="3"></el-option>
                      <el-option label="折扣券" :value="4"></el-option>
                  </el-select>
                </el-form-item> 
                  <!-- <el-form-item v-if="form.couponType == 1" label="服务券类型" :label-width="formLabelWidth">
                  <el-select v-model="form.serviceCouponType" placeholder="">
                      <el-option label="普洗券" :value="1"></el-option>
                      <el-option label="精洗券" :value="2"></el-option>
                      <el-option label="单面喷漆券" :value="3"></el-option>
                  </el-select>
                </el-form-item>  -->
              <el-form-item  v-if="form.couponType == 3" label="面值" :label-width="formLabelWidth">
                <el-input v-model="form.faceValue" auto-complete="off"></el-input>
              
              </el-form-item>

               <el-form-item  v-if="form.couponType == 4" label="折扣值" :label-width="formLabelWidth">
                <el-input v-model="form.discount" auto-complete="off"></el-input>
             
              </el-form-item>

              <el-form-item label="换购级别" :label-width="formLabelWidth">
                <el-select v-model="form.changeGrade" placeholder="">
                    <el-option label="普通" :value="1"></el-option>
                    <el-option label="白金" :value="2"></el-option>
                    <el-option label="蓝金" :value="3"></el-option>
                    <el-option label="白钻" :value="4"></el-option>
                    <el-option label="蓝钻" :value="5"></el-option>
                </el-select>
              </el-form-item>
               
                
               
              
              <el-form-item label="换购积分" :label-width="formLabelWidth">
                <el-input v-model="form.changeIntegral" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="数量" :label-width="formLabelWidth">
                <el-input v-model="form.couponQuantity" auto-complete="off"></el-input>
              </el-form-item>
            
              <el-form-item label="开始时间" :label-width="formLabelWidth">
                <el-date-picker v-model="form.validTimeStart" type="datetime" placeholder="选择日期时间" @change="(value) => editBeginTime(value)" >
                </el-date-picker>
              </el-form-item>

              <el-form-item label="结束时间" :label-width="formLabelWidth">
                <el-date-picker v-model="form.validTimeEnd" type="datetime" placeholder="选择日期时间"  @change="(value) => editEndTime(value)">
                </el-date-picker>
              </el-form-item>
               <el-form-item label="券说明" :label-width="formLabelWidth">
                <el-input v-model="form.couponExplain" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input v-model="form.description" auto-complete="off"></el-input>
              </el-form-item>
              
              <el-row>
                <el-col :span="12">
                  <el-form-item label="大图" :label-width="formLabelWidth">
                    <el-upload class="avatar-uploader" :action="url+'/imageUpload'" :data="datas" name="file" :show-file-list="false" :on-success="edituploadSussBig">
                      <img v-if="imageUrl.big" :src="imageUrl.big" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="小图" :label-width="formLabelWidth">
                    <el-upload class="avatar-uploader" :action="url+'/imageUpload'" :data="datas" name="file" :show-file-list="false" :on-success="edituploadSussSml">
                      <img v-if="imageUrl.sml" :src="imageUrl.sml" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
              
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editCouponVisible = false">取 消</el-button>
              <el-button type="primary" @click="sendEditAdd">确 定</el-button>
            </div>
    </el-dialog>

    <!-- //商品设置弹出框 -->
    <el-dialog title="活动商品选择" :visible.sync="goodsSetVisible">
      <el-row>
        <el-col :span="6">
          <!-- //树节点 -->
          <el-tree class="filter-tree" accordion disabled highlight-current @node-click="treeClick" :data="treeList">
          </el-tree>
        </el-col>
        <el-col :span="18" style="padding:0 5px">
          <el-table ref="multipleTable" :data="goodsList.dataList" border style="width: 100%" >
              <el-table-column  label="选择" width="50">
                <template scope="scope">
                    <el-radio class="radio"  :change="goodsSelect(goodsSet.productId)" v-model="goodsSet.productId" :label="scope.row.productId"></el-radio>  
                </template>
            </el-table-column>
            <el-table-column prop="productName" label="商品名称">
            </el-table-column>
            <el-table-column prop="brandName" label="品牌">
            </el-table-column>
            <el-table-column prop="productPrice" label="价格">
            </el-table-column>
            <!-- <el-table-column fixed="right" label="操作" width="100">
              <template scope="scope">
                <el-button type="primary" size="small" @click="getGoodsAttr(scope.row)">选择</el-button>
              </template>
            </el-table-column> -->
          </el-table>
          <!-- //商品下一页  -->
          <el-pagination @current-change="goodsChange" :page-size="5" layout="prev, pager, next, jumper" :page-count="goodsList.totalPage">
          </el-pagination>
        </el-col>
      </el-row>
      <!-- 商品属性设置 -->
      <el-table v-if="isShowSku != 4"  class="goodSet" empty-text="请增加商品" ref="multipleTable" :data="goodaAttrList" border style="width: 100%;margin-top:10px">
        
        <el-table-column  label="选择" width="50">
          <template scope="scope">
              <el-radio class="radio" v-model="goodsSet.skuId" :label="scope.row.skuId"></el-radio>
          </template>
          </el-table-column>
        <el-table-column prop="skuName" label="sku名称">
        </el-table-column>
        <el-table-column prop="attributes" label="商品属性">
        </el-table-column>
        <el-table-column prop="productPrice" label="活动价">
         
        </el-table-column>
        
      </el-table>

     
      <div slot="footer" class="dialog-footer">
        <el-button @click="goodsSetVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendGoodsSet">确定</el-button>
      </div>
    </el-dialog>


        <!-- 详情显示 -->
        
        <el-dialog title="券详情" :visible.sync="showVisible">

            <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="券名">
                    <span>{{showData.couponName}}</span>
                </el-form-item>
                <el-form-item label="券类型">
                    <span v-if="showData.couponType == 1">服务券 </span>
                    <span v-if="showData.couponType == 2">兑换券  </span>
                    <span v-if="showData.couponType == 3">抵扣券 </span>
                    <span v-if="showData.couponType == 4">折扣券 </span>
                </el-form-item>
               
                <el-form-item label="券数量">
                    <span>{{showData.couponQuantity}}</span>
                </el-form-item>
                <el-form-item label="领取数量">
                    <span v-if="showData.couponQuantityGet">{{showData.couponQuantityGet}}</span>
                    <span v-else>0</span>
                </el-form-item>
                  
                  <el-form-item label="开始时间">
                    <span>{{showData.validTimeStart}}</span>
                </el-form-item>
                  <el-form-item label="结束时间">
                    <span>{{showData.validTimeEnd}}</span>
                </el-form-item>
                  <!-- <el-form-item  v-if="showData.couponType == 1" label="服务券类型">
                    <span v-if="showData.serviceCouponType==1" >普洗券</span>
                    <span v-if="showData.serviceCouponType==2" >精洗券</span>
                    <span v-if="showData.serviceCouponType==3" >单面喷漆券</span>
                 
                </el-form-item> -->
                  <el-form-item label="换购级别 ">
                    <span v-if="showData.changeGrade == 1">普通 </span>
                    <span v-if="showData.changeGrade == 2">白金 </span>
                    <span v-if="showData.changeGrade == 3">蓝金 </span>
                    <span v-if="showData.changeGrade == 4">白钻 </span>
                    <span v-if="showData.changeGrade == 5">蓝钻 </span>
                </el-form-item>
                  <el-form-item label="换购积分">
                    <span>{{showData.changeIntegral}}</span>
                </el-form-item>
                <el-form-item label="状态">
                    <span>{{showData.status}}</span>
                </el-form-item>
                <el-form-item v-if="showData.couponType == 2" label="兑换商品">
                    <span>{{showData.skuName}}</span>
                </el-form-item>
                <el-form-item v-if="showData.couponType == 4" label="折扣">
                    <span>{{showData.discount}}</span>
                </el-form-item>
               
                 <el-form-item v-if="showData.couponType == 3" label="面值">
                    <span>{{showData.faceValue}}</span>
                </el-form-item>


                 
               <div class="allList">
                  <el-row>
                    <el-col :span="24">
                       <el-form-item style="width:100%" v-if="showData.couponType == 4" label="折扣商品">
                    <span>{{showData.productName}}</span>
                  </el-form-item>
                  </el-col>
                </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="券说明" style="width:100%">
                      <span>{{showData.couponExplain}}</span>
                      </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                      <el-form-item label="备注">
                        <span>{{showData.description}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
               </div>
                  
                <el-row>
                  <el-col :span="12">
                      <el-form-item label="大图">
                      <img :src="imageUrl.big" class="avatar">  
                      </el-form-item>
                    
                  </el-col>
                  <el-col :span="12">
                      <el-form-item label="小图">
                      <img :src="imageUrl.sml" class="avatar">  
                      </el-form-item>
                    
                  </el-col>
                </el-row>
                                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showVisible = false">取 消</el-button>
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
      newCouponVisible: false,
      editCouponVisible: false,
      goodsSetVisible: false,
      showVisible: false,
      newEdit: {
        couponName: "",
        faceValue: "",
        changeGrade: "",
        changeIntegral: "",
        couponQuantity: "",
        validTimeStart: "",
        validTimeStart: "",
        validTimeEnd: "",
        couponExplain: "",
        couponType: "",
        serviceCouponType: "",
        description: ""
      },
      formLabelWidth: "120px",
      form: {},
      goodsList: {},
      goodaAttrList: [],
      search: {
        pageIndex: 0,
        pageSize: 20,
        couponName: "",
        startDateOne: "",
        startDateTwo: "",
        couponType: ""
      },
      goodsSearch: {
        pageIndex: 0,
        pageSize: 5,
        categoryId: ""
      },
      treeList: [],

      tableData: [],
      goodsSet: {
        skuId: "",
        productId: "",
        crId: ""
      },
      url: "",
      datas: {
        fileType: 5
      },
      imageUrl: {
        big: "",
        sml: ""
      },
      showData: {},
      isShowSku: ""
    };
  },
  created() {
    this.url = url;
    this.getList();
  },
  methods: {
    newBeginTime(value) {
      this.newEdit.validTimeStart = value;
    },
    newEndTime(value) {
      this.newEdit.validTimeEnd = value;
    },
    editBeginTime(value) {
      this.form.validTimeStart = value;
    },
    editEndTime(value) {
      this.form.validTimeEnd = value;
    },

    //券类型
    couponType(data) {
      switch (data.couponType) {
        case 1:
          return "服务券";
          break;
        case 2:
          return "兑换券";
          break;
        case 3:
          return "抵扣券";
          break;
        case 4:
          return "折扣券";
          break;
      }
    },
    //换购级别
    changeGrade(data) {
      switch (data.changeGrade) {
        case 1:
          return "普通";
          break;
        case 2:
          return "白金";
          break;
        case 3:
          return "蓝金";
          break;
        case 4:
          return "白钻";
          break;
        case 5:
          return "蓝钻";
          break;
      }
    },
    //领取数量
    couponQuantityGet(data) {
      if (data.couponQuantityGet == null) {
        return 0;
      } else {
        return data.couponQuantityGet;
      }
    },
    getList() {
      this.loading = true;
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindCouponListPaged",
        data: that.search
      }).then(function(res) {
        that.loading = false;
        let datas = JSON.parse(res.data);
        that.tableData = datas;
        console.log(datas);
      });
    },
    //新怎大图上传成功
    uploadSussBig(response, file, fileList) {
      this.imageUrl.big = URL.createObjectURL(file.raw);
      this.newEdit.picBig = response.data;
    },
    //新增上传小图
    uploadSussSml(response, file, fileList) {
      this.imageUrl.sml = URL.createObjectURL(file.raw);
      this.newEdit.picSmall = response.data;
    },
    //编辑大图上传成功
    edituploadSussBig(response, file, fileList) {
      this.imageUrl.big = URL.createObjectURL(file.raw);
      this.from.picBig = response.data;
    },
    //编辑上传小图
    edituploadSussSml(response, file, fileList) {
      this.imageUrl.sml = URL.createObjectURL(file.raw);
      this.from.picSmall = response.data;
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
    //新增显示
    newEditShow() {
      this.newCouponVisible = true;
    },
    //新增确定
    sendNewAdd() {
      let that = this;
      if (this.newEdit.couponType != 1) {
        this.newEdit.serviceCouponType = "";
      }
      this.$http({
        method: "post",
        url: url + "/clientAddOrEditCoupon",
        data: this.newEdit
      }).then(function(res) {
        let datas = JSON.parse(res.data);
        if (datas.apiStatus == 1) {
          that.newCouponVisible = false;
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
    //编辑
    editShow(row) {
      this.editCouponVisible = true;
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindCouponDetail",
        data: {
          crId: row.crId
        }
      }).then(function(res) {
        let datas = JSON.parse(res.data).data;

        that.imageUrl = {
          big: url + "/" + datas.picBig,
          sml: url + "/" + datas.picSmall
        };

        that.form = datas;
        console.log(that.form);
      });
    },
    //编辑确定
    sendEditAdd() {
      let that = this;
      if (this.form.couponType != 1) {
        this.form.serviceCouponType = "";
      }
      this.$http({
        method: "post",
        url: url + "/clientAddOrEditCoupon",
        data: this.form
      }).then(function(res) {
        let datas = JSON.parse(res.data);
        if (datas.apiStatus == 1) {
          that.editCouponVisible = false;
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

    // 商品设置弹出
    goodsSetShow(row) {
      let that = this;
      this.goodsSetVisible = true;
      this.goodsSet.crId = row.crId;
      this.goodsSet.skuId = "";
      this.goodsSet.productId = "";

      this.goodsSearch = {
        pageIndex: 0,
        pageSize: 5,
        categoryId: ""
      };
      this.goodsList = {};

      this.goodaAttrList = [];
      this.isShowSku = row.couponType;
      let type = 0;
      if (row.couponType == 1) {
        type = 1;
      } else if (row.couponType == 2) {
        type = 2;
      }
      this.$http({
        method: "post",
        url: url + "/clientProductCategoryTreeDataByType",
        data: {
          type: type
        }
      }).then(function(res) {
        that.treeList = JSON.parse(res.data);
      });
    },
    //树节点点击
    treeClick(data) {
      this.goodsSearch.categoryId = data.id;

      if (data.isLeaf == 1) {
        this.getgoodsList();
      }
    },
    //获取商品列表
    getgoodsList() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindProductListPaged",
        data: this.goodsSearch
      }).then(function(res) {
        that.goodsList = JSON.parse(res.data);
      });
    },
    //选择商品
    goodsSelect(val) {
      if (val != "") {
        let that = this;
        this.$http({
          method: "post",
          url: url + "/clientFindSkuListByProductId",
          data: {
            productId: val
          }
        }).then(function(res) {
          // that.goodsList = JSON.parse(res.data)
          let goodaAttrList = res.data.data;
          that.goodaAttrList = goodaAttrList;
        });
      }
    },

    // 获取商品属性列表
    // getGoodsAttr(row) {
    //   let that = this;
    //   this.goodsSet.productId = row.productId;
    //   this.$http({
    //     method: "post",
    //     url: url + "/clientFindSkuListByProductId",
    //     data: {
    //       productId: row.productId
    //     }
    //   }).then(function(res) {
    //     // that.goodsList = JSON.parse(res.data)
    //     let goodaAttrList = res.data.data;

    //     that.goodaAttrList = goodaAttrList;
    //   });
    // },
    //商品设置确定
    sendGoodsSet() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientAddOrEditCoupon",
        data: this.goodsSet
      }).then(function(res) {
        let datas = JSON.parse(res.data);
        if (datas.apiStatus == 1) {
          that.goodsSetVisible = false;
          that.$message({
            message: datas.msg,
            type: "success"
          });
        } else {
          that.$message.error(datas.msg);
        }
      });
    },
    //商品下一页
    goodsChange(val) {
      this.goodsSearch.pageIndex = val - 1;
      this.getgoodsList();
    },
    del(row) {
      let that = this;
      this.$confirm("是否删除继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that
            .$http({
              method: "post",
              url: url + "/clientDeleteCoupon",
              data: {
                crId: row.crId
              }
            })
            .then(function(res) {
              let datas = JSON.parse(res.data);
              if (datas.apiStatus == 1) {
                that.getList();
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
    showDataFun(row) {
      let that = this;
      this.showVisible = true;
      this.$http({
        method: "post",
        url: url + "/clientFindCouponDetail",
        data: {
          crId: row.crId
        }
      }).then(function(res) {
        let datas = JSON.parse(res.data).data;
        that.showData = datas;
        console.log(datas);
        that.imageUrl = {
          big: url + "/" + datas.picBig,
          sml: url + "/" + datas.picSmall
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">
.coupon {
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
  .lists {
    .el-form-item {
      text-align: center;
      margin-right: 0;
      margin-bottom: 0;
      width: 100%;
    }
  }
  .attrdata .el-input__inner {
    width: 100px;
  }
  .el-table .cell {
    text-align: center;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
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
  .allList {
    .el-form-item__content {
      width: 70%;
    }
  }

  .el-table th > .cell {
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
  .el-input__inner {
    width: 300px;
  }
}
</style>



