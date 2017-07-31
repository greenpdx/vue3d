import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'

Vue.use(Vuex)

import three3d from './modules/three3d'
import nodes from './modules/nodes'

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
    if (self === null) {
      if (state.hoverObj !== null) {
        state.hoverObj.hover(false)
        state.hoverObj = null
      }
      return
    }
    console.log('HOVER', self, state.hoverObj)
    if (self.id3d === state.id3d) {
      return
    }
    if (state.hoverObj !== null) {
      state.hoverObj.hover(false)
    }
    state.hoverObj = self
    self.hover(true)
  },
  SELECT (state, self) {
    if (self === null) {    // unslect
      if (state.selectObj !== self) {
        state.selectObj.select(false)
        state.selectObj = null
      }
      return
    }
    console.log('SELECT', self, state.selectObj)
    if (self !== state.selectObj) {
      if (state.selectObj !== null) {
        state.selectObj.select(false)
      }  // select new
      self.select(true)
      state.selectObj = self
    } else {    // unselect
      self.select(false)
      state.selectObj = null
    }
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
  three3d: three3d,
  nodes: nodes
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
