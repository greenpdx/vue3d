import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    hoverObj: null,
    selectObj: null,
    wheelChg: 0
  },

  getters: {
    hoverObj: state => {
      return state.hoverObj
    },
    selectObj: state => {
      return state.selectObj
    },
    wheelChg: state => {
      return state.wheelChg
    }
  },

  mutations: {
    HOVER (state, self) {
      console.log('HOVER', self.uuid)
      if (state.hoverObj && self.uuid !== state.hoverObj.uuid) {
        state.hoverObj.vue.hover(false)
        state.hoverObj = null
      }
      if (self) {
        state.hoverObj = self
        self.vue.hover(true)
      }
    },
    SELECT (state, self) {
      if (self && state.selectObj === self) {
        state.selectObj.vue.select(false)
        self = null
      }
      if (self && self !== state.selectObj) {
        self.vue.select(true)
      }
      state.selectObj = self
    },
    WHEEL (state, obj) {
//      let node = obj.obj
      let val = obj.val
      console.log('store wheel', val, state.selectObj)
    }
  },
  actions: {
    hover ({commit}, obj) {
      commit('HOVER', obj)
    },
    select ({commit}, obj) {
      commit('SELECT', obj)
    },
    wheelChg ({commit}, obj) {
      commit('WHEEL', obj)
    }
  },
  modules: {

  },
  strict: debug
//  plugins: debug ? [createLogger()] : []
})
