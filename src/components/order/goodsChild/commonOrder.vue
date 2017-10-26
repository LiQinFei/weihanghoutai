<template>
    <div class="commonOrder" v-loading.fullscreen.lock="fullscreenLoading">
    
        <!-- 搜索 -->
        <div class="inputs">
            <el-row>
                <el-col :span="24">
                    <el-form :inline="true" :model="search" class="demo-form-inline">
                        <el-form-item label="订单号">
                            <el-input v-model="search.orderNo" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="订单状态">
                            <el-select v-model="search.orderStatus" placeholder="全部">
                                <el-option label="全部" value=""></el-option>
                                <el-option label="已删除" value="0"></el-option>
                                <el-option label="待付款" value="1"></el-option>
                                <el-option label="待收货" value="2"></el-option>
                                <el-option label="待评价" value="3"></el-option>
                                <el-option label="已完成" value="4"></el-option>
                                <el-option label="已失效" value="8"></el-option>
                                <el-option label="已取消" value="9"></el-option>
                                <el-option label="已退款" value="10"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="下单时间 开始">
                            <el-date-picker v-model="search.startDate" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="下单时间 结束">
                            <el-date-picker v-model="search.endDate" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchgoods">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>

        </div>
        <!-- 列表 -->
        <el-table ref="multipleTable" :data="tableData.dataList" border style="width: 100%" v-loading="loading">
            <el-table-column  type="index" width="51">
            </el-table-column>    
            <el-table-column  prop="orderNo" label="订单号" width="150">
                <template scope="scope">
                    <el-button type="text" size="small" @click="showDel(scope.row)">
                        {{scope.row.orderNo}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="deliveryAddress.name" label="客户名称" width="100">
            </el-table-column>
            <el-table-column prop="deliveryAddress.mobile" label="联系电话" width="130">
            </el-table-column>
            <el-table-column prop="orderAmount" label="订单总额" width="90">
            </el-table-column>
            <el-table-column prop="createDate" label="下单时间" width="160">
            </el-table-column>
            <el-table-column prop="orderStatus" :formatter="orderStatus" label="订单状态" width="100">
            </el-table-column>
            <el-table-column prop="orderType" :formatter="orderType" label="订单类型" width="100">
            </el-table-column>
            <el-table-column prop="payType" :formatter="payType" label="支付方式" width="100">
            </el-table-column>
            <el-table-column prop="payStatus" :formatter="payStatus" label="支付状态" width="100">
            </el-table-column>
            <el-table-column prop="orderPayAmount" label="支付总额" width="100">
            </el-table-column>
            <el-table-column prop="invoiceCode" label="发票" width="160"  show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="payTime" label="支付时间" width="160">
            </el-table-column>
            <el-table-column prop="deliveryTime" label="发货时间" width="160">
            </el-table-column>
            <el-table-column prop="isActivity" :formatter="isActivity" label="是否活动商品" width="110">
            </el-table-column>
            <el-table-column prop="discount" label="优惠金额" width="100">
            </el-table-column>
            <el-table-column prop="description" label="备注" min-width="100" show-overflow-tooltip>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template scope="scope">
                    <el-button @click="sendGoods(scope.row)" v-if="scope.row.orderStatus == 2" type="text" size="small">发货</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @current-change="handleCurrentChange" :page-size="20" layout="prev, pager, next, jumper" :page-count="tableData.totalPage">
        </el-pagination>

        <!-- 展示 -->
        <el-dialog title="订单详情" :visible.sync="showVisible">

            <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="订单号">
                    <span>{{showData.orderNo}}</span>
                </el-form-item>
                <el-form-item label="客户名称">
                    <span>{{showUer.name}}</span>
                </el-form-item>
                <el-form-item label="联系方式">
                    <span>{{showUer.mobile}}</span>
                </el-form-item>
                <el-form-item label="配送地址">
                    <span>{{showUer.address}}</span>
                </el-form-item>

                <el-table :data="goodsList" border style="width: 100%">
                    <el-table-column prop="skuName" label="商品名称">
                    </el-table-column>
                    <el-table-column prop="quantity" label="数量">
                    </el-table-column>
                    <el-table-column prop="attributes" label="属性">
                    </el-table-column>
                </el-table>
                <el-row style="height:200px;padding-top:20px;">
                    <el-col :span="7" style="height:200px">
                     
                    </el-col>
                    <el-col :span="7" style="height:200px">
                     
                    </el-col>
                    <el-col :span="7" style="height:200px" class="lists">
                        <el-form-item label="发票">
                            <span v-if="showData.invoiceCode">是</span>
                            <span>否</span>
                        </el-form-item>
                        <el-form-item label="订单总额">
                            <span>{{showData.orderAmount}}</span>
                        </el-form-item>
                        <el-form-item label="优惠金额">
                            <span>{{showData.discount}}</span>
                        </el-form-item>
                        <el-form-item label="支付总额">
                            <span>{{showData.orderPayAmount}}</span>
                        </el-form-item>
                        <el-form-item label="支付方式">
                            <span v-if="showData.payType == 1">账户</span>
                            <span v-else-if="showData.payType == 2">支付宝</span>
                            <span v-else-if="showData.payType == 3"> 微信</span>
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
      dialogVisible: false,
      showVisible: false,
      formLabelWidth: "120px",
      form: {},
      value: "",
      newEdit: {},
      newList: [],
      search: {
        pageIndex: 0,
        pageSize: 15,
        orderNo: "",
        orderStatus: "",
        startDate: "",
        endDate: "",
        orderCategory: "1"
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
    //支付方式
    payType(data) {
      switch (data.payType) {
        case 1:
          return "账户";
          break;
        case 2:
          return "支付宝";
          break;
        case 3:
          return "微信";
          break;
        default:
          return "";
      }
    },
    //订单状态
    orderStatus(data) {
      switch (data.orderStatus) {
        case 0:
          return "已删除";
          break;
        case 1:
          return "待付款";
          break;
        case 2:
          return "待收货";
          break;
        case 3:
          return "待评价";
          break;
        case 4:
          return "已完成";
          break;
        case 8:
          return "已失效";
          break;
        case 9:
          return "已取消";
          break;
        case 10:
          return "已退款";
          break;
        default:
          return "";
      }
    },
    //订单类型
    orderType(data) {
      switch (data.orderType) {
        case 1:
          return "正常";
          break;
        case 2:
          return "退";
          break;
        case 3:
          return "换";
          break;
        default:
          return "";
      }
    },
    //支付状态
    payStatus(data) {
      switch (data.payStatus) {
        case 1:
          return "待支付";
          break;
        case 2:
          return "已支付";
          break;
        default:
          return "";
      }
    },
    //是否是活动商品
    isActivity(data) {
      switch (data.isActivity) {
        case 1:
          return "是";
          break;
        case 2:
          return "否";
          break;
        default:
          return "";
      }
    },
    getList() {
      this.loading = true;
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindOrderList",
        data: that.search
      }).then(function(res) {
        that.loading = false;
        let datas = res.data.data;

        // for (let i = 0; i < datas.dataList.length; i++) {
        //   datas.dataList[i].deliveryAddress = JSON.parse(
        //     datas.dataList[i].deliveryAddress
        //   );
        // }
        that.tableData = datas;
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
    //发货
    sendGoods(row) {
      let that = this;
      this.$confirm("是否发货?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that
            .$http({
              method: "post",
              url: url + "/clientDeliveryGoodsByOrderId",
              data: {
                orderId: row.orderId
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
    //详情展示
    showDel(row) {
      this.clientFindOrderList(row.orderId);
      this.showData = row;
      this.showUer = row.deliveryAddress;
      this.showVisible = true;
      console.log(row);
    },
    //订单详情查询
    clientFindOrderList(row) {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindOrderDetailListByOrderId",
        data: {
          orderId: row
        }
      }).then(function(res) {
        that.goodsList = res.data.data.orderDetailList;
        console.log(res.data.data.orderDetailList);
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">
.commonOrder {
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
      //   text-align: center;
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



