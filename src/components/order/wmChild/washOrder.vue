<template>
  <div class="washOrder" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="inputs">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="search" class="demo-form-inline">
            <el-form-item label="订单号">
              <el-input v-model="search.orderNo" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="search.status" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="待接车" value="1"></el-option>
                <el-option label="已接车" value="2"></el-option>
                <el-option label="待支付" value="3"></el-option>
                <el-option label="已支付" value="4"></el-option>
                <el-option label="洗车中" value="5"></el-option>
                <el-option label="客户确认" value="6"></el-option>
                <el-option label="已完成" value="7"></el-option>
                <el-option label="不同意" value="8"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支付状态">
              <el-select v-model="search.payStatus" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="未支付" value="0"></el-option>
                <el-option label="已支付" value="1"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="searchgoods">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <el-table ref="multipleTable" :data="tableData.dataList" border style="width: 100%" v-loading="loading">
       <el-table-column  type="index" width="50">
        </el-table-column>   
      <el-table-column  prop="washNo" label="洗车单号" min-width="170">
        <template scope="scope">
          <el-button type="text" size="small" @click="showDel(scope.row)">
            {{scope.row.washNo}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="realname" label="客户姓名" min-width="150">
      </el-table-column>

      <el-table-column prop="carNo" label="车牌号" min-width="150">
      </el-table-column>

      <el-table-column prop="status" :formatter="status" label="订单状态" min-width="100">
      </el-table-column>
      <el-table-column prop="payStatus" :formatter="payStatus" label="支付状态" min-width="100">
      </el-table-column>
      <el-table-column prop="receiveDate" label="接车时间" min-width="170">
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150">
        <template scope="scope">
          <el-button type="text" v-if="scope.row.status == 3" size="small" @click="lineUpShow(scope.row)">线下支付</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @current-change="handleCurrentChange" :page-size="20" layout="prev, pager, next, jumper" :page-count="tableData.totalPage">
    </el-pagination>

    <!-- 展示 -->
    <el-dialog title="订单详情" :visible.sync="showVisible">

      <el-form label-position="left" inline class="demo-table-expand">
        <el-form-item label="洗车单号">
          <span>{{detailList.washNo}}</span>
        </el-form-item>
        <el-form-item label="车牌号">
          <span>{{detailList.carNo}}</span>
        </el-form-item>
        <el-form-item label="客户姓名">
          <span>{{detailList.customerName}}</span>
        </el-form-item>
        <el-form-item label="客户电话">
          <span>{{detailList.mobile}}</span>
        </el-form-item>
        <el-form-item label="接车日期">
          <span>{{detailList.receiveDate}}</span>
        </el-form-item>
        <el-form-item label="服务顾问">
          <span>{{detailList.consultantName}}</span>
        </el-form-item>
        <el-form-item label="车间组长">
          <span>{{detailList.groupLeader}}</span>
        </el-form-item>
        <el-form-item label="洗车师">
          <span>{{detailList.supervisorName}}</span>
        </el-form-item>
        <el-form-item label="洗车类型">
          <span v-if="detailList.washType  == 1">普洗</span>
          <span v-if="detailList.washType == 2">精洗</span>
        </el-form-item>
        <el-form-item label="支付状态">
          <span v-if="detailList.payStatus == 0">未支付</span>
          <span v-if="detailList.payStatus == 1">已支付</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <span v-if="detailList.status == 1">待接车</span>
          <span v-if="detailList.status == 2">已接车</span>
          <span v-if="detailList.status == 3">待支付</span>
          <span v-if="detailList.status == 4">已支付 </span>
          <span v-if="detailList.status == 5">洗车中</span>
          <span v-if="detailList.status == 6">客户确认</span>
          <span v-if="detailList.status == 7">已完成 </span>
          <span v-if="detailList.status == 8">不同意</span>
        </el-form-item>
         <el-form-item label="洗车费用">
          <span>{{detailList.washCost}}</span>
        </el-form-item>
         <el-form-item label="支付总额">
          <span>{{detailList.payTotal}}</span>
        </el-form-item>
         <el-form-item label="打赏">
          <span>{{detailList.tipTotal}}</span>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- //线下支付 -->

    <el-dialog title="线下支付" :visible.sync="lineUpDataVisible">
      <el-form>
        <el-form-item label="支付方式" :label-width="formLabelWidth">
          <el-select v-model="lineUpData.payWay" placeholder="请选择">
            <el-option label="会员帐号" value="1"></el-option>
            <el-option label="支付宝" value="2"></el-option>
            <el-option label="微信" value="3"></el-option>
            <el-option label="现金" value="4"></el-option>
            <el-option label="刷卡" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付总额" :label-width="formLabelWidth">
          <el-input v-model="lineUpData.payTotal" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="lineUpData.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lineUpDataVisible = false">取 消</el-button>
        <el-button type="primary" @click="lineUpSend">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      loading: false,
      fullscreenLoading: false,
      dialogVisible: false,
      dialogFormVisible: false,
      showVisible: false,
      PicVisible: false,
      picEditVisible: false,
      lineUpDataVisible: false,
      formLabelWidth: "120px",

      form: {},
      search: {
        pageIndex: "0",
        pageSize: "15",
        payStatus: "",
        orderNo: "",
        status: ""
      },
      tableData: [],
      multipleSelection: [],
      showData: {},
      goodsList: [],
      rowList: {},
      picEdit: {
        womId: "",
        price1: "",
        price2: "",
        price3: ""
      },
      lineUpData: {
        wwId: "",
        payWay: "",
        payTotal: "",
        description: ""
      },
      detailList: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //支付状态
    payStatus(data) {
      switch (data.payStatus) {
        case 0:
          return "未支付";
          break;
        case 1:
          return "已支付";
          break;
      }
    },
    //维修单状态
    status(data) {
      switch (data.status) {
        case 1:
          return "待接车";
          break;
        case 2:
          return "已接车";
          break;
        case 3:
          return "待支付";
          break;
        case 4:
          return "已支付";
          break;
        case 5:
          return "洗车中";
          break;
        case 6:
          return "客户确认";
          break;
        case 7:
          return "已完成";
          break;
        case 8:
          return "不同意";
          break;
      }
    },

    getList() {
      this.loading = true;
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindWashServiceOrder",
        data: that.search
      }).then(function(res) {
        that.loading = false;
        that.tableData = JSON.parse(res.data);
        console.log(that.tableData);
      });
    },
    del() {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.fullscreenLoading = true;
          setTimeout(() => {
            this.fullscreenLoading = false;
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }, 3000);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
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
    //详情展示
    showDel(row) {
      this.rowList = row;
      this.detailByWrId();
      this.showVisible = true;

      // console.log(row)
    },
    //根据洗车单主键查询维修单详情
    detailByWrId() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindWashOrderDetaileByWwId",
        data: {
          wwId: that.rowList.wwId
        }
      }).then(function(res) {
        that.detailList = res.data.data;
        console.log(that.detailList);
      });
      // console.log(row)
    },

    //线下支付弹出
    lineUpShow(row) {
      this.lineUpDataVisible = true;
      this.lineUpData.wwId = row.wwId;
    },
    //线下支付确定
    lineUpSend() {
      let that = this;

      this.$confirm("确认完成支付？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that
            .$http({
              method: "post",
              url: url + "/clientWashPay",
              data: that.lineUpData
            })
            .then(function(res) {
              let datas = JSON.parse(res.data);
              if (datas.apiStatus == 1) {
                that.lineUpDataVisible = false;

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
            message: "已取消"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-table th > .cell {
  text-align: center;
}

.inputs {
  .el-button--primary,
  .el-button--danger {
    display: inline-block;
    vertical-align: top;
  }
}
</style>
<style lang="scss">
.washOrder {
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
}
</style>



