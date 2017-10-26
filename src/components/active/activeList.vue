<template>
  <div class="active" v-loading.fullscreen.lock="fullscreenLoading">
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/activeList' }">活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="inputs">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="活动名称">
          <el-input v-model="search.title" placeholder="活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select v-model="search.status" placeholder="活动区域">
            <el-option label="全部" value=""></el-option>
            <el-option label="未开始" value="1"></el-option>
            <el-option label="即将开始" value="2"></el-option>
            <el-option label="进行中" value="3"></el-option>
             <el-option label="已结束" value="4"></el-option>
            <el-option label="已失效" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchGoods">查询</el-button>
        </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="newVisible = true">新增活动</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="tableData.dataList" border style="width: 100%" v-loading="loading">
        <el-table-column  type="index" width="50">
      </el-table-column>
      <el-table-column  prop="title" label="活动名称" width="100" show-overflow-tooltip>
        <template scope="scope">
          <el-button type="text" size="small" @click="getAttrShow(scope.row)">
            {{scope.row.title}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="活动状态" :formatter="judge" width="90">
      </el-table-column>
      <el-table-column prop="grade" label="活动等级" :formatter="grades" width="90">
      </el-table-column>
      <el-table-column prop="beginTime" label="开始时间" width="160">
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="160">
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间" width="160">
      </el-table-column>
      <el-table-column prop="description" label="备注" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="170">
        <template scope="scope">
          <el-button type="text" size="small" v-if="scope.row.status != 3 && scope.row.status != 4 && scope.row.status != 5" @click="goodsSet(scope.row)">商品设置</el-button>
          <el-button @click="handleEdit(scope.row)" v-if="scope.row.status != 3 && scope.row.status != 4 && scope.row.status != 5" type="text" size="small">编辑</el-button>
          <el-button type="text" style="color:#ff4949" size="small" @click="delRow(scope.row)" v-if="scope.row.status == 5">删除</el-button>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- //活动列表下一页  -->
    <el-pagination @current-change="handleCurrentChange" :page-size="20" layout="prev, pager, next, jumper" :page-count="tableData.totalPage">
    </el-pagination>
    <!-- 活动设置弹出层 -->
    <el-dialog title="活动商品" :visible.sync="goodsSetVisible">
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
          <el-pagination @current-change="goodsChange" :page-size="5" layout="prev, pager, next, jumper" :page-count="goodsList.totalPage">
          </el-pagination>
        </el-col>
      </el-row>
      <!-- 商品属性设置 -->
      <el-table class="goodSet" empty-text="请增加商品" ref="multipleTable" :data="goodaAttrList" border style="width: 100%;margin-top:10px">

        <el-table-column prop="skuName" label="商品属性">
        </el-table-column>
        <el-table-column prop="num" label="库存数量">
        </el-table-column>
        <el-table-column prop="price" label="活动价">
          <template scope="scope">
            <el-input v-model="scope.row.price " placeholder="活动价" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量">
          <template scope="scope">
            <el-input v-model="scope.row.quantity" placeholder="数量" size="small"></el-input>
          </template>
        </el-table-column>
      </el-table>

      <!-- //以增加商品 -->
        <el-table :data="attrShow2" border style="width: 100%">
        <el-table-column prop="productName" label="商品名称">
        </el-table-column>
        <el-table-column prop="attributes" label="属性">
        </el-table-column>
        <el-table-column prop="price" label="活动价">
        </el-table-column>
        <el-table-column prop="quantity" label="数量">
        </el-table-column>
        <el-table-column prop="sellQuantity" label="销售数量">
        </el-table-column>
         <el-table-column fixed="right" label="操作" >
             <template scope="scope">
              <el-button type="text" size="small" @click="skuEdit(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="skuDels(scope.row)">删除</el-button>
  
            </template>
        </el-table-column>
      </el-table>
        
     
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendGoodsAttr">提交</el-button>
      </div>
    </el-dialog>

    <!-- 编辑弹出层 -->
    <el-dialog title="活动编辑" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <el-date-picker v-model="form.beginTime" type="datetime" placeholder="选择日期时间" @change="(value) => editBeginTime(value)">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" :label-width="formLabelWidth">
          <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择日期时间" @change="(value) => editEndTime(value)">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动等级" :label-width="formLabelWidth">
          <el-select v-model="form.grade" placeholder="选择活动等级">
            <el-option label="普通" :value="1"></el-option>
            <el-option label="白金" :value="2"></el-option>
            <el-option label="蓝金" :value="3"></el-option>
            <el-option label="白钻" :value="4"></el-option>
            <el-option label="蓝钻" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>

      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEdit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 属性展示弹出 -->

    <el-dialog title="活动详情" :visible.sync="attrShowVisible">
      <el-form>
        <el-form-item label="活动名称：" :label-width="formLabelWidth">
          <span>{{attrShow1.title}}</span>
        </el-form-item>
        <el-form-item label="活动状态：" :label-width="formLabelWidth">
            <span v-if="attrShow1.status == 1">未开始 </span>
            <span v-if="attrShow1.status == 2">即将开始 </span>
            <span v-if="attrShow1.status == 3">进行中 </span>
            <span v-if="attrShow1.status == 4">已结束 </span>
            <span v-if="attrShow1.status ==5">已失效 </span>
        </el-form-item>
        <el-form-item label="开始时间：" :label-width="formLabelWidth">
           <span>{{attrShow1.beginTime}}</span>
        </el-form-item>
        <el-form-item label="结束时间：" :label-width="formLabelWidth">
           <span>{{attrShow1.endTime}}</span>
          
        
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth">
           <span>{{attrShow1.description}}</span>
         
        </el-form-item>
      </el-form>
      <el-table :data="attrShow2" border style="width: 100%">
        <el-table-column prop="productName" label="商品名称">
        </el-table-column>
        <el-table-column prop="attributes" label="属性">
        </el-table-column>
        <el-table-column prop="price" label="活动价">
        </el-table-column>
        <el-table-column prop="quantity" label="数量">
        </el-table-column>
        <el-table-column prop="sellQuantity" label="销售数量">
        </el-table-column>
       
      </el-table>
      
    </el-dialog>



      <!-- sku价格编辑-->

    <el-dialog title="编辑价格" :visible.sync="skuEditShowVisible">
      <el-form>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input disabled v-model="skuList.productName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动价" :label-width="formLabelWidth">
          <el-input  v-model="skuList.price" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input  v-model="skuList.quantity" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
     
      <div slot="footer" class="dialog-footer">
          <el-button @click="skuEditSend">确定</el-button>
        <el-button @click="skuEditShowVisible = false">取 消</el-button>
      
      </div>
    </el-dialog>


    <!-- 新增活动 -->
    <el-dialog title="新增活动" :visible.sync="newVisible">
      <el-form :model="newEdit">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="newEdit.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" :label-width="formLabelWidth">
          <el-date-picker v-model="newEdit.beginTime" type="datetime" placeholder="选择日期时间" @change="(value) => newBeginTime(value)" >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" :label-width="formLabelWidth" >
          <el-date-picker v-model="newEdit.endTime" type="datetime" placeholder="选择日期时间"  @change="(value) => newEndTime(value)">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动等级" :label-width="formLabelWidth">
          <el-select v-model="newEdit.grade" placeholder="选择活动等级">
            <el-option label="普通" value="1"></el-option>
            <el-option label="白金" value="2"></el-option>
            <el-option label="蓝金" value="3"></el-option>
             <el-option label="白钻" value="4"></el-option>
            <el-option label="蓝钻" value="5"></el-option>
            
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="newEdit.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newVisible = false">取 消</el-button>
        <el-button type="primary" @click="newEdits">确 定</el-button>
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
      newVisible: false,
      dialogFormVisible: false,
      attrShowVisible: false,
      goodsSetVisible: false,
      skuEditShowVisible: false,
      formLabelWidth: "120px",
      goodsList: [],
      goodsEditData: [],
      tableData: [],
      goodaAttrList: [],
      attrShow1: [],
      attrShow2: [],
      search: {
        pageIndex: 0,
        pageSize: 20,
        status: "",
        title: ""
      },
      goodsSearch: {
        pageIndex: 0,
        pageSize: 5,
        categoryId: ""
      },
      form: {},
      input: "",
      newEdit: {
        title: "",
        beginTime: "",
        endTime: "",
        description: "",
        grade: ""
      },
      multipleSelection: [],
      treeList: [],
      rowDataList: {},
      skuList: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    newBeginTime(value) {
      this.newEdit.beginTime = value;
    },
    newEndTime(value) {
      this.newEdit.endTime = value;
    },
    editBeginTime(value) {
      this.form.beginTime = value;
    },
    editEndTime(value) {
      this.form.endTime = value;
    },

    judge(data) {
      //taxStatus 布尔值
      switch (data.status) {
        case 1:
          return "未开始";
          break;
        case 2:
          return "即将开始";
          break;
        case 3:
          return "进行中";
          break;
        case 4:
          return "已结束 ";
          break;
        case 5:
          return "已失效";
          break;
      }
      // 活动等级
    },
    grades(data) {
      switch (data.grade) {
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
    //获取商品属性展示列表
    getAttrShow(row) {
      this.rowDataList = row;
      this.getDelsAttr();
      this.attrShowVisible = true;
    },
    getDelsAttr() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindActivityInfoByActivityId",
        data: {
          activityId: that.rowDataList.id
        }
      }).then(function(res) {
        that.attrShow1 = JSON.parse(res.data).data.activity;
        that.attrShow2 = JSON.parse(res.data).data.activityGoods;
      });
    },
    //获取活动列表
    getList() {
      this.loading = true;
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindByActivityNamePaged",
        data: that.search
      }).then(function(res) {
        that.loading = false;
        that.tableData = JSON.parse(res.data);
      });
    },
    //商品设置
    goodsSet(row) {
      this.goodaAttrList = [];
      // this.goodsList = [];
      this.goodsSetVisible = true;
      this.goodsEditData = row;
      this.rowDataList = row;
      this.getDelsAttr();
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientProductCategoryTreeData"
      }).then(function(res) {
        that.treeList = JSON.parse(res.data);
      });
    },
    //树节点点击
    treeClick(data) {
      this.goodsSearch.categoryId = data.id;
      if (data.isLeaf == 1) {
        this.getgoodsList();
        this.goodaAttrList = [];
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
    // 获取商品属性列表
    getGoodsAttr(row) {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindSkuListByProductId",
        data: {
          productId: row.productId
        }
      }).then(function(res) {
        // that.goodsList = JSON.parse(res.data)
        let goodaAttrList = res.data.data;
        for (let i = 0; i < goodaAttrList.length; i++) {
          goodaAttrList[i].num =
            goodaAttrList[i].productQuantity -
            goodaAttrList[i].productSaleQuantity;
        }
        that.goodaAttrList = goodaAttrList;
        console.log(goodaAttrList);
      });
    },
    // 设置商品属性
    sendGoodsAttr() {
      let isN = false;
      for (let i = 0; i < this.goodaAttrList.length; i++) {
        if (
          this.goodaAttrList[i].quantity == null ||
          this.goodaAttrList[i].price == null
        ) {
          isN = true;
          break;
        }
      }

      if (isN) {
        this.$message({
          showClose: true,
          message: "价格和数量不能为空",
          type: "error"
        });
      } else {
        let arr = [];
        for (let i = 0; i < this.goodaAttrList.length; i++) {
          arr[i] = {
            price: this.goodaAttrList[i].price,
            skuId: this.goodaAttrList[i].skuId,
            quantity: this.goodaAttrList[i].quantity,
            activityId: this.goodsEditData.id
          };
        }

        var that = this;
        this.$http({
          method: "post",
          url: url + "/clientAddActivityGoods",
          data: {
            array: arr
          }
        }).then(function(res) {
          if (res.data.apiStatus == 1) {
            that.goodsSetVisible = false;
            that.$message({
              message: res.data.msg,
              type: "success"
            });
            for (let i = 0; i < that.goodaAttrList.length; i++) {
              that.goodaAttrList[i].quantity = null;
              that.goodaAttrList[i].price = null;
            }
          } else {
            that.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          }
        });
      }
    },
    //搜索商品
    searchGoods() {
      this.getList();
    },
    //新增商品
    newEdits() {
      let that = this;
      this.fullscreenLoading = true;
      this.$http({
        method: "post",
        url: url + "/clientAddOrEditActivity",
        data: that.newEdit
      }).then(function(res) {
        that.fullscreenLoading = false;
        if (res.data.apiStatus == 1) {
          that.$message({
            message: res.data.msg,
            type: "success"
          });
          that.newVisible = false;
          that.getList();
          that.newEdit = {
            title: "",
            beginTime: "",
            endTime: "",
            description: ""
          };
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //编辑商品
    addEdit() {
      let that = this;
      this.fullscreenLoading = true;
      this.$http({
        method: "post",
        url: url + "/clientAddOrEditActivity",
        data: that.form
      }).then(function(res) {
        that.fullscreenLoading = false;
        if (res.data.apiStatus == 1) {
          that.$message({
            message: res.data.msg,
            type: "success"
          });
          that.dialogFormVisible = false;
          that.getList();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    handleEdit(row) {
      this.dialogFormVisible = true;
      var _item = {};
      for (var i in row) {
        _item[i] = row[i];
      }

      this.form = _item;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    // 活动下一页
    handleCurrentChange(val) {
      this.search.pageIndex = val - 1;
      this.getList();
    },
    //商品下一页
    goodsChange() {
      this.goodsSearch.pageIndex = val - 1;
      this.getgoodsList();
    },
    //删除
    skuDels(row) {
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
              url: url + "/clientDeleteActivityGoods",
              data: {
                id: row.id
              }
            })
            .then(function(res) {
              console.log(res);
              if (res.data.apiStatus == 1) {
                that.getDelsAttr();
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
    delRow(row) {
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
              url: url + "/clientDeleteActivity",
              data: {
                activityId: row.id
              }
            })
            .then(function(res) {
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
    skuEdit(row) {
      this.skuEditShowVisible = true;

      var _item = {};
      for (var i in row) {
        _item[i] = row[i];
      }
      this.skuList = _item;
    },
    //商品活动确定编辑
    skuEditSend() {
      let that = this;
      that
        .$http({
          method: "post",
          url: url + "/clientEditActivityGoods",
          data: that.skuList
        })
        .then(function(res) {
          if (res.data.apiStatus == 1) {
            that.getDelsAttr();
            that.skuEditShowVisible = false;
            that.$message({
              message: res.data.msg,
              type: "success"
            });
          } else {
            that.$message.error(res.data.msg);
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-table th > .cell {
  text-align: center;
}
</style>


<style lang="scss">
.active {
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
  .goodSet {
    .el-input__inner {
      width: 90px;
    }
  }
}
</style>



