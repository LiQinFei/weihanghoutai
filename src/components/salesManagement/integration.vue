<template>
  <div class="integration" v-loading.fullscreen.lock="fullscreenLoading">
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/' }">营销管理</el-breadcrumb-item>
      <el-breadcrumb-item>积分规则</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="inputs">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="规则名称">
          <el-input v-model="search.ruleName" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="searchgoods">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="tableData.dataList" border style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="ruleName" label="规则名称" width="140">
         <template scope="scope">
            <el-button type="text" size="small" @click="showDataFun(scope.row)">
                {{scope.row.ruleName}}
            </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="ruleCode" label="规则码" width="120" show-overflow-tooltip>
      </el-table-column>
   
      <el-table-column prop="ruleValue" label="积分数" width="160">
      </el-table-column>
       <el-table-column prop="ruleStatus"  label="状态" width="160"  :formatter="ruleStatus">
      </el-table-column>
       <el-table-column prop="description" min-width="150" show-overflow-tooltip label="规则描述">
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150">
        <template scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" style="color:#FF4949" size="small" v-if="scope.row.ruleStatus == 1" @click="effectivity(scope.row,2)">无效</el-button>
          <el-button type="text" style="color:#FF4949" size="small" v-if="scope.row.ruleStatus == 2" @click="effectivity(scope.row,1)">有效</el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleCurrentChange" :page-size="20" layout="prev, pager, next, jumper" :page-count="tableData.totalPage">
    </el-pagination>
    <!-- 编辑弹出层 -->
    <el-dialog class="Edit" title="积分编辑" :visible.sync="dialogFormVisible">
       <el-form :model="newEdit">
        
        <el-form-item label="规则名称：" :label-width="formLabelWidth">
          <el-input v-model="form.ruleName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="积分数" :label-width="formLabelWidth">
          <el-input v-model="form.ruleValue" auto-complete="off"></el-input>
        </el-form-item>
         <el-form-item label="积分说明" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="clientSaveSortInfo">确 定</el-button>
      </div>
    </el-dialog>

  

      
       <!-- 详情显示 -->
        
        <el-dialog title="券详情" :visible.sync="showVisible">

            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="规则名称">
                    <span>{{showData.ruleName}}</span>
                </el-form-item>
                <el-form-item label="规则码">
                    <span>{{showData.ruleCode}}</span>
                </el-form-item>
               
                  <el-form-item label="积分数">
                    <span>{{showData.ruleValue}}</span>
                </el-form-item>

              
                
               <div class="allList">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="规则描述" style="width:100%">
                      <span>{{showData.description}}</span>
                      </el-form-item>
                  </el-col>
                </el-row>
                
               </div>

            </el-form>
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
      form: {},
      value: "",
      newEdit: {},
      newList: [],
      search: {
        pageIndex: 0,
        pageSize: 20,
        ruleName: ""
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
    ruleStatus(data) {
      switch (data.ruleStatus) {
        case 1:
          return "有效";
          break;
        case 2:
          return "无效";
          break;
      }
    },
    getList() {
      this.loading = true;
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindIntegralRuleList",
        data: that.search
      }).then(function(res) {
        that.loading = false;
        that.tableData = res.data.data;
        console.log(res.data.data);
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
    //编辑确定
    clientSaveSortInfo() {
      // this.value = ''

      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientModifyIntegralRule",
        data: that.form
      }).then(function(res) {
        if (res.data.apiStatus == 1) {
          that.dialogFormVisible = false;
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
    // 编辑分类信息
    clientProductModifySortInfo() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientProductModifySortInfo",
        data: that.form
      }).then(function(res) {
        let data = JSON.parse(res.data);
        if (data.apiStatus == 1) {
          that.form = {};
          that.dialogFormVisible = false;
          that.getList();

          that.$message({
            message: data.msg,
            type: "success"
          });
        } else {
          that.$message.error(data.msg);
        }
      });
    },
    del(row) {
      let that = this;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that.fullscreenLoading = true;
          that
            .$http({
              method: "post",
              url: url + "/clientDeleteSortInfo",
              data: {
                categoryId: row.categoryId
              }
            })
            .then(function(res) {
              let data = JSON.parse(res.data);
              if (data.apiStatus == 1) {
                that.fullscreenLoading = false;
                that.getList();
                that.$message({
                  message: data.msg,
                  type: "success"
                });
              } else {
                that.$message.error(data.msg);
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
    handleEdit(row) {
      this.dialogFormVisible = true;

      var _item = {};
      for (var i in row) {
        _item[i] = row[i];
      }
      this.form = _item;
      console.log(row);
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
        url: url + "/clientFindIntegralRuleByRuleId",
        data: {
          integralRuleId: row.integralRuleId
        }
      }).then(function(res) {
        that.showData = res.data.data;
        // console.log(that.showData);
        console.log(that.showData);
      });
    },
    effectivity(row, indexs) {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientModifyIntegralRule",
        data: {
          integralRuleId: row.integralRuleId,
          ruleStatus: indexs
        }
      }).then(function(res) {
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
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">
.integration {
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



