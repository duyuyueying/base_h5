
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: '',
  },
  mutations: {
    SET_ADDRESS (state, data) {
      state.address = data
    },
  },
  actions: {
  },
  modules: {
  }
})
