<template>
  <div class="exchange" v-loading.fullscreen.lock="fullscreenLoading">
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/' }">营销管理</el-breadcrumb-item>
      <el-breadcrumb-item>优惠券兑换</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="inputs">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="券名">
          <el-input v-model="search.couponName" placeholder="请输入"></el-input>
        </el-form-item>
         <el-form-item label="客户姓名">
          <el-input v-model="search.customerName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="券类型">
            <el-select v-model="search.couponStatus" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="未使用" value="1"></el-option>
                <el-option label="已使用" value="2"></el-option>
                <el-option label="已过期" value="3"></el-option>
               
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchgoods">查询</el-button>
        </el-form-item>
        
      </el-form>
    </div>

    <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="tableData.dataList" border style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="couponName" label="券名" width="140">
        <template scope="scope">
            <el-button type="text" size="small" @click="showDataFun(scope.row)">
                {{scope.row.couponName}}
            </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="客户姓名" width="100" show-overflow-tooltip>
      </el-table-column>
   
   
      <el-table-column prop="couponStatus" label="券使用状态" :formatter="couponStatus"  width="160">
      </el-table-column>
      <el-table-column prop="changeTime" label="兑换时间">
      </el-table-column>
      

      <el-table-column  label="操作" width="120">
        <template scope="scope">
     
          <el-button type="text" style="color:#FF4949" v-if="scope.row.couponStatus == 2 || scope.row.couponStatus == 3" size="small" @click="del(scope.row)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleCurrentChange" :page-size="20" layout="prev, pager, next, jumper" :page-count="tableData.totalPage">
    </el-pagination>
 


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
                  <el-form-item label="开始时间">
                    <span>{{showData.validTimeStart}}</span>
                </el-form-item>
                  <el-form-item label="结束时间">
                    <span>{{showData.validTimeEnd}}</span>
                </el-form-item>
                  <el-form-item  v-if="showData.couponType == 1" label="服务券类型">
                    <span v-if="showData.serviceCouponType==1" >普洗券</span>
                    <span v-if="showData.serviceCouponType==2" >精洗券</span>
                    <span v-if="showData.serviceCouponType==3" >单面喷漆券</span>
                 
                </el-form-item>
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
                <el-form-item label="使用状态">
                    <span v-if="showData.couponStatus == 3">已过期</span>
                    <span v-if="showData.couponStatus == 2">已使用</span>
                    <span v-if="showData.couponStatus == 1">未使用</span>
                 
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
      dialogVisible: false,
      dialogFormVisible: false,
      newVisible: false,
      showVisible: false,
      formLabelWidth: "120px",

      newEdit: {},
      newList: [],
      search: {
        pageIndex: 0,
        pageSize: 20,
        couponName: "",
        customerName: "",
        couponStatus: ""
      },
      tableData: [],
      multipleSelection: [],
      showData: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    couponStatus(data) {
      switch (data.couponStatus) {
        case 1:
          return "未使用";
          break;
        case 2:
          return "已使用";
          break;
        case 3:
          return "已过期";
          break;
      }
    },
    getList() {
      this.loading = true;
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindCouponExchangeRecordList",
        data: that.search
      }).then(function(res) {
        that.loading = false;
        that.tableData = res.data.data;
        console.log(res);
      });
    },
    getNewList() {
      this.newVisible = true;
      this.productGetAllRootCategoryList();
    },
    // 获取分类列表
    productGetAllRootCategoryList() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/productGetAllRootCategoryList"
      }).then(function(res) {
        that.newList = JSON.parse(res.data).data;
      });
    },
    handleCurrentChange(val) {
      this.search.pageIndex = val - 1;
      this.getList();
    },
    //查询
    searchgoods() {
      this.getList();
    },

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
              url: url + "/clientDeleteCouponExchangeRecord",
              data: {
                couponId: row.couponId
              }
            })
            .then(function(res) {
              that.fullscreenLoading = false;

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

    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(this.multipleSelection)
    },
    showDataFun(row) {
      this.showVisible = true;
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindCouponExchangeDetailByCouponId",
        data: {
          couponId: row.couponId
        }
      }).then(function(res) {
        that.showData = res.data.data;
        console.log(that.showData);
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">
.exchange {
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



