<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="游戏ID" prop="nId">
        <el-input v-model="queryParams.nId" placeholder="请输入游戏ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="游戏昵称" prop="nickname">
        <el-input v-model="queryParams.nickname" placeholder="请输入游戏昵称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="身份类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择身份类型" clearable>
          <el-option v-for="dict in dict.type.sys_member_type" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择状态" clearable>
          <el-option v-for="dict in dict.type.sys_member_state" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="战力" prop="power">
        <el-input v-model="queryParams.power" placeholder="请输入战力" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="qq" prop="qq">
        <el-input v-model="queryParams.qq" placeholder="请输入qq" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="最近加入">
        <el-date-picker v-model="daterangeJoinTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="首次加入">
        <el-date-picker v-model="daterangeCreatedTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :disabled="true"></el-date-picker>
      </el-form-item>
      <el-form-item label="退出时间">
        <el-date-picker v-model="daterangeUpdatedTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :disabled="true"></el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['naruto:member:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['naruto:member:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['naruto:member:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport"
          v-hasPermi="['naruto:member:import']">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['naruto:member:export']">导出</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>


    <el-table v-loading="loading" :data="memberList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" v-if="columns[0].visible" />
      <el-table-column label="游戏ID" align="center" prop="nId" v-if="columns[1].visible" />
      <el-table-column label="游戏昵称" align="center" prop="nickname" v-if="columns[2].visible" />
      <el-table-column label="身份类型" align="center" prop="type" v-if="columns[3].visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_member_type" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="state" v-if="columns[4].visible">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_member_state" :value="scope.row.state" />
        </template>
      </el-table-column>
      <el-table-column label="战力" align="center" prop="power" v-if="columns[5].visible" />
      <el-table-column label="qq" align="center" prop="qq" v-if="columns[6].visible" />
      <el-table-column label="最近加入" align="center" prop="joinTime" width="180" v-if="columns[7].visible">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.joinTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="退出时间" align="center" prop="updatedTime" width="180" v-if="columns[9].visible">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatedTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="首次加入" align="center" prop="createdTime" width="180" v-if="columns[8].visible">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <!-- 新添加的列：加入组织天数 -->
      <el-table-column label="加入组织天数" align="center" v-if="columns[10].visible">
        <template slot-scope="scope">
          <span v-if="scope.row.state !== '0'">
            {{
      Math.ceil(
        (new Date().getTime() - new Date(scope.row.joinTime).getTime()) / (1000 * 60 * 60 * 24)
      )
    }}
          </span>
          <span v-else>-</span> <!-- 如果已退出，则显示 '-' -->
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:member:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:member:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改成员信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="游戏ID" prop="nId">
          <el-input v-model="form.nId" placeholder="请输入游戏ID" />
        </el-form-item>
        <el-form-item label="游戏昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入游戏昵称" />
        </el-form-item>
        <el-form-item label="身份类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio v-for="dict in dict.type.sys_member_type" :key="dict.value" :label="parseInt(dict.value)">{{
      dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="form.state">
            <el-radio v-for="dict in dict.type.sys_member_state" :key="dict.value" :label="parseInt(dict.value)">{{
      dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="战力" prop="power">
          <el-input v-model="form.power" placeholder="请输入战力" />
        </el-form-item>
        <el-form-item label="qq" prop="qq">
          <el-input v-model="form.qq" placeholder="请输入qq" />
        </el-form-item>
        <el-form-item label="最近加入" prop="joinTime">
          <el-date-picker clearable v-model="form.joinTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择最近加入">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="首次加入" prop="createdTime">
          <el-date-picker clearable v-model="form.createdTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择首次加入">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退出时间" prop="updatedTime">
          <el-date-picker clearable v-model="form.updatedTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择退出时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 成员导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
            @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>


</template>

<script>
import { listMember, getMember, delMember, addMember, updateMember } from "@/api/naruto/member";
import { getToken } from "@/utils/auth";

export default {
  name: "Member",
  dicts: ['sys_member_type', 'sys_member_state'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 成员信息表格数据
      memberList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 退出时间时间范围
      daterangeJoinTime: [],
      // 退出时间时间范围
      daterangeCreatedTime: [],
      // 退出时间时间范围
      daterangeUpdatedTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nId: null,
        nickname: null,
        type: null,
        state: null,
        power: null,
        qq: null,
        joinTime: null,
        createdTime: null,
        updatedTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: false },
        { key: 1, label: `游戏ID`, visible: true },
        { key: 2, label: `游戏昵称`, visible: true },
        { key: 3, label: `身份类型`, visible: true },
        { key: 4, label: `状态`, visible: true },
        { key: 5, label: `战力`, visible: true },
        { key: 6, label: `qq`, visible: true },
        { key: 7, label: `最近时间`, visible: true },
        { key: 8, label: `首次加入时间`, visible: false },
        { key: 9, label: `退出时间`, visible: false },
        { key: 10, label: `加入天数`, visible: true },
      ],
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询成员信息列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeJoinTime && '' != this.daterangeJoinTime) {
        this.queryParams.params["beginJoinTime"] = this.daterangeJoinTime[0];
        this.queryParams.params["endJoinTime"] = this.daterangeJoinTime[1];
      }
      if (null != this.daterangeCreatedTime && '' != this.daterangeCreatedTime) {
        this.queryParams.params["beginCreatedTime"] = this.daterangeCreatedTime[0];
        this.queryParams.params["endCreatedTime"] = this.daterangeCreatedTime[1];
      }
      if (null != this.daterangeUpdatedTime && '' != this.daterangeUpdatedTime) {
        this.queryParams.params["beginUpdatedTime"] = this.daterangeUpdatedTime[0];
        this.queryParams.params["endUpdatedTime"] = this.daterangeUpdatedTime[1];
      }
      listMember(this.queryParams).then(response => {
        this.memberList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        nId: null,
        nickname: null,
        type: null,
        state: null,
        power: null,
        qq: null,
        joinTime: null,
        createdTime: null,
        updatedTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeJoinTime = [];
      this.daterangeCreatedTime = [];
      this.daterangeUpdatedTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加成员信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMember(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改成员信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMember(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMember(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除成员信息编号为"' + ids + '"的数据项？').then(function () {
        return delMember(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/user/importTemplate', {
      }, `user_template_${new Date().getTime()}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('naruto/member/export', {
        ...this.queryParams
      }, `member_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
