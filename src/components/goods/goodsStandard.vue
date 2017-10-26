<template>
  <div class="goodsStandard" v-loading.fullscreen.lock="fullscreenLoading">
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品规格</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="inputs">

      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="规格名称">
          <el-input v-model="search.attrName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="newEdits">新增规格</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="tableData.dataList" border style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="attrName" label="规格名称" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="isSellAttr" label="规格类型" :formatter="judge" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="categoryName" label="所属类别" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createDate" label="创建日期" width="160">
      </el-table-column>
      <el-table-column prop="description" label="备注" min-width="100" show-overflow-tooltip>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="170">
        <template scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="EditAttr(scope.row)" type="text" size="small">属性设置</el-button>
          <el-button type="text" size="small" style="color:#FF4949" @click="del(scope.row)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :page-size="20" layout="prev, pager, next, jumper" :page-count="tableData.totalPage">
    </el-pagination>

    <!-- 编辑弹出层 -->
    <el-dialog title="规格编辑" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="规格名称" :label-width="formLabelWidth">
          <el-input v-model="form.attrName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-select v-model="form.categoryId" placeholder="请选择">
            <el-option-group v-for="group in treeList" :key="group.label" :label="group.label">
              <el-option v-for="item in group.children" :key="item.id" :label="item.label" :value="item.id">
              </el-option>
            </el-option-group>
          </el-select>

        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>

        <el-checkbox-group v-model="checkedCities">
          <el-checkbox label="isRequired">是否必选</el-checkbox>
          <el-checkbox label="isChx">是否多选</el-checkbox>
          <el-checkbox label="isSellAttr">是否销售属性</el-checkbox>
          <el-checkbox label="isMainAttr">是否关键属性</el-checkbox>
          <el-checkbox label="isColor">是否颜色属性</el-checkbox>
          <el-checkbox label="isCommonAttr">是否一般属性</el-checkbox>
          <el-checkbox label="isSearch">是否搜索字段</el-checkbox>
        </el-checkbox-group>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendEdit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增规格 -->
    <el-dialog title="新增规格" :visible.sync="newVisible">
      <el-form>
        <el-form-item label="规格名称" :label-width="formLabelWidth">
          <el-input v-model="newData.attrName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属类别" :label-width="formLabelWidth">
          <el-select v-model="newData.categoryId" placeholder="请选择">
            <el-option-group v-for="group in treeList" :key="group.label" :label="group.label">
              <el-option v-for="item in group.children" :key="item.id" :label="item.label" :value="item.id">
              </el-option>
            </el-option-group>
          </el-select>

        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="newData.description"></el-input>
        </el-form-item>

        <el-checkbox-group v-model="checkedCities">
          <el-checkbox label="isRequired">是否必选</el-checkbox>
          <el-checkbox label="isChx">是否多选</el-checkbox>
          <el-checkbox label="isSellAttr">是否销售属性</el-checkbox>
          <el-checkbox label="isMainAttr">是否关键属性</el-checkbox>
          <el-checkbox label="isColor">是否颜色属性</el-checkbox>
          <el-checkbox label="isCommonAttr">是否一般属性</el-checkbox>
          <el-checkbox label="isSearch">是否搜索字段</el-checkbox>

        </el-checkbox-group>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendNewGoods">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增属性框 -->
    <el-dialog class="Edit" title="新增属性" :visible.sync="addAttryVisible">
      <el-form>
        <el-form-item label="规格名称" :label-width="formLabelWidth">
          <el-input disabled="" v-model="addAttrData.attrName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="属性" :label-width="formLabelWidth">
          <el-tag :key="tag.vId" v-for="tag in dynamicTags" :closable="true" :close-transition="false" @close="handleClose(tag)">
            {{tag.valueName}}
          </el-tag>
          <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

  </div>
</template>


<script>
export default {
  data() {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      checkedCities: [],
      loading: true,
      fullscreenLoading: false,
      dialogVisible: false,
      dialogFormVisible: false,
      newVisible: false,
      addAttryVisible: false,
      formLabelWidth: "120px",
      search: {
        pageIndex: 0,
        pageSize: 20,
        attrName: ""
      },
      form: {},
      input: "",
      tableData: [],
      newEdit: {},
      newData: {
        categoryId: "",
        description: "",
        attrName: "",
        isRequired: 2,
        isChx: 2,
        isSellAttr: 2,
        isMainAttr: 2,
        isColor: 2,
        isCommonAttr: 2,
        isSearch: 2
      },
      treeList: [],
      multipleSelection: [],
      checkList: [],
      addAttrData: {
        attrName: "",
        attrId: ""
      },
      AttrdataList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleClose(tag) {
      console.log(tag);
      let that = this;
      // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);

      this.$http({
        method: "post",
        url: url + "/clientProductDeleteAttrValue",
        data: {
          attrValueId: tag.vId
        }
      }).then(function(res) {
        // console.log(categoryId)
        let datas = JSON.parse(res.data).apiStatus;
        if (datas == 1) {
          that.getAddrlsit();
        }
      });
    },

    showInput() {
      this.inputVisible = true;

      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
        // console.log(8)
      });
    },

    handleInputConfirm(tag) {
      console.log(this.addAttrData);

      var that = this;
      let inputValue = this.inputValue;
      console.log(inputValue);
      if (inputValue) {
        this.$http({
          method: "post",
          url: url + "/clientProductAddAttrValue",
          data: {
            attrId: that.addAttrData.attrId,
            valueName: inputValue,
            categoryId: that.addAttrData.categoryId
          }
        }).then(function(res) {
          // console.log(categoryId)
          if (res.data.apiStatus == 1) {
            that.getAddrlsit();
          }
        });

        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    EditAttr(row) {
      this.addAttrData = row;

      this.addAttryVisible = true;
      this.getAddrlsit();
    },
    //获取attr属性
    getAddrlsit() {
      var that = this;
      this.$http({
        method: "post",
        url: url + "/clientProductFindAttrValueListByAttrId",
        data: {
          attrId: that.addAttrData.attrId
        }
      }).then(function(res) {
        that.dynamicTags = res.data.data;
      });
    },
    judge(data) {
      //taxStatus 布尔值
      return data.skuName == 1 ? "销售类" : "非销售类";
    },
    getList() {
      this.loading = true;
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientProductAttrFindPage",
        data: that.search
      }).then(function(res) {
        that.loading = false;
        that.tableData = JSON.parse(res.data);
      });
    },
    //查询搜索
    getSearch() {
      this.getList();
    },
    //分页
    handleCurrentChange(val) {
      this.search.pageIndex = val - 1;
      this.getList();
    },
    //新增商品
    newEdits() {
      this.checkedCities = [];
      this.getTree();
      this.newVisible = true;
    },
    //获取数列表
    getTree() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientProductCategoryTreeData"
      }).then(function(res) {
        that.treeList = JSON.parse(res.data);
      });
    },
    // 新增发送
    sendNewGoods() {
      for (var key in this.newData) {
        for (var i = 0; i < this.checkedCities.length; i++) {
          if (key == this.checkedCities[i]) {
            this.newData[key] = 1;
          }
        }
      }
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientProductAddOrEditAttr",
        data: that.newData
      }).then(function(res) {
        if (res.data.apiStatus == 1) {
          that.newVisible = false;
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
    //编辑发送
    sendEdit() {
      var that = this;
      for (let i in this.form) {
        for (let x = 0; x < this.checkedCities.length; x++) {
          if (i == this.checkedCities[x]) {
            this.form[i] = 1;
          }
        }
      }
      this.$http({
        method: "post",
        url: url + "/clientProductAddOrEditAttr",
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
              url: url + "/clientProductDeleteAttrByAttrId",
              data: {
                attrId: row.attrId
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
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //编辑商品
    handleEdit(row) {
      console.log(row);

      this.getTree();
      this.checkedCities = [];
      this.dialogFormVisible = true;
      var _item = {};
      for (var i in row) {
        _item[i] = row[i];
      }
      this.form = _item;
      var i = 0;
      for (var key in this.form) {
        if (this.form[key] == 1) {
          this.checkedCities[i] = key;
          this.form[key] = 2;
          i++;
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">
.goodsStandard {
  .el-tag {
    margin-left: 5px;
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



