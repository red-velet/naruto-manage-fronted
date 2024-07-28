<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="发件人" prop="fromMember">
        <el-input v-model="queryParams.fromMember" placeholder="请输入发件人" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="收件人" prop="toMember">
        <el-input v-model="queryParams.toMember" placeholder="请输入收件人" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="主题" prop="subject">
        <el-input v-model="queryParams.subject" placeholder="请输入主题" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="邮件状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择邮件状态" clearable>
          <el-option v-for="dict in dict.type.sys_mail_state" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间" prop="sendTime">
        <el-date-picker clearable v-model="queryParams.sendTime" type="date" value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择发送时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="错误原因" prop="reason">
        <el-input v-model="queryParams.reason" placeholder="请输入错误原因" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['naruto:emailRecord:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['naruto:emailRecord:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['naruto:emailRecord:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['naruto:emailRecord:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="emailRecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="编号" align="center" prop="id" /> -->
      <el-table-column label="发件人" align="center" prop="fromMember" />
      <el-table-column label="收件人" align="center" prop="toMember" />
      <el-table-column label="主题" align="center" prop="subject" />
      <el-table-column label="邮件状态" align="center" prop="state">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_mail_state" :value="scope.row.state" />
        </template>
      </el-table-column>
      <el-table-column label="发送时间" align="center" prop="sendTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.sendTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="错误原因" align="center" prop="reason" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['naruto:emailRecord:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['naruto:emailRecord:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改通知邮件管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="发件人" prop="fromMember">
          <el-input v-model="form.fromMember" placeholder="请输入发件人" />
        </el-form-item>
        <el-form-item label="收件人" prop="toMember">
          <el-input v-model="form.toMember" placeholder="请输入收件人" />
        </el-form-item>
        <el-form-item label="主题" prop="subject">
          <el-input v-model="form.subject" placeholder="请输入主题" />
        </el-form-item>
        <el-form-item label="邮件状态" prop="state">
          <el-radio-group v-model="form.state">
            <el-radio v-for="dict in dict.type.sys_mail_state" :key="dict.value" :label="parseInt(dict.value)">{{
      dict.label
    }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发送时间" prop="sendTime">
          <el-date-picker clearable v-model="form.sendTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择发送时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="错误原因" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入错误原因" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listEmailRecord, getEmailRecord, delEmailRecord, addEmailRecord, updateEmailRecord } from "@/api/naruto/emailRecord";

export default {
  name: "EmailRecord",
  dicts: ['sys_mail_state'],
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
      // 通知邮件管理表格数据
      emailRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fromMember: null,
        toMember: null,
        subject: null,
        state: null,
        sendTime: null,
        reason: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询通知邮件管理列表 */
    getList() {
      this.loading = true;
      listEmailRecord(this.queryParams).then(response => {
        this.emailRecordList = response.rows;
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
        fromMember: null,
        toMember: null,
        subject: null,
        state: null,
        sendTime: null,
        reason: null
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
      this.title = "添加通知邮件管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEmailRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改通知邮件管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEmailRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEmailRecord(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除通知邮件管理编号为"' + ids + '"的数据项？').then(function () {
        return delEmailRecord(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('naruto/emailRecord/export', {
        ...this.queryParams
      }, `emailRecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
