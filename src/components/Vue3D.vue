<template>
  <div class="vue3d">
    <h1>{{ msg }}</h1>
    <h3>{{ about }}<br/>
      Source <a v-bind:href="linkto"> vue3d </a> Contact <a v-bind:href="mailto">GreenPDX</a></h3>
    <div id="three3d" class="three3d" ref="three3d">
      <h2>{{ selectIt }}</h2>
      <v3d-renderer ref="renderer" size="800,800">
        <v3d-scene ref="scene">
          <v3d-orbit-controls ref="controls">
            <v3d-camera ref="camera0" position="{z: 150}"></v3d-camera>
          </v3d-orbit-controls>
          <v3d-light color="#ffffff"></v3d-light>
          <v3d-group position="{'x': 0, 'y': 0, 'z': 0}">
            <!-- v3d-mesh visible="false">
              <v3d-geometry type="Cylinder" args="25,25,15,6,1,true" ref="cyl">
                <v3d-material type="Standard" color="#00ff00" side="Double"></v3d-material>
                <v3d-material type="Standard" color="#0000ff"></v3d-material>
                <!-- v3d-material type="Standard" color="#ff00ff"></v3d-material>
                <v3d-material type="Standard" color="#ffff00"></v3d-material -->
              <!-- /v3d-geometry>
            </v3d-mesh -->
            <v3d-mesh>
              <v3d-geometry type="Cylinder" args="20,20,10,6,1,true" ref="cyl"></v3d-geometry>
              <v3d-material type="Normal" color="#00ffff"></v3d-material>
              <v3d-material type="Standard" color="#ff0000" ref="mat"></v3d-material>
            </v3d-mesh>
          </v3d-group>
        </v3d-scene>
      </v3d-renderer>
      <div v-show="showInfo" class="infopop" ref="infopop">
        <div >{{ objInfo.uuid }}</div>
      </div>
    </div>
    <div class="right">
      <h3>Template Code</h3>
      <button v-on:click="tstClick($event)">Test button</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
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
import Group from '@/components/Group'

Vue.component('v3d-renderer', Renderer)
Vue.component('v3d-scene', Scene)
Vue.component('v3d-camera', Camera)
Vue.component('v3d-light', Light)
Vue.component('v3d-mesh', Mesh)
Vue.component('v3d-geometry', Geometry)
Vue.component('v3d-material', Material)
Vue.component('v3d-orbit-controls', OrbitControls)
Vue.component('v3d-group', Group)

export default {
  name: 'vue3d',
  data () {
    return {
      msg: 'Vue and Three JS test project',
      version3d: '',
      objInfo: '',
      threeSize: {w: '800px', h: '800px'},
      selectIt: 'Double click to select cube, mouse down to rotate, wheel to zoom',
      about: '3D framework for vue ',
      linkto: 'https://github.com/greenpdx/vue3d',
      mailto: 'mailto:savages@taxnvote.org?subject=vue3d%20Demo%20',
      grppos: {'x': 0, 'y': 10, 'z': 0}
    }
  },

  created () {
    this.version3d = THREE.REVISION
    let http = Vue.http
    console.log('HTTP', http)
    let rand = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 1))
    this.mailto = this.mailto + document.referrer + '&body=Please Keep; ' + rand
    this.setThree3d(this)
  },

  mounted () {
    let ele = this.$refs.infopop
    ele.style.top = this.mySize.top + 'px'
    ele.style.left = this.mySize.left + 'px'
  },

  computed: {
    ...mapGetters('three3d', {
      renderer: 'renderer',
      scene: 'scene',
      cameraV: 'camera'
    }),
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
  },
  methods: {
    ...mapActions('three3d', [
      'setThree3d'
    ]),
    tstClick (evt) {
      console.log(evt)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vue3d {
    display: inline;
}
.three3d {
  float: left;
  width: 48%;
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
.right {
  float: right;
  width: 45%;
  text-align: left;
  font-size: 1.2em;
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
