<template>
  <div class="vue3d">
    <h1>{{ msg }}</h1>
    <div id="three3d" class="three3d" ref="three3d">
      <v3d-renderer ref="renderer" :size="this.threeSize">
        <v3d-scene ref="scene">
          <v3d-camera :control="true" ref="camera0">
          </v3d-camera>
          <v3d-light color="#ffffff"></v3d-light>
          <v3d-mesh>
            <v3d-geometry type="Box" args="20,20,20" ref="geo">
              <v3d-material type="Standard" color="#ff0000" ref="mat"></v3d-material>
              <v3d-material type="Standard" color="#00ff00"></v3d-material>
              <v3d-material type="Standard" color="#0000ff"></v3d-material>
              <v3d-material type="Standard" color="#ff00ff"></v3d-material>
              <v3d-material type="Standard" color="#ffff00"></v3d-material>
              <v3d-material type="Normal" color="#00ffff"></v3d-material>
            </v3d-geometry>
          </v3d-mesh>
        </v3d-scene>
      </v3d-renderer>
      <div v-show="showInfo" class="infopop" ref="infopop">
        <div >{{ objInfo.uuid }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import * as THREE from 'three'

// import Object3D from '@/components/Object3D'
import Renderer from '@/components/Renderer'
import Scene from '@/components/Scene'
import Camera from '@/components/Camera'
import Light from '@/components/Light'
import Mesh from '@/components/Mesh'
import Geometry from '@/components/Geometry'
import Material from '@/components/Material'
import OrbitControls from '@/components/OrbitControls'

Vue.component('v3d-renderer', Renderer)
Vue.component('v3d-scene', Scene)
Vue.component('v3d-camera', Camera)
Vue.component('v3d-light', Light)
Vue.component('v3d-mesh', Mesh)
Vue.component('v3d-geometry', Geometry)
Vue.component('v3d-material', Material)
Vue.component('v3d-orbit-controls', OrbitControls)

export default {
  name: 'vue3d',
  data () {
    return {
      msg: 'Vue and Three JS test project',
      version3d: '',
      objInfo: '',
      threeSize: {w: '800px', h: '800px'}
    }
  },

  created () {
    this.version3d = THREE.REVISION
  },

  mounted () {
    let ele = this.$refs.infopop
    ele.style.top = this.mySize.top + 'px'
    ele.style.left = this.mySize.left + 'px'
  },

  computed: {
    ...mapGetters({
      hoverObj: 'hoverObj',
      selectObj: 'selectObj'
    }),
    showInfo: function () {
      if (this.hoverObj !== null) {
        this.objInfo = this.hoverObj
        return true
      } else {
        this.objInfo = ''
        return false
      }
    },
    mySize: function () {
      let ren = this.$refs.renderer.$el
      return {
        top: ren.offsetTop,
        left: ren.offsetLeft,
        width: ren.offsetWidth,
        height: ren.offsetHeight,
        bottom: ren.offsetTop + ren.offsetHeight,
        right: ren.offsetLeft + ren.offsetWidth
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.three3d {
  width: 800px;
  height: 800px;
}
.infopop {
  border: 2 solid black;
  width: 30em;
  height: 100px;
  position: absolute;
  display: inline-block;
  top: 0px;
  left: 0px;
  background-color: yellow;
  z-index: 10;
}
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
