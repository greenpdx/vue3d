const state = {
  three3d: null,
  scene: null,
  renderer: null,
  camera: null,
  orbit: null,
  mats: {}
}

const getters = {
  three3d: state => state.three3d,
  scene: state => state.scene,
  renderer: state => state.renderer,
  camera: state => state.camera,
  orbit: state => state.orbit,
  materials: state => state.mats
}

const mutations = {
  THREE3D (state, three3d) {
    if (!state.three3d) {
      state.three3d = three3d
    }
  },
  SCENE (state, scene) {  // add multipule scenes
    if (!state.scene) {
      state.scene = scene
    }
  },
  RENDERER (state, ren) {
    if (!state.renderer) {
      state.renderer = ren
    }
  },
  CAMERA (state, cam) {   // add multipule cameras
    if (!state.camera) {
      state.camera = cam
    }
  },
  ORBIT (state, orbit) {
    if (!state.orbit) {
      state.orbit = orbit
    }
  },
  MATS (state, mat) {
    state.mats[mat.name] = mat
  }
}

const actions = {
  setThree3d ({commit}, three3d) {
    commit('THREE3D', three3d)
  },
  setScene ({commit}, scene) {
    commit('SCENE', scene)
  },
  setRenderer ({commit}, ren) {
    commit('RENDERER', ren)
  },
  setCamera ({commit}, cam) {
    commit('CAMERA', cam)
  },
  setOrbit ({commit}, orbit) {
    commit('ORBIT', orbit)
  },
  setMaterial ({commit}, mat) {
    commit('MATS', mat)
  }
}

const three3d = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

export default three3d
