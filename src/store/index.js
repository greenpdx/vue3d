import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'

Vue.use(Vuex)

import three3d from './modules/three3d'

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
    if ((!self && !state.hoverObj) || (self && state.hoverObj && self.uuid === state.hoverObj.uuid)) {
      return
    }
//    console.log('HOVER', (self) ? self.id3d : 'null')
    if (!self || (state.hoverObj && self.uuid !== state.hoverObj.uuid)) {
      state.hoverObj.hover(false)
      state.hoverObj = null
    }
    if (self) {
      state.hoverObj = self
      self.hover(true)
    }
  },
  SELECT (state, self) {
    if (self && state.selectObj === self) {
      state.selectObj.select(false)
      self = null
    }
    if (self && self !== state.selectObj) {
      self.select(true)
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
  three3d: three3d
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
