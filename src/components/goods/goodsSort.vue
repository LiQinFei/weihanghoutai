<template>
  <div class="goodsSort" v-loading.fullscreen.lock="fullscreenLoading">
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品类别</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="inputs">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="类别名称">
          <el-input v-model="search.cname" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchgoods">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="getNewList">新增类别</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="tableData.dataList" border style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="cname" label="类别名称" width="140">
      </el-table-column>
      <el-table-column prop="parentName" label="上级分类" width="100">
      </el-table-column>

      <el-table-column prop="createDate" label="创建日期" width="160">
      </el-table-column>

      <el-table-column prop="modifyDate" label="修改日期" width="160">
      </el-table-column>
      <el-table-column prop="description" label="备注">
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150">
        <template scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" style="color:#FF4949" size="small" @click="del(scope.row)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleCurrentChange" :page-size="20" layout="prev, pager, next, jumper" :page-count="tableData.totalPage">
    </el-pagination>
    <!-- 编辑弹出层 -->
    <el-dialog class="Edit" title="类别编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="上级类别:" :label-width="formLabelWidth">
          <el-input disabled v-model="form.parentName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类别名称:" :label-width="formLabelWidth">
          <el-input v-model="form.cname" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="form.sort" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="clientProductModifySortInfo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增类别 -->
    <el-dialog title="新增类别" :visible.sync="newVisible">
      <el-form :model="newEdit">
        <el-form-item label="上级分类:" :label-width="formLabelWidth">
          <el-select v-model="newEdit.parentId" placeholder="请选择">
            <el-option v-for="item in newList" :key="item.categoryId" :label="item.cname" :value="item.categoryId">
            </el-option>
          </el-select>
          <span style="color:red">*空代表该类别为父类型</span>
        </el-form-item>
        <el-form-item label="类别名称：" :label-width="formLabelWidth">
          <el-input v-model="newEdit.cname" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="newEdit.sort" auto-complete="off"></el-input>
          <span style="color:red">*数字越大越靠前</span>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newVisible = false">取 消</el-button>
        <el-button type="primary" @click="clientSaveSortInfo">确 定</el-button>
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
        formLabelWidth: "120px",
        form: {},
//      value: "",
        newEdit: {
          parentId: '',
          cname: '',
          sort: ''

        },
        newList: [],
        search: {
          pageIndex: 0,
          pageSize: 20,
          cname: ""
        },
        tableData: [],
        multipleSelection: []
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.loading = true;
        let that = this;
        this.$http({
          method: "post",
          url: url + "/clientProductCategoryFindPage",
          data: that.search
        }).then(function (res) {
          that.loading = false;
          that.tableData = JSON.parse(res.data);

        });
      },
      getNewList() {
        this.newEdit = {
          parentId: '',
          cname: '',
          sort: ''

        }
        this.newVisible = true;
        this.productGetAllRootCategoryList();
      },
      // 获取分类列表
      productGetAllRootCategoryList() {
        let that = this;
        this.$http({
          method: "post",
          url: url + "/productGetAllRootCategoryList"
        }).then(function (res) {
          that.newList = JSON.parse(res.data).data;
          that.newList.unshift({cname: ''})
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
      //新增商品
      clientSaveSortInfo() {
        // this.value = ''
//      this.newEdit.parentId = this.value;

        let that = this;
        this.$http({
          method: "post",
          url: url + "/clientSaveSortInfo",
          data: that.newEdit
        }).then(function (res) {
          that.value = "";
          let data = JSON.parse(res.data);
          if (data.apiStatus == 1) {
            that.newVisible = false;
            that.$message({
              message: data.msg,
              type: "success"
            });
          } else {
            that.$message.error(data.msg);
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
        }).then(function (res) {
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
              .then(function (res) {
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
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">
  .goodsSort {
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



