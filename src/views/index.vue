<template>
  <div class="app-container home">
    <el-row :gutter="10">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>火影忍者手游组织管理系统</h2>
        <p>
          一直想做一款火影忍者手游管理系统，看了很多优秀的开源项目但是发现没有合适自己的。于是利用空闲休息时间使用若依为模板开始自己开发一套后台系统。系统主要功能是围绕组织展开的，包括组织的人员管理，例如学员、成员的信息，其次还有像一些组织活动，如天地战场、要塞争夺战、叛忍等等活动的管理、安排、统计、通知等等功能，
        </p>
        <p>
          <el-button type="primary" size="mini" icon="el-icon-cloudy" plain
            @click="goTarget('https://gitee.com/y_project/RuoYi-Vue')">访问码云</el-button>
          <el-button size="mini" icon="el-icon-s-home" plain @click="goTarget('http://ruoyi.vip')">访问主页</el-button>
        </p>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <img src="https://cloud.greennut.icu/naturo/club.jpg" alt="描述图片内容" style="max-width: 100%; max-height: 300px;">

      </el-col>
    </el-row>
    <el-divider />

    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>组织成员战力统计</span>
          </div>
          <div class="body">
            <p>
              <i class="el-icon-s-promotion"></i> 首领：许你一世长安
            </p>
            <p>
              <i class="el-icon-user-solid"></i> QQ群： <a href="https://qm.qq.com/q/cUvp5NyQeI"
                target="_blank">818555899</a>
            </p>
            <!-- 此处下面遍历 -->
            <!-- 遍历后端获取的集合 -->
            <div v-for="(item, index) in memberList" :key="index">
              <p>
                <el-button type="primary" size="mini" icon="el-icon-cloudy" plain>战力区间 {{ item.name }}</el-button>
                <i class="el-icon-right"></i>
                <el-button size="mini" plain>{{ item.count }}人</el-button>

              </p>
              <!-- 根据实际数据结构调整显示内容 -->
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18" style="padding-left: 20px">
        <BarChart className="my-chart" width="100%" height="400px" />
      </el-col>
    </el-row>
    <el-divider />


  </div>
</template>

<script>
import BarChart from './dashboard/BarChart.vue'; // 导入BarChart.vue组件
import { getPowerBetween } from "@/api/naruto/member";


export default {
  name: "Index",
  components: {
    BarChart // 在components中注册BarChart组件
  },
  data() {
    return {
      // 版本号
      version: "3.8.7",
      memberList: []
    };
  },
  mounted() {
    this.handlerPowerBetween();
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
    handlerPowerBetween() {
      getPowerBetween().then(response => {
        this.memberList = response.data;
      })
    }
  }
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans",
  "Helvetica Neue",
  Helvetica,
  Arial,
  sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>
