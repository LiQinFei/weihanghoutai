<template>
  <div class="adPosition" v-loading.fullscreen.lock="fullscreenLoading">
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/' }"> 广告管理</el-breadcrumb-item>
      <el-breadcrumb-item>广告位管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <div class="inputs">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="类别名称">
          <el-input v-model="search.positionName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="位置类型">
          <el-select v-model="search.positionType">
            <el-option label="全部" value=""></el-option>
            <el-option label="PC" value="2"></el-option>
            <el-option label="APP" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchgoods">查询</el-button>
          <el-button type="warning" @click="newVisible = true">新增广告位</el-button>

        </el-form-item>
      </el-form>
    </div>
    <!-- 列表展示 -->
    <el-table ref="multipleTable" :data="tableData.dataList" border style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="positionName" label="广告位名称" min-width="100" show-overflow-tooltip>
        <template scope="scope">
          <el-button type="text" size="small" @click="getAttrShow(scope.row)">
            {{scope.row.positionName}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="positionType" :formatter="judge" label="位置类型">
      </el-table-column>
      <el-table-column prop="adWidth" label="广告位宽度">
      </el-table-column>
      <el-table-column prop="adHeight" label="广告位高度">
      </el-table-column>
      <el-table-column prop="description" label="备注" min-width="100" show-overflow-tooltip>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150">
        <template scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleCurrentChange" :page-size="20" layout="prev, pager, next, jumper" :page-count="tableData.totalPage">
    </el-pagination>

    <!-- 新增弹出层 -->
    <el-dialog class="Edit" title="广告位编辑" :visible.sync="newVisible">
      <el-form>
        <el-form-item label="广告位编号:" :label-width="formLabelWidth">
          <el-input v-model="newData.positionCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="广告位名称:" :label-width="formLabelWidth">
          <el-input v-model="newData.positionName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="位置类型:" :label-width="formLabelWidth" v-model="form.positionType">
          <el-select v-model="newData.positionType">
            <el-option label="PC" value="2"></el-option>
            <el-option label="APP" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告位宽度:" :label-width="formLabelWidth">
          <el-input v-model="newData.adWidth" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="广告位高度:" :label-width="formLabelWidth">
          <el-input v-model="newData.adHeight" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注:" :label-width="formLabelWidth">
          <el-input v-model="newData.description" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newVisible = false">取 消</el-button>
        <el-button type="primary" @click="newSend">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑弹出层 -->
    <el-dialog class="Edit" title="广告位编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="广告位编号:" :label-width="formLabelWidth">
          <el-input v-model="form.positionCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="广告位名称:" :label-width="formLabelWidth">
          <el-input v-model="form.positionName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="位置类型:" :label-width="formLabelWidth" v-model="form.positionType">
          <el-select v-model="form.positionType">
            <el-option label="APP" :value="1"></el-option>
            <el-option label="PC" :value="2"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="广告位宽度:" :label-width="formLabelWidth">
          <el-input v-model="form.adWidth" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="广告位高度:" :label-width="formLabelWidth">
          <el-input v-model="form.adHeight" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注:" :label-width="formLabelWidth">
          <el-input v-model="form.description" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="clientProductModifySortInfo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- //广告展示 -->
    <el-dialog title="广告详情" :visible.sync="attrShowVisible">
      <el-form>
        <el-form-item label="广告位编号:" :label-width="formLabelWidth">

          <span>{{adShow.positionCode}}</span>
        </el-form-item>
        <el-form-item label="广告位名称:" :label-width="formLabelWidth">

          <span>{{adShow.positionName}}</span>

        </el-form-item>
        <el-form-item label="位置类型:" :label-width="formLabelWidth">
          <span v-if="adShow.positionType == 1">APP</span>
          <span v-else>PC</span>
        </el-form-item>
        <el-form-item label="广告位宽度:" :label-width="formLabelWidth">

          <span>{{adShow.adWidth}}</span>

        </el-form-item>
        <el-form-item label="广告位高度:" :label-width="formLabelWidth">

          <span>{{adShow.adHeight}}</span>

        </el-form-item>

        <el-form-item label="广告位描述:" :label-width="formLabelWidth">

          <span>{{adShow.positionDesc}}</span>

          </el-input>
        </el-form-item>
        <el-form-item label="备注:" :label-width="formLabelWidth">

          <span>{{adShow.description}}</span>

          </el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="attrShowVisible = false">取 消</el-button>
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
      attrShowVisible: false,
      form: {},
      value: "",
      newEdit: {},
      newList: [],
      search: {
        pageIndex: 0,
        pageSize: 10,
        positionName: "",
        positionType: ""
      },
      tableData: [],
      adShow: {},
      newData: {
        positionCode: "",
        positionName: "",
        positionType: "1",
        adWidth: "",
        adHeight: "",
        description: ""
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    judge(data) {
      //taxStatus 布尔值
      switch (data.positionType) {
        case 1:
          return "APP";
          break;
        case 2:
          return "PC";
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
        url: url + "/clientFindByAdPositionIdNamePaged",
        data: that.search
      }).then(function(res) {
        that.loading = false;
        that.tableData = JSON.parse(res.data);
        console.log(that.tableData);
      });
    },
    //点击新增
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
    //点击分页
    handleCurrentChange(val) {
      this.search.pageIndex = val - 1;
      this.getList();
    },
    //查询
    searchgoods() {
      this.getList();
    },
    // 编辑完成确定
    clientProductModifySortInfo() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientAddOrEditAdvertPosition",
        data: that.form
      }).then(function(res) {
        let data = JSON.parse(res.data);
        if (data.apiStatus == 1) {
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
    //删除
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
              url: url + "/clientDeleteAdvertPosition",
              data: {
                id: row.id
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
    // 新增广告位
    newadver() {},
    // 新增发送
    newSend() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientAddOrEditAdvertPosition",
        data: that.newData
      }).then(function(res) {
        let datas = JSON.parse(res.data);
        if (datas.apiStatus == 1) {
          that.newVisible = false;
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
    //点击编辑按钮获取row参数
    handleEdit(row) {
      this.dialogFormVisible = true;

      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindAdvertPositionInfo",
        data: {
          id: row.id
        }
      }).then(function(res) {
        that.form = JSON.parse(res.data).data;
      });
    },
    getAttrShow(row) {
      let that = this;
      this.attrShowVisible = true;
      this.$http({
        method: "post",
        url: url + "/clientFindAdvertPositionInfo",
        data: {
          id: row.id
        }
      }).then(function(res) {
        that.adShow = JSON.parse(res.data).data;
        console.log(that.adShow);
        // adShow
      });
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">
.adPosition {
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



