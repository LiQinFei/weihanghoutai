<template>
  <div class="goodsList" v-loading.fullscreen.lock="fullscreenLoading">
    <el-breadcrumb separator="/" style="margin-bottom:10px">
      <el-breadcrumb-item :to="{ path: '/' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="inputs">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="商品名称">
          <el-input v-model="search.productName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select v-model="search.productType" placeholder="产品类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="实体" value="1"></el-option>
            <el-option label="服务" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select v-model="search.reviewStatus" placeholder="产品类型">
            <el-option label="全部 " value=""></el-option>
            <el-option label="待审核 " value="1"></el-option>
            <el-option label="已上架 " value="2"></el-option>
            <el-option label="已下架" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类 别">
          <el-select v-model="search.categoryId" placeholder="全部" @visible-change="getTrees">
            <el-option-group v-for="group in treeList" :key="group.label" :label="group.label">
              <el-option v-for="item in group.children" :key="item.id" :label="item.label" :value="item.id">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="newEdits">新增产品</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table ref="newGoodsList" @selection-change="handleSelectionChange" :data="tableData.dataList" border style="width: 100%" v-loading="loading">
         <el-table-column  type="index" width="51">
      </el-table-column>
      <el-table-column  prop="productName" label="商品名称" min-width="100" show-overflow-tooltip>
      </el-table-column>
       <el-table-column prop="reviewStatus" label="状态" :formatter="judge" min-width="90">
      </el-table-column>
      <el-table-column prop="cname" label="所属分类" min-width="90" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="brandName" label="所属品牌" min-width="90" show-overflow-tooltip>
      </el-table-column>

      <el-table-column prop="productPrice" label="成本价" min-width="90">
      </el-table-column>

      <el-table-column prop="productUpTime" label="上架时间" min-width="160">
      </el-table-column>
      <el-table-column prop="productDownTime" label="下架时间" min-width="160">
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间" min-width="160">
      </el-table-column>
      <el-table-column prop="description" min-width="160" label="备注" show-overflow-tooltip>
      </el-table-column>


      <el-table-column fixed="right" label="操作" min-width="170">
        <template scope="scope">
          <el-button @click="newGoods(scope.row)" type="text" size="small">新增商品</el-button>
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" v-if="scope.row.reviewStatus == 1|| scope.row.reviewStatus==3" style="color:#13CE66" @click="putaway(2,scope.row)">上架</el-button>
          <el-button type="text" size="small" v-else style="color:#ff4949" @click="putaway(3,scope.row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @current-change="handleCurrentChange" :page-size="20" layout="prev, pager, next, jumper" :page-count="tableData.totalPage">
    </el-pagination>

    <!-- 编辑弹出层 -->
    <el-dialog title="产品编辑" :visible.sync="dialogFormVisible">
      <el-form :model="newEdit">
        <el-form-item label="产品名称:" :label-width="formLabelWidth">
          <el-input disabled v-model="form.productName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属分类:" :label-width="formLabelWidth">
          <el-input disabled v-model="form.cname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属品牌:" :label-width="formLabelWidth">
          <el-input disabled v-model="form.brandName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品价格" :label-width="formLabelWidth">
          <el-input v-model="form.productPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品详情" :label-width="formLabelWidth">
          <vue-editor v-model="form.productDetails"></vue-editor>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增产品 -->
    <el-dialog title="新增产品" :visible.sync="newVisible">
      <el-form :model="newEdit" ref="newEdit" :rules="newEditRules">
        <el-form-item prop="productName" label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="newEdit.productName " auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="productExplain" label="商品简介" :label-width="formLabelWidth">
          <el-input v-model="newEdit.productExplain " auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="productType" label="产品类型" :label-width="formLabelWidth">
          <el-select v-model="newEdit.productType">
            <el-option label="实体 " value="1"></el-option>
            <el-option label="服务" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="categoryId" label="类 别" :label-width="formLabelWidth">
          <el-select v-model="newEdit.categoryId" placeholder="请选择" @change="changeCategoryId" @visible-change="getTrees">
            <el-option-group v-for="group in treeList" :key="group.label" :label="group.label">
              <el-option v-for="item in group.children" :key="item.id" :label="item.label" :value="item.id">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="品牌" :label-width="formLabelWidth">
          <el-select v-model="newEdit.brandId" filterable placeholder="请选择">
            <el-option v-for="item in getbrandList" :key="item.brandId" :label="item.brandName" :value="item.brandId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="productPrice" label="产品价格" :label-width="formLabelWidth">
          <el-input v-model="newEdit.productPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="productDetails" label="产品详情" :label-width="formLabelWidth">
          <vue-editor v-model="newEdit.productDetails"></vue-editor>
        </el-form-item>
        <el-form-item prop="description" label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="newEdit.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendNewAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增商品 -->
    <el-dialog title="新增商品" :visible.sync="newgoods">
      <el-form>

                <el-form-item :label-width="formLabelWidth" v-for="(list,index) in attrData.attrList" :key="index" :label="list.productAttr.attrName+'：'">
                <el-checkbox-group v-model="cha">
                  <el-checkbox v-for="(item,index) in list.productAttrValueList" :key="index" :label="item">{{item.valueName}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="商品大图" :label-width="formLabelWidth">
              <el-upload class="avatar-uploader" :action="url+'/imageUpload'" :data="datas" name="file" :show-file-list="false" :on-success="uploadSussBig">
                <img v-if="imageUrl.big" :src="imageUrl.big" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品小图" :label-width="formLabelWidth">
              <el-upload class="avatar-uploader" :action="url+'/imageUpload'" :data="datas" name="file" :show-file-list="false" :on-success="uploadSussSml">
                <img v-if="imageUrl.sml" :src="imageUrl.sml" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="padding:10px;text-align:right;">
            <el-button type="primary" @click="attrListSend" style="display:inline-block">确 定</el-button>
          </el-col>
        </el-row>
        <el-table :data="attrList" border style="width: 100%" max-height="250" class="attrdata" >
          <el-table-column fixed type="index" width="50">
          </el-table-column>
          <el-table-column fixed prop="skuName" label="sku名称" width="140" show-overflow-tooltip>

          </el-table-column>
          <el-table-column prop="attributes" label="属性" min-width="150" show-overflow-tooltip>

          </el-table-column>
          <el-table-column prop="productPrice1" label="普通会员价" width="100">


          </el-table-column>
          <el-table-column prop="productPrice2" label="白金会员价" width="100">

          </el-table-column>
          <el-table-column prop="productPrice3" label="蓝钻会员价" width="100">

          </el-table-column>
          <el-table-column prop="productQuantity" label="数量" width="140">

          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template scope="scope">
             <el-button type="text" size="small" @click="skuEditShow(scope.row)" >
                编辑
              </el-button>
              <el-button type="text" size="small" @click="skuDel(scope.row)" style="color:#ff4949">
                删除
              </el-button>

            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div style="display:none">{{reversedMessage}}</div>

      <!-- {{newEdit.product_details}} -->
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="newgoods = false">取 消</el-button> -->
      </div>

    </el-dialog>

      <!--sku编辑弹出 -->
    <el-dialog class="Edit" title="sku编辑" :visible.sync="skuVisible">
      <el-form>
         <el-form-item label="sku名称:" :label-width="formLabelWidth">
            <el-input v-model="skuData.skuName" disabled auto-complete="off"></el-input>
        </el-form-item>
         <el-form-item label="属性:"  :label-width="formLabelWidth">
            <el-input v-model="skuData.attributes" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="普通价:" :label-width="formLabelWidth">
            <el-input v-model="skuData.productPrice1" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="金卡价:" :label-width="formLabelWidth">
          <el-input v-model="skuData.productPrice2" auto-complete="off"></el-input>
        </el-form-item>
          <el-form-item label="钻卡价:" :label-width="formLabelWidth">
          <el-input v-model="skuData.productPrice3" auto-complete="off"></el-input>
        </el-form-item>
       <el-form-item label="数量:" :label-width="formLabelWidth">
          <el-input v-model="skuData.productQuantity" auto-complete="off"></el-input>
        </el-form-item>

        <el-row>
        <el-col :span="12">
          <el-form-item label="修改大图" :label-width="formLabelWidth">
            <el-upload class="avatar-uploader" :action="url+'/imageUpload'" name="file" :data="datas" :show-file-list="false" :on-success="skuImgSussBig">
              <img v-if="skuImageUrl.big" :src="skuImageUrl.big" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修改小图" :label-width="formLabelWidth">
            <el-upload class="avatar-uploader" :action="url+'/imageUpload'" name="file" :data="datas" :show-file-list="false" :on-success="skuImgSussSml">
              <img v-if="skuImageUrl.sml" :src="skuImageUrl.sml" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        </el-col>
      </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="skuVisible = false">取 消</el-button>
        <el-button type="primary" @click="skuSend">确 定</el-button>
      </div>
    </el-dialog>




  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
export default {
  components: {
    VueEditor
  },
  data() {
    return {
      url: "",
      loading: true,
      skuVisible: false,
      fullscreenLoading: false,
      dialogVisible: false,
      dialogFormVisible: false,
      newVisible: false,
      newgoods: false,
      cha: [],
      formLabelWidth: "120px",
      treeList: [],
      form: {},
      newEdit: {
        productName: "",
        productNxplain: "",
        productType: "",
        productPrice: "",
        productDetails: "",
        description: "",
        productExplain: "",
        categoryId: "",
        brandId: ""
      },
      newEditRules: {
        productName: [
          { required: true, message: "不能为空", trigger: "blur" }
          //{ validator: validaePass }
        ],
        productNxplain: [
          { required: true, message: "不能为空", trigger: "blur" }
          //{ validator: validaePass }
        ],
        productType: [
          { required: true, message: "不能为空", trigger: "blur" }
          //{ validator: validaePass }
        ],
        productPrice: [
          { required: true, message: "不能为空", trigger: "blur" }
          //{ validator: validaePass }
        ],
        productDetails: [
          { required: true, message: "不能为空", trigger: "blur" }
          //{ validator: validaePass }
        ],
        description: [
          { required: true, message: "不能为空", trigger: "blur" }
          //{ validator: validaePass }
        ],
        categoryId: [
          { required: true, message: "不能为空", trigger: "blur" }
          //{ validator: validaePass }
        ],
        productExplain: [
          { required: true, message: "不能为空", trigger: "blur" }
          //{ validator: validaePass }
        ]
      },
      allCategory: "",
      search: {
        pageIndex: 0,
        pageSize: 20,
        productName: "",
        productType: "",
        reviewStatus: "",
        categoryId: ""
      },
      value: "",
      tableData: [],
      multipleSelection: [],
      getbrandList: [],
      goodsSetData: [],
      attrData: {},
      imageUrl: {
        big: "",
        sml: ""
      },
      skuImageUrl: {
        big: "",
        sml: ""
      },
      attrList: [],
      rowData: {},
      attrPushData: {
        values: [],
        bigImage: "",
        smallImage: "",
        productId: ""
      },
      datas: {
        fileType: 5
      },
      skuData: {}
    };
  },
  created() {
    this.url = url;
    this.getList();
  },
  methods: {
    judge(data) {
      switch (data.reviewStatus) {
        case 1:
          return "待审核";
          break;
        case 2:
          return "已上架";
          break;
        default:
          return "已下架";
      }
    },
    getTrees(boo) {
      if (boo == true) {
        this.getTree();
      }
    },
    handleCurrentChange(val) {
      this.search.pageIndex = val - 1;
      this.getList();
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
    //获取品牌
    getbrandId() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindProductBrandByCategoryId",
        data: {
          categoryId: that.allCategory
        }
      }).then(function(res) {
        that.getbrandList = res.data.data;
      });
    },
    //选择框改变时获取
    changeCategoryId(row) {
      this.allCategory = row;
      this.getbrandId();
    },
    getList() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindProductList",
        data: that.search
      }).then(function(res) {
        that.loading = false;
        that.tableData = res.data.data;
        that.allCategory = res.data.data.dataList[0].categoryId;
      });
    },
    //搜索商品
    getSearch() {
      this.getList();
    },
    //新增产品
    newEdits() {
      this.newVisible = true;
      this.newEdit = {
        productName: "",
        productExplain: "",
        productType: "",
        productPrice: "",
        productDetails: "",
        description: "",
        categoryId: "",
        brandId: ""
      };
    },
    //新增发送
    sendNewAdd() {
      let that = this;
      // console.log(9);
      this.$refs.newEdit.validate(valid => {
        if (valid) {
          this.$http({
            method: "post",
            url: url + "/clientProductAddInfo",
            data: that.newEdit
          }).then(function(res) {
            if (res.data.apiStatus == 1) {
              that.getList();
              that.newVisible = false;
              that.$message({
                message: res.data.msg,
                type: "success"
              });
            } else {
              that.$message.error(res.data.msg);
            }
          });
        } else {
          // console.log(0);
        }
      });
    },
    //编辑获取数据
    getEditData(data) {
      let that = this;

      this.$http({
        method: "post",
        url: url + "/clientFindProductByProductId",
        data: {
          productId: data
        }
      }).then(function(res) {
        that.form = res.data.data;
        console.log(that.form);
      });
    },
    //编辑发送
    sendEdit() {
      let that = this;
      let form = that.form;
      this.$http({
        method: "post",
        url: url + "/clientProductModifyProductInfo",
        data: form
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
    //新增商品
    newGoods(row) {
      this.newgoods = true;
      let that = this;
      let form = that.form;
      this.rowData = row;
      this.getgoodsList();
      this.$http({
        method: "post",
        url: url + "/clientFindAttrAndSkuInfoList",
        data: {
          categoryId: row.categoryId,
          productId: row.productId
        }
      }).then(function(res) {
        that.attrData = res.data.data;
      });
    },
    //大图上传成功
    uploadSussBig(response, file, fileList) {
      this.imageUrl.big = URL.createObjectURL(file.raw);
      this.attrPushData.bigImage = response.data;
    },
    //上传小图
    uploadSussSml(response, file, fileList) {
      this.imageUrl.sml = URL.createObjectURL(file.raw);
      this.attrPushData.smallImage = response.data;
    },
    //上下架
    putaway(reviewStatus, row) {
      let that = this;
      this.$confirm("是否确定？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that
            .$http({
              method: "post",
              url: url + "/clientReviewProduct",
              data: {
                productId: row.productId,
                reviewStatus: reviewStatus
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
            message: "已取消"
          });
        });
    },
    // 查询商品属性列表
    getgoodsList() {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindSkuListByProductId",
        data: {
          productId: that.rowData.productId
        }
      }).then(function(res) {
        that.attrList = res.data.data;
      });
    },
    //sku储存
    skuSave(row) {
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientUpdateSkuPriceQuantity",
        data: {
          productPrice1: row.productPrice1,
          productPrice2: row.productPrice2,
          productPrice3: row.productPrice3,
          productQuantity: row.productQuantity,
          skuId: row.skuId
        }
      }).then(function(res) {
        if (res.data.apiStatus == 1) {
          that.$message({
            message: res.data.msg,
            type: "success"
          });
        } else {
          that.$message.error(res.data.msg);
        }
      });
    },
    skuDel(row) {
      let that = this;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // that.fullscreenLoading = true;
          that
            .$http({
              method: "post",
              url: url + "/productDeleteSkuBySkuId",
              data: {
                skuId: row.skuId
              }
            })
            .then(function(res) {
              if (res.data.apiStatus == 1) {
                that.getgoodsList();
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
    //所有列表数据储存
    attrListSend() {
      let that = this;
      this.attrPushData.productId = this.rowData.productId;
      this.$http({
        method: "post",
        url: url + "/clientAddProductSkuInfo",
        data: that.attrPushData
      }).then(function(res) {
        if (res.data.apiStatus == 1) {
          that.$message({
            message: res.data.msg,
            type: "success"
          });
          that.getgoodsList();
        } else {
          that.$message.error(res.data.msg);
        }
      });
    },
    handleEdit(row) {
      this.dialogFormVisible = true;

      this.getEditData(row.productId);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // sku编辑
    skuEditShow(row) {
      this.skuVisible = true;
      let that = this;
      this.$http({
        method: "post",
        url: url + "/clientFindSkuInfoBySkuId",
        data: {
          skuId: row.skuId
        }
      }).then(function(res) {
        that.skuData = res.data.data;
        that.skuImageUrl.big = url + "/" + res.data.data.picBig;
        that.skuImageUrl.sml = url + "/" + res.data.data.picSmall;
      });
    },
    skuImgSussBig(response, file, fileList) {
      this.skuImageUrl.big = URL.createObjectURL(file.raw);
      this.skuData.picBig = response.data;
    },
    skuImgSussSml(response, file, fileList) {
      this.skuImageUrl.sml = URL.createObjectURL(file.raw);
      this.skuData.picSmall = response.data;
    },

    //sku编辑保存
    skuSend() {
      let that = this;
      this.skuData.productPrice = this.skuData.productPrice1;
      this.$http({
        method: "post",
        url: url + "/clientUpdateSkuInfoBySkuId",
        data: this.skuData
      }).then(function(res) {
        if (res.data.apiStatus == 1) {
          that.skuVisible = false;
          that.getgoodsList();
          that.$message({
            message: res.data.msg,
            type: "success"
          });
        } else {
          that.$message.error(res.data.msg);
        }
      });
    }
  },
  computed: {
    reversedMessage: function() {
      var bos = {};
      for (let i = 0; i < this.cha.length; i++) {
        if (bos[this.cha[i].attrId]) {
          bos[this.cha[i].attrId].push({ vId: this.cha[i].vId });
        } else {
          bos[this.cha[i].attrId] = [{ vId: this.cha[i].vId }];
        }
      }
      var arry = [];
      for (var key in bos) {
        arry.push(bos[key]);
      }
      this.attrPushData.values = arry;
      return arry;
    }
  },
  mounted() {
    // let that = this;
    // this.$http({
    //   method: "post",
    //   url: url + "/clientFindSkuInfoBySkuId",
    //   data: that.attrPushData
    // }).then(function(res) {
    //   if (res.data.apiStatus == 1) {
    //     that.$message({
    //       message: res.data.msg,
    //       type: "success"
    //     });
    //     that.getgoodsList();
    //   } else {
    //     that.$message.error(res.data.msg);
    //   }
    // });
  }
};
</script>
<style lang="scss" scoped>
.el-table th > .cell {
  text-align: center;
}
</style>
<style lang="scss">
.goodsList {
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



