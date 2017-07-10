import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'

Vue.use(Vuex)

// const debug = process.env.NODE_ENV !== 'production'

const state = {
  hoverObj: null,
  selectObj: null,
  wheelChg: 0
}

const getters = {
  hoverObj: state => state.hoverObj,
  selectObj: state => state.selectObj,
  wheelChg: state => state.wheelChg
}

const mutations = {
  HOVER (state, self) {
    this.dbgPrt('HOVER', self.uuid)
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
    this.dbgPrt('store wheel', val, state.selectObj)
  }
}
const actions = {
  hover ({
    commit
  }, obj) {
    commit('HOVER', obj)
  },
  select ({
    commit
  }, obj) {
    commit('SELECT', obj)
  },
  wheelChg ({
    commit
  }, obj) {
    commit('WHEEL', obj)
  }
}

const modules = {

}
// strict = debug
//  plugins: debug ? [createLogger()] : []
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules
})
