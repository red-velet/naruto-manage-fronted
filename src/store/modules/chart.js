// 在 Vuex 中定义状态管理模块
// store/modules/chart.js

import { getPowerChart } from "@/api/naruto/member";

const state = {
  seriesData: []  // 存放柱状图数据
};

const mutations = {
  setSeriesData(state, data) {
    state.seriesData = data;
  }
};

const actions = {
  fetchPowerChart({ commit }, xAxisData) {
    return getPowerChart(xAxisData)
      .then(response => {
        commit('setSeriesData', response.data);
      })
      .catch(error => {
        console.error('Error fetching power chart data:', error);
      });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
