<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="饰品类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择饰品类型" clearable>
          <el-option v-for="dict in dict.type.sys_accessory_type" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="组织成员" prop="nickname">
        <el-input v-model="queryParams.nickname" placeholder="请输入组织成员昵称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="起始时间" prop="startTime">
        <el-date-picker clearable v-model="queryParams.startTime" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择周起始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['naruto:accessory:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['naruto:accessory:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['naruto:accessory:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['naruto:accessory:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="accessoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="饰品类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_accessory_type" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="组织成员昵称" align="center" prop="nickname" />
      <el-table-column label="起始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['naruto:accessory:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['naruto:accessory:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改晓组织饰品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="饰品类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择饰品类型">
            <el-option v-for="dict in dict.type.sys_accessory_type" :key="dict.value" :label="dict.label"
              :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织成员" prop="memberId">
          <el-select v-model="form.memberId" placeholder="请选择组织成员" clearable>
            <el-option v-for="member in members" :key="member.id" :label="member.nickname"
              :value="member.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始时间" prop="startTime">
          <el-date-picker clearable v-model="form.startTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择周起始时间">
          </el-date-picker>
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
import { listAccessory, getList, getAccessory, delAccessory, addAccessory, updateAccessory } from "@/api/naruto/accessory";
import { listMemberAll } from "@/api/naruto/member";

export default {
  name: "Accessory",
  dicts: ['sys_accessory_type'],
  data() {
    return {
      loading: true,
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      accessoryList: [],
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        nickname: null,
        startTime: null
      },
      form: {
        type: null,
        memberId: null,
        startTime: null
      },
      rules: {},
      members: [], // 存储成员列表
      selectedRows: [] // 选中的行数据
    };
  },
  created() {
    this.getList();
    this.loadMembers(); // 加载成员列表
  },
  methods: {
    getList() {
      this.loading = true;
      getList(this.queryParams).then(response => {
        this.accessoryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加晓组织饰品";
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getAccessory(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改晓组织饰品";
      });
    },
    submitForm() {
      if (this.form.id) {
        // 如果表单中有 id，说明是更新操作
        updateAccessory({
          id: this.form.id,
          type: this.form.type,
          mId: this.form.memberId,
          startTime: this.form.startTime
        }).then(response => {
          this.$message.success("修改成功");
          this.open = false;
          this.getList();
        }).catch(error => {
          console.error("修改失败", error);
        });
      } else {
        // 否则是新增操作
        addAccessory({
          type: this.form.type,
          mId: this.form.memberId,
          startTime: this.form.startTime
        }).then(response => {
          this.$message.success("新增成功");
          this.open = false;
          this.getList();
        }).catch(error => {
          console.error("添加失败", error);
        });
      }
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除晓组织饰品编号为"' + ids + '"的数据项？').then(() => {
        return delAccessory(ids);
      }).then(() => {
        this.getList();
        this.$message.success("删除成功");
      }).catch(() => { });
    },
    handleExport() {
      // 导出功能
    },
    handleSelectionChange(selection) {
      this.multiple = selection.length === 0;
      this.single = selection.length !== 1;
      this.selectedRows = selection;
    },
    handleMemberChange(value) {
      const selectedMember = this.members.find(member => member.id === value);
      if (selectedMember) {
        this.form.memberId = selectedMember.id;
      }
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        id: null,
        type: null,
        memberId: null,
        startTime: null
      };
      this.resetForm("form");
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    loadMembers() {
      listMemberAll().then(response => {
        this.members = response.data;
      });
    }
  }
};
</script>
