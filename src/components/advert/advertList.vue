<template>
  <div class="adPosition" v-loading.fullscreen.lock="fullscreenLoading">
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/' }"> 广告管理</el-breadcrumb-item>
      <el-breadcrumb-item>广告列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <div class="inputs">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="广告名称">
          <el-input v-model="search.adName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="广告状态">
          <el-select v-model="search.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="未开始" value="1"></el-option>
            <el-option label="进行中" value="2"></el-option>
            <el-option label="已结束" value="3"></el-option>
            <el-option label="已关闭" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="位置类型">
          <el-select v-model="search.positionType">
            <el-option label="全部" value=""></el-option>
            <el-option label="PC" value="1"></el-option>
            <el-option label="APP" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchgoods">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="newadver">新增广告</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表展示 -->
    <el-table ref="multipleTable" :data="tableData.dataList" border style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="adName" label="广告名称">
        <template scope="scope">
          <el-button type="text" size="small" @click="getAttrShow(scope.row)">
            {{scope.row.adName}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="positionName" label="广告位名称" min-width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="clickCount" label="广告点击数">
      </el-table-column>
      <el-table-column prop="positionType" label="位置类型" :formatter="judge">
      </el-table-column>
      <el-table-column prop="linkMan" label="联系人">
      </el-table-column>
      <el-table-column prop="status" label="状态" :formatter="judge2">
      </el-table-column>
      <el-table-column prop="beginTime" label="开始时间" width="170" >
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="170">
      </el-table-column>
     
      <el-table-column prop="createDate" label="创建日期" width="170">
      </el-table-column>

      <el-table-column prop="description" label="备注"  min-width="100" show-overflow-tooltip>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150">
        <template scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" v-if="scope.row.status == 1" size="small">编辑</el-button>
          <el-button type="text" size="small" v-if="scope.row.status == 3" @click="del(scope.row)">删除</el-button>
          <el-button type="text" size="small" v-if="scope.row.status == 2" @click="closeAd(scope.row)">关闭</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleCurrentChange" :page-size="20" layout="prev, pager, next, jumper" :page-count="tableData.totalPage">
    </el-pagination>
    <!-- 新建广告弹出层 -->
    <el-dialog class="Edit" title="新建广告" :visible.sync="newdialogFormVisible">
      <el-form>
        <el-form-item label="广告位名称:" :label-width="formLabelWidth">
          <el-select v-model="form.positionCode">
            <el-option v-for="(item,index) in adPoList" :key="index" :label="item.positionName" :value="item.positionCode">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="广告名称:" :label-width="formLabelWidth">
          <el-input v-model="form.adName" auto-complete="off"></el-input>
        </el-form-item>


        <el-row :gutter="20">
            <el-col :span="10">
                <el-form-item label="广告类型:" :label-width="formLabelWidth">
                  <el-select v-model="form.adType" @change="isGood"> 
                    <el-option label="链接广告" value="0"></el-option>
                    <el-option label="商品广告" value="1"></el-option>
                  </el-select>
              </el-form-item>
            </el-col>
          <el-col :span="10" v-if="form.adType == 1">
                <el-form-item label="广告商品:" :label-width="formLabelWidth">
                  <el-select v-model="form.objId">
                  <el-option v-for="(item,index) in goodsList.dataList" :key="index" :label="item.productName" :value="item.productId">
                  </el-option>
                  </el-select>
              </el-form-item>
          </el-col>
      </el-row>

        <el-form-item label="位置类型" :label-width="formLabelWidth">
          <el-select v-model="form.positionType">
            <el-option label="PC" :value="1"></el-option>
            <el-option label="APP" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="URL:" :label-width="formLabelWidth">
          <el-input v-model="form.adLink" auto-complete="off"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="联系人:" :label-width="formLabelWidth">
              <el-input v-model="form.linkMan" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="联系人电话:" :label-width="formLabelWidth">
              <el-input v-model="form.linkPhone" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="开始时间:" :label-width="formLabelWidth">
              <div class="block">
                <el-date-picker v-model="form.beginTime" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="结束时间:" :label-width="formLabelWidth">
              <div class="block">
                <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="上传图片" :label-width="formLabelWidth">
          <el-upload class="avatar-uploader" :action="url+'/imageUpload'" name="file" :data="datas" :show-file-list="false" :on-success="uploadSussEdit">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="备注:" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.description">
          </el-input>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="newSure">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑广告弹出层 -->
    <el-dialog class="Edit" title="新建广告" :visible.sync="EditVisible">
      <el-form>
        <el-form-item label="广告位名称:" :label-width="formLabelWidth">
          <el-select v-model="editData.positionCode">
            <el-option v-for="(item,index) in adPoList" :key="index" :label="item.positionName" :value="item.positionCode">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="广告名称:" :label-width="formLabelWidth" min-width="100" show-overflow-tooltip>
          <el-input v-model="editData.adName" auto-complete="off"></el-input>
        </el-form-item>


        <el-row :gutter="20">
            <el-col :span="10">
                <el-form-item label="广告类型:" :label-width="formLabelWidth">
                  <el-select v-model="editData.adType" @change="isGood" @visible-change="isUpdwon"> 
                    <el-option label="链接广告" :value="0"></el-option>
                    <el-option label="商品广告" :value="1"></el-option>
                  </el-select>
              </el-form-item>
            </el-col>
          <el-col :span="10" v-if="editData.adType == 1">
                <el-form-item label="广告商品:" :label-width="formLabelWidth">
                  <el-select v-model="editData.objId">
                  <el-option v-for="(item,index) in goodsList.dataList" :key="index" :label="item.productName" :value="item.productId">
                  </el-option>
                  </el-select>
              </el-form-item>
          </el-col>
      </el-row>


        <el-form-item label="位置类型" :label-width="formLabelWidth">
          <el-select v-model="editData.positionType">
            <el-option label="PC" :value="1"></el-option>
            <el-option label="APP" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="URL:" :label-width="formLabelWidth">
          <el-input v-model="editData.adLink" auto-complete="off"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="联系人:" :label-width="formLabelWidth">
              <el-input v-model="editData.linkMan" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="联系人电话:" :label-width="formLabelWidth">
              <el-input v-model="editData.linkPhone" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="开始时间:" :label-width="formLabelWidth">
              <div class="block">
                <el-date-picker v-model="editData.beginTime" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="结束时间:" :label-width="formLabelWidth">
              <div class="block">
                <el-date-picker v-model="editData.endTime" type="datetime" placeholder="选择日期时间">
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="上传图片" :label-width="formLabelWidth">
          <el-upload class="avatar-uploader" :action="url+'/imageUpload'" name="file" :data="datas" :show-file-list="false" :on-success="uploadSussEdit">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="备注:" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="editData.description">
          </el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EditVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditSure">确 定</el-button>
      </div>
    </el-dialog>

    <!-- //广告展示 -->
    <el-dialog title="广告详情" :visible.sync="attrShowVisible">
      <el-form label-position="left" inline class="demo-table-expand">
        <el-form-item label="广告位名称" :label-width="formLabelWidth">
          <span>{{adShow.positionName}}</span>
        </el-form-item>
        <el-form-item label="广告位位置类型" :label-width="formLabelWidth">
          <span v-if="adShow.positionType == 1">PC</span>
          <span v-else>APP</span>
        </el-form-item>
        <el-form-item label="广告位宽度" :label-width="formLabelWidth">
          <span>{{adShow.adWidth}}</span>
        </el-form-item>
        <el-form-item label="广告位高度" :label-width="formLabelWidth">
          <span>{{adShow.adHeight}}</span>
        </el-form-item>
        <el-form-item label="广告名称" :label-width="formLabelWidth">
          <span>{{adShow.adName}}</span>
        </el-form-item>
        <el-form-item label="广告类型" :label-width="formLabelWidth">
          <span v-if="adShow.adType == 0"> 链接广告</span>
          <span v-else> 商品广告</span>
        </el-form-item>
        <el-form-item label="连接地址" :label-width="formLabelWidth">
          <span>{{adShow.adLink}}</span>
        </el-form-item>
        <el-form-item label="广告联系人" :label-width="formLabelWidth">
          <span>{{adShow.linkMan}}</span>
        </el-form-item>
        <el-form-item label="广告联系人电话" :label-width="formLabelWidth">
          <span>{{adShow.linkPhone}}</span>
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <span>{{adShow.beginTime}}</span>
        </el-form-item>
        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <span>{{adShow.endTime}}</span>
        </el-form-item>

      </el-form>

      <el-form label-position="left" inline class="demo-table-expand" style="margin-bottom:20px;">
        <el-form-item label="图片" :label-width="formLabelWidth">

          <img :src="imageUrl" class="avatar">

        </el-form-item>
      </el-form>
      
       <el-table  v-if="adShow.adType != 0" :data="prIn" border style="width: 100%">
        <el-table-column prop="productName" label="产品名" width="180"> </el-table-column>
        <el-table-column  prop="productType" label="产品类型" :formatter="ProductDt"  width="180"> </el-table-column> 
        <el-table-column prop="productPrice" label="价格"></el-table-column>
        <el-table-column prop="productExplain" label="简介" min-width="100" show-overflow-tooltip></el-table-column>
      </el-table>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="attrShowVisible = false">取 消</el-button>
      </div>



    </el-dialog>



      <!-- 活动设置弹出层 -->
    <el-dialog title="商品编辑" :visible.sync="goodsSetVisible">
      <el-row>
        <el-col :span="6">
          <!-- //树节点 -->
          <el-tree class="filter-tree" accordion disabled highlight-current @node-click="treeClick" :data="treeList">
          </el-tree>
        </el-col>
        <el-col :span="18" style="padding:0 5px">
          <el-table ref="multipleTable" :data="goodsList.dataList" border style="width: 100%">
            <el-table-column prop="productName" label="商品名称">
            </el-table-column>
            <el-table-column prop="brandName" label="品牌">
            </el-table-column>
            <el-table-column prop="productPrice" label="价格">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template scope="scope">
                <el-button type="primary" size="small" @click="getGoodsAttr(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- //商品下一页  -->
          <el-pagination @current-change="goodsChange" :page-size="10" layout="prev, pager, next, jumper" :page-count="goodsList.totalPage">
          </el-pagination>
        </el-col>
      </el-row>
   
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
      dialogFormVisible: false,
      EditVisible: false,
      newVisible: false,
      newdialogFormVisible: false,
      beginTime: "",
      endTime: "",
      formLabelWidth: "120px",
      attrShowVisible: false,
      goodsSetVisible: false,
      form: {
        adName: "",
        adType: "",
        adLink: "",
        linkMan: "",
        linkPhone: "",
        beginTime: "",
        endTime: "",
        img: "",
        description: "",
        positionType: "",
        positionCode: "",
        objId: ""
      },
      value: "",
      newEdit: {},
      adPoList: [],
      delListAd: [],
      search: {
        pageIndex: 0,
        pageSize: 10,
        adName: "",
        status: "",
        positionType: ""
      },
      tableData: {},
      editData: {},
      datas: {
        fileType: 6
      },
      imageUrl: "",
      url: "",
      adShow: {},
      prIn: [],
      treeList: [],
      goodsSearch: {
        pageIndex: 0,
        pageSize: 10,
        categoryId: ""
      },
      goodsList: [],
      adType: ""
    };
  },
  created() {
    this.getList();
    this.allAdvertPositionInfo();
    this.url = url;
  },
  methods: {
    ProductDt(data) {
      switch (data.productType) {
        case 2:
          return "服务类";
          break;
        case 1:
          return "实体类";
          break;
      }
    },
    adDataPA(data) {
      switch (data.types) {
        case 2:
          return "APP";
          break;
        case 1:
          return "PC";
          break;
      }
    },
    judge(data) {
      //taxStatus 布尔值
      switch (data.positionType) {
        case 2:
          return "APP";
          break;
        case 1:
          return "PC";
          break;
        default:
          return "无";
      }
    },
    judge2(data) {
      //taxStatus 布尔值
      switch (data.status) {
        case 1:
          return "未开始";
          break;
        case 2:
          return "进行中";
          break;
        case 3:
          return "已结束";
          break;
        case 4:
          return "已关闭";
          break;
        default:
          return "无";
      }
    },
    getList() {
      this.loading = true;
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindAdvertListPaged",
        data: that.search
      }).then(function(res) {
        that.loading = false;
        that.tableData = JSON.parse(res.data);
      });
    },
    //点击新增弹出
    newadver() {
      this.newdialogFormVisible = true;
      // this.productGetAllRootCategoryList()

      this.imageUrl = "";
      // this.form = {
      //   adName: "",
      //   adType: "",
      //   adLink: "",
      //   linkMan: "",
      //   linkPhone: "",
      //   beginTime: "",
      //   endTime: "",
      //   img: "",
      //   description: "",
      //   positionType: "",
      //   positionCode: "",
      //   objId: ""
      // };
    },
    // 获取广告位列表
    allAdvertPositionInfo() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindAllAdvertPositionInfo"
      }).then(function(res) {
        that.adPoList = JSON.parse(res.data).data;
      });
    },
    //点击分页
    handleCurrentChange(val) {
      this.search.pageIndex = val - 1;
      this.getList();
    },
    //商品下一页
    goodsChange() {
      this.goodsSearch.pageIndex = val - 1;
      this.getgoodsList();
    },
    //查询
    searchgoods() {
      this.getList();
    },
    // 新增完成确定
    newSure() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientAddOrEditAdvert",
        data: that.form
      }).then(function(res) {
        if (res.data.apiStatus == 1) {
          that.newdialogFormVisible = false;
          that.getList();
          that.$message({
            message: res.data.msg,
            type: "success"
          });
        } else {
          that.$message.error(res.data.msg);
        }
        console.log(res);
      });
    },
    //删除
    del(row) {
      let that = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that.fullscreenLoading = true;
          that
            .$http({
              method: "post",
              url: url + "/clientDeleteAdvert",
              data: {
                id: row.id
              }
            })
            .then(function(res) {
              if (res.data.apiStatus == 1) {
                that.fullscreenLoading = false;
                that.getList();
                that.$message({
                  message: res.data.msg,
                  type: "success"
                });
              } else {
                that.$message.error(res.data.msg);
              }
              console.log(res);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //关闭
    closeAd(row) {
      let that = this;
      this.$confirm("是否关闭广告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that.fullscreenLoading = true;
          that
            .$http({
              method: "post",
              url: url + "/clientCloseAdvert",
              data: {
                id: row.id
              }
            })
            .then(function(res) {
              let datas = JSON.parse(res.data);
              if (datas.apiStatus == 1) {
                that.fullscreenLoading = false;
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
    //点击编辑按钮获取row参数
    handleEdit(row) {
      this.EditVisible = true;
      let that = this;
      that
        .$http({
          method: "post",
          url: url + "/clientFindAdvertInfoAndPositionList",
          data: {
            id: row.id
          }
        })
        .then(function(res) {
          let datas = JSON.parse(res.data).data.advertInfo;
          that.editData = datas;
          that.imageUrl = url + "/" + datas.img;
        });
    },
    // 编辑完成确认
    EditSure() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientAddOrEditAdvert",
        data: that.editData
      }).then(function(res) {
        if (res.data.apiStatus == 1) {
          that.EditVisible = false;
          that.getList();
          that.$message({
            message: res.data.msg,
            type: "success"
          });
        } else {
          that.$message.error(res.data.msg);
        }
      });
    },

    // 点击下拉框去请求详情

    uploadSussEdit(response, file, fileList) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.editData.img = response.data;
      console.log(this.form.img);
    },
    // 展示弹出
    getAttrShow(row) {
      this.attrShowVisible = true;
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindAdvertDetail",
        data: {
          id: row.id
        }
      }).then(function(res) {
        let adShows = JSON.parse(res.data);
        that.adShow = adShows.advertInfo;

        if (adShows.productInfo == undefined) {
          that.prIn = [];
        } else {
          that.prIn = [adShows.productInfo];
        }
        console.log(adShows);
        that.imageUrl = url + "/" + adShows.advertInfo.img;
      });
    },
    isGood(data) {
      this.adType = data;
    },
    isUpdwon(data) {
      if (data == false) {
        if (this.adType == 1) {
          let that = this;
          this.goodsSetVisible = true;
          this.$http({
            method: "post",
            url: url + "/clientProductCategoryTreeData"
          }).then(function(res) {
            that.treeList = JSON.parse(res.data);
          });
        }
      }
      console.log(data);
    },
    //树节点点击
    treeClick(data) {
      this.goodsSearch.categoryId = data.id;
      if (data.isLeaf == 1) {
        this.getgoodsList();
      } else {
        this.form.objId = "";
        this.editData.objId = "";
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
    getGoodsAttr(row) {
      this.goodsSetVisible = false;
      this.form.objId = row.productId;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">
.adPosition {
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
    papositiontypeing-bottom: 5px;
    .el-input {
      height: 30px;
      width: 180px;
      display: inline-block;
      input {
        display: inline-block;
        width: 180px;
        height: 31px;
        vertical-align: mipositionTypele;
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



