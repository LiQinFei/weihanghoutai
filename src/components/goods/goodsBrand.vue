<template>
  <div class="goodsBrand" v-loading.fullscreen.lock="fullscreenLoading">
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品品牌</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="inputs">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="品牌名称">
          <el-input v-model="search.brandName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="newEdits">新增品牌</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="tableData.dataList" border style="width: 100%" v-loading="loading">
      <el-table-column type="index" width="50">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌名称"  width="150" show-overflow-tooltip>
        <template scope="scope">
          <el-button type="text" size="small" @click="showDel(scope.row)">
            {{scope.row.brandName}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建日期" width="160">
      </el-table-column>
      <el-table-column prop="description" label="备注" min-width="150" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="del(scope.row)" style="color:#FF4949">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @current-change="handleCurrentChange" :page-size="20" layout="prev, pager, next, jumper" :page-count="tableData.totalPage">
    </el-pagination>

    <!-- 编辑弹出层 -->
    <el-dialog title="商品品牌" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="品牌名称" :label-width="formLabelWidth" >
          <el-input v-model="form.brandName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-select v-model="form.categoryIds" multiple placeholder="请选择">
            <el-option-group v-for="group in treeList" :key="group.label" :label="group.label">
              <el-option v-for="item in group.children" :key="item.id" :label="item.label" :value="item.id">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片" :label-width="formLabelWidth">
          <el-upload class="avatar-uploader" :action="url+'/imageUpload'" name="file" :data="datas" :show-file-list="false" :on-success="uploadSussEdit">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增品牌 -->
    <el-dialog title="新增品牌" :visible.sync="newVisible">
      <el-form :model="newEdit" enctype="multipart/form-data">
        <el-form-item label="品牌名称" :label-width="formLabelWidth">
          <el-input v-model="newEdit.brandName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属类别" :label-width="formLabelWidth">
          <el-select v-model="newEdit.categoryIds" multiple placeholder="请选择">
            <el-option-group v-for="group in treeList" :key="group.label" :label="group.label">
              <el-option v-for="item in group.children" :key="item.id" :label="item.label" :value="item.id">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片" :label-width="formLabelWidth">

          <el-upload class="avatar-uploader" :action="url+'/imageUpload'" name="file" :data="datas" :show-file-list="false" :on-success="uploadSuss">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="newEdit.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendNew">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 展示 -->
    <el-dialog title="品牌展示" :visible.sync="showVisible">
      <el-form>
        <el-form-item label="品牌名称" :label-width="formLabelWidth">
          <el-input disabled v-model="showData.brandName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="上传图片" :label-width="formLabelWidth">

          <img :src="url+ '/'+showData.brandLogoUrl" class="avatar">

        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input disabled type="textarea" v-model="showData.description"></el-input>
        </el-form-item>
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
      url: "",
      loading: true,
      fullscreenLoading: false,
      dialogVisible: false,
      dialogFormVisible: false,
      newVisible: false,
      showVisible: false,
      formLabelWidth: "120px",
      form: {},
      search: {
        pageIndex: 0,
        pageSize: 20,
        brandName: ""
      },
      treeList: [],
      tableData: [],

      newEdit: {
        brandName: "",
        categoryIds: "",
        brandLogoUrl: "",
        description: ""
      },
      showData: {},
      multipleSelection: [],
      dialogImageUrl: "",
      dialogVisible: false,
      imageUrl: "",
      datas: {
        fileType: 4
      }
    };
  },
  created() {
    this.url = url;
    this.getList();
  },
  methods: {
    getList() {
      this.loading = false;
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientProductBrandFindPage",
        data: that.search
      }).then(function(res) {
        that.loading = false;
        that.tableData = JSON.parse(res.data);
      });
    },
    handlePictureCardPreview(file) {
      // console.log(file.response)
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //上传成功
    uploadSuss(response, file, fileList) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.newEdit.brandLogoUrl = response.data;
    },
    uploadSussEdit(response, file, fileList) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.form.brandLogoUrl = response.data;
    },
    //查询搜索
    getSearch() {
      this.getList();
    },
    //新增发送接口

    sendNew() {
      let that = this;
      this.newEdit.categoryIds = this.newEdit.categoryIds.join(",");
      this.$http({
        method: "post",
        url: url + "/clientProductBrandSaveOrUpdate",
        data: that.newEdit
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
    handleCurrentChange(val) {
      this.search.pageIndex = val - 1;
      this.getList();
    },
    //新增商品
    newEdits() {
      this.imageUrl = "";
      this.newEdit = {
        brandName: "",
        categoryIds: "",
        brandLogoUrl: "",
        description: ""
      };
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
              url: url + "/clientDeleteProductBrand",
              data: {
                brandId: row.brandId
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
    //编辑
    handleEdit(row) {
      this.imageUrl = url + "/" + row.brandLogoUrl;
      console.log(row);
      // this.form.brandId = row.brandId;
      this.dialogFormVisible = true;
      this.getTree();
      let that = this;

      this.$http({
        method: "post",
        url: url + "/clientFindProductBrandByBrandId",
        data: {
          brandId: row.brandId
        }
      }).then(function(res) {
        let obj = {};
        obj = res.data.data.productBrand;
        obj.categoryIds = res.data.data.categoryIds.split(",");
        that.form = obj;
      });
    },
    sendEdit() {
      var that = this;
      this.form.categoryIds = this.form.categoryIds.join(",");
      this.$http({
        method: "post",
        url: url + "/clientProductBrandSaveOrUpdate",
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
    // 显示展示
    showDel(row) {
      this.showVisible = true;
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindProductBrandByBrandId",
        data: {
          brandId: row.brandId
        }
      }).then(function(res) {
        that.showData = res.data.data.productBrand;
        console.log(that.showData);
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
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
.goodsBrand {
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



