<template>
  <div class="maintainOrder" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="inputs">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="search" class="demo-form-inline">
            <el-form-item label="维修单号">
              <el-input v-model="search.orderNo" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="search.status" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="未派单" value="0"></el-option>
                <el-option label="待接车" value="1"></el-option>
                <el-option label="已接车" value="2"></el-option>
                <el-option label="库管确认" value="3"></el-option>
                <el-option label="待确认" value="4"></el-option>
                <el-option label="待支付" value="5"></el-option>
                <el-option label="修改项目" value="6"></el-option>
                <el-option label="已支付" value="7"></el-option>
                <el-option label="维修中" value="8"></el-option>
                <el-option label="客户确认" value="9"></el-option>
                <el-option label="已完成" value="10"></el-option>
                <el-option label="不同意" value="11"></el-option>
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
      <el-table-column  prop="repairNo" label="维修单号" min-width="170">
        <template scope="scope">
          <el-button type="text" size="small" @click="showDel(scope.row)">
            {{scope.row.repairNo}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="realname" label="客户姓名" min-width="150">
      </el-table-column>

      <el-table-column prop="carNo" label="车牌号" min-width="150">
      </el-table-column>
      <el-table-column prop="status" :formatter="status" label="维修单状态" min-width="100">
      </el-table-column>
      <el-table-column prop="payStatus" :formatter="payStatus" label="支付状态" min-width="100">
      </el-table-column>
      <el-table-column prop="receiveDate" label="接车时间" min-width="170">
      </el-table-column>
    

      <el-table-column fixed="right" label="操作" width="150">
        <template scope="scope">
          <el-button type="text" v-if="scope.row.status == 5" size="small" @click="lineUpShow(scope.row)">线下支付</el-button>
          <el-button type="text" v-if="scope.row.status == 3" size="small" @click="EditPic(scope.row)">确认价格</el-button>

        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @current-change="handleCurrentChange" :page-size="20" layout="prev, pager, next, jumper" :page-count="tableData.totalPage">
    </el-pagination>

    <!-- 编辑弹出层 -->
    <el-dialog title="商品编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="SKU名称" :label-width="formLabelWidth">
          <el-input v-model="form.date" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="所属分类" :label-width="formLabelWidth">
          <el-input v-model="form.province" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属品牌" :label-width="formLabelWidth">
          <el-input v-model="form.city" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 详情展示 -->
    <el-dialog title="订单详情" :visible.sync="showVisible">

      <el-form label-position="left" inline class="demo-table-expand">
        <el-form-item label="维修单号">
          <span>{{detailList.carNo}}</span>
        </el-form-item>
        <el-form-item label="车牌号">
          <span>{{detailList.repairNo}}</span>
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
        <el-form-item label="维修师">
          <span>{{detailList.supervisorName}}</span>
        </el-form-item>
        <el-form-item label="支付状态">
          <span v-if="detailList.payStatus == 0">未支付</span>
          <span v-if="detailList.payStatus == 1">已支付</span>

        </el-form-item>
        <el-form-item label="总价">
          <span>{{detailList.total}}</span>
        </el-form-item>
        <el-form-item label="维修单状态">
          <span v-if="detailList.status == 0">未派单</span>
          <span v-if="detailList.status == 1">待接车</span>
          <span v-if="detailList.status == 2">已接车</span>
          <span v-if="detailList.status == 3">库管确认</span>
          <span v-if="detailList.status == 4">待确认</span>
          <span v-if="detailList.status == 5">待支付</span>
          <span v-if="detailList.status == 6">修改项目</span>
          <span v-if="detailList.status == 7">已支付</span>
          <span v-if="detailList.status == 8">维修中</span>
          <span v-if="detailList.status == 9">客户确认</span>
          <span v-if="detailList.status ==10">已完成</span>
          <span v-if="detailList.status ==11">不同意</span>
        </el-form-item>

        <el-table :data="goodsList" border style="width: 100%">
          <el-table-column prop="itemName" label="物料名称">
          </el-table-column>
          <el-table-column prop="price1" label="普卡价">
          </el-table-column>
          <el-table-column prop="price2" label="金卡价">
          </el-table-column>
          <el-table-column prop="price3" label="钻卡价">
          </el-table-column>
          <el-table-column prop="quantity" label="数量">
          </el-table-column>
        </el-table>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- //确认价格 -->
    <el-dialog title="确认价格" :visible.sync="PicVisible">

      <el-form label-position="left" inline class="demo-table-expand">
        <el-form-item label="维修单号">
          <span>{{detailList.carNo}}</span>
        </el-form-item>
        <el-form-item label="车牌号">
          <span>{{detailList.repairNo}}</span>
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
        <el-form-item label="维修师">
          <span>{{detailList.supervisorName}}</span>
        </el-form-item>
        <el-form-item label="支付状态">
          <span v-if="detailList.payStatus == 0">未支付</span>
          <span v-if="detailList.payStatus == 1">已支付</span>

        </el-form-item>
        <el-form-item label="总价">
          <span>{{detailList.total}}</span>
        </el-form-item>
        <el-form-item label="维修单状态">
          <span v-if="detailList.status == 0">未派单</span>
          <span v-if="detailList.status == 1">待接车</span>
          <span v-if="detailList.status == 2">已接车</span>
          <span v-if="detailList.status == 3">库管确认</span>
          <span v-if="detailList.status == 4">待确认</span>
          <span v-if="detailList.status == 5">待支付</span>
          <span v-if="detailList.status == 6">修改项目</span>
          <span v-if="detailList.status == 7">已支付</span>
          <span v-if="detailList.status == 8">维修中</span>
          <span v-if="detailList.status == 9">客户确认</span>
          <span v-if="detailList.status ==10">已完成</span>
          <span v-if="detailList.status ==11">不同意</span>
        </el-form-item>

        <el-table :data="goodsList" border style="width: 100%">
          <el-table-column prop="itemName" label="物料名称">
          </el-table-column>
          <el-table-column prop="price1" label="普卡价">
          </el-table-column>
          <el-table-column prop="price2" label="金卡价">
          </el-table-column>
          <el-table-column prop="price3" label="钻卡价">
          </el-table-column>
          <el-table-column prop="quantity" label="数量">
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template scope="scope">

              <el-button type="text" size="small" @click="picShowEdit(scope.row)">修改价格</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="PicVisible = false">取 消</el-button>
        <el-button type="primary"  @click="surePic">确 定</el-button>
        
      </div>
    </el-dialog>

    <!-- //价格编辑 -->
    <el-dialog title="修改价格" :visible.sync="picEditVisible">
      <el-form>
        <el-form-item label="品牌名称" :label-width="formLabelWidth">
          <el-input disabled v-model="picEdit.itemName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="普卡价" :label-width="formLabelWidth">
          <el-input v-model="picEdit.price1" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="钻卡价" :label-width="formLabelWidth">
          <el-input v-model="picEdit.price2" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="金卡价" :label-width="formLabelWidth">
          <el-input v-model="picEdit.price3" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="picEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="trueEdit">确 定</el-button>
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
        wrId: "",
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
        case 0:
          return "未派单";
          break;
        case 1:
          return "待接车";
          break;
        case 2:
          return "已接车";
          break;
        case 3:
          return "库管确认";
          break;
        case 4:
          return "待确认";
          break;
        case 5:
          return "待支付";
          break;
        case 6:
          return "修改项目";
          break;
        case 7:
          return "已支付";
          break;
        case 8:
          return "维修中";
          break;
        case 9:
          return "客户确认";
          break;
        case 10:
          return "已完成";
          break;
        case 11:
          return "不同意";
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
        url: url + "/clientFindRepairServiceOrder",
        data: that.search
      }).then(function(res) {
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
    //详情展示弹出框
    showDel(row) {
      this.rowList = row;
      this.detailByWrId();
      this.showVisible = true;
      this.findMaterialByRepairId();
      // console.log(row)
    },
    //根据维修单主键查询维修单详情
    detailByWrId() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindRepairOrderDetailByWrId",
        data: {
          wrId: that.rowList.wrId
        }
      }).then(function(res) {
        // console.log(res.data.data.repairOrder)
        that.detailList = res.data.data.repairOrder;
        console.log(that.detailList);
      });
      // console.log(row)
    },
    //查询维修单的材料列表
    findMaterialByRepairId() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindMaterialByRepairId",
        data: {
          wrId: that.rowList.wrId
        }
      }).then(function(res) {
        that.goodsList = JSON.parse(res.data);
        console.log(that.goodsList);
      });
    },
    // 修改价格弹出框
    EditPic(row) {
      this.rowList = row;
      this.PicVisible = true;
      this.findMaterialByRepairId();
      this.detailByWrId();
    },
    // 编辑价格二次弹出
    picShowEdit(row) {
      var _item = {};
      for (var i in row) {
        _item[i] = row[i];
      }
      this.picEdit = _item;
      this.picEditVisible = true;
    },
    // 确定修改价格
    trueEdit() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientUpdateOrderMaterial",
        data: that.picEdit
      }).then(function(res) {
        let datas = JSON.parse(res.data);
        if (datas.apiStatus == 1) {
          that.findMaterialByRepairId();
          that.picEditVisible = false;
          that.$message({
            message: datas.msg,
            type: "success"
          });
        } else {
          that.$message.error(datas.msg);
        }
      });
    },
    //确认价格所有

    surePic() {
      let that = this;

      this.$confirm("您确认完成物料价格修改？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that
            .$http({
              method: "post",
              url: url + "/clientLibraryConfirm",
              data: {
                wrId: that.rowList.wrId
              }
            })
            .then(function(res) {
              let datas = JSON.parse(res.data);
              if (datas.apiStatus == 1) {
                that.getList();
                that.PicVisible = false;
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
    },
    //线下支付弹出
    lineUpShow(row) {
      this.lineUpDataVisible = true;
      this.lineUpData.wrId = row.wrId;
    },
    //线下支付确定
    lineUpSend() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientRepairPay",
        data: that.lineUpData
      }).then(function(res) {
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
.maintainOrder {
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



