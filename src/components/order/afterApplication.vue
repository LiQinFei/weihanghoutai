<template>
    <div class="goodsOrder" v-loading.fullscreen.lock="fullscreenLoading">
        <el-breadcrumb separator="/" style="margin-bottom:10px">
            <el-breadcrumb-item :to="{ path: '/' }"> 订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>售后申请</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <div class="inputs">
            <el-form :inline="true" :model="search" class="demo-form-inline">
                <el-form-item label="车牌号">
                    <el-input v-model="search.carNo" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="search.status" placeholder="全部">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="正在处理" value="1"></el-option>
                        <el-option label="已处理" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请时间 开始">
                    <el-date-picker v-model="search.startDate" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="申请时间 结束">
                    <el-date-picker v-model="search.endDate" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchgoods">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 列表 -->
        <el-table ref="multipleTable" :data="tableData.dataList" border style="width: 100%" v-loading="loading">
        <el-table-column  type="index" width="50">
            </el-table-column>    
            <el-table-column  prop="realName" label="申请人" width="150" show-overflow-tooltip>
            </el-table-column>

            <el-table-column prop="mobile" label="联系电话" width="130">
            </el-table-column>
            <el-table-column prop="skuName" label="商品名称" width="130" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="90">
            </el-table-column>
            <el-table-column prop="attributes" label="属性" width="160" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="mobile" label="联系电话" width="130">
            </el-table-column>
            <el-table-column prop="subTime" label="申请时间" width="160">
            </el-table-column>
            <el-table-column prop="subType" :formatter="subType" label="申请类型" width="90">
            </el-table-column>
            <el-table-column prop="status" :formatter="status" label="状态" width="120">
            </el-table-column>

            <el-table-column prop="description" label="备注"  min-width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template scope="scope">
                    <el-button @click="manageGoods(scope.row)" v-if="scope.row.status == 1" type="text" size="small">已处理</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @current-change="handleCurrentChange" :page-size="20" layout="prev, pager, next, jumper" :page-count="tableData.totalPage">
        </el-pagination>
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
      formLabelWidth: "120px",
      form: {},
      value: "",
      search: {
        pageIndex: 0,
        pageSize: 20,
        status: "",
        startDate: "",
        endDate: ""
      },
      tableData: [],
      showData: {},
      showUer: {},
      goodsList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //申请类型
    subType(data) {
      switch (data.subType) {
        case 1:
          return "退";
          break;
        case 2:
          return "换";
          break;
        case 3:
          return "维修";
          break;
      }
    },
    // 状态
    status(data) {
      switch (data.status) {
        case 1:
          return "正在处理";
          break;
        case 2:
          return "处理完成";
          break;
      }
    },

    getList() {
      this.loading = true;
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindApplyInfoList",
        data: that.search
      }).then(function(res) {
        that.loading = false;
        that.tableData = res.data.data;
        console.log(res.data.data);
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
    //处理申请
    manageGoods(row) {
      let that = this;
      this.$confirm("是否处理?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that
            .$http({
              method: "post",
              url: url + "/clientHandleApplyByApplyId",
              data: {
                applyId: row.applyId,
                conductBy: "0001"
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
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">
.goodsOrder {
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



