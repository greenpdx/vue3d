const state = {
  dataNodes: [],
  nodes: {}
}

const getters = {
  nodes: state => state.dataNodes,
  dumpNodes: function (state) {
    return state.dataNodes
  }
}

const mutations = {
  SETNODES (state, nodes) {
    if (state.dataNodes.length === 0) {
      state.dataNodes = nodes
      nodes.forEach(function (itm, idx) {
        state.nodes[itm._id] = idx
      })
    }
  },
  CLRNODES (state) {
    state.dataNodes = []
  }
}

const actions = {
  setNodes ({commit}, nodes) {
    commit('SETNODES', nodes)
  },
  clearNodes ({commit}) {
    commit('CLRNODES')
  },
  getNodeById ({commit}, id) {
    return state.dataNodes.find(node => node._id === id)
  }
}

const nodes = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export default nodes
