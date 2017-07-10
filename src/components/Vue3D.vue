<template>
  <div class="vue3d">
    <h1>{{ msg }}</h1>
    <h3>{{ about }}<br/>
      Source <a v-bind:href="linkto"> vue3d </a> Contact <a v-bind:href="mailto">GreenPDX</a></h3>
    <div id="three3d" class="three3d" ref="three3d">
      <h2>{{ selectIt }}</h2>
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
    <div class="right">
      <h3>Template Code</h3>
      <pre>    &lt;div id=&quot;three3d&quot; class=&quot;three3d&quot; ref=&quot;three3d&quot;&gt;<br />
      &lt;v3d-renderer ref=&quot;renderer&quot; :size=&quot;this.threeSize&quot;&gt;<br />
        &lt;v3d-scene ref=&quot;scene&quot;&gt;<br />
          &lt;v3d-camera :control=&quot;true&quot; ref=&quot;camera0&quot;&gt;<br />
          &lt;/v3d-camera&gt;<br />
          &lt;v3d-light color=&quot;#ffffff&quot;&gt;&lt;/v3d-light&gt;<br />
          &lt;v3d-mesh&gt;<br />
            &lt;v3d-geometry type=&quot;Box&quot; args=&quot;20,20,20&quot; ref=&quot;geo&quot;&gt;<br />
              &lt;v3d-material type=&quot;Standard&quot; color=&quot;#ff0000&quot; ref=&quot;mat&quot;&gt;&lt;/v3d-material&gt;<br />
              &lt;v3d-material type=&quot;Standard&quot; color=&quot;#00ff00&quot;&gt;&lt;/v3d-material&gt;<br />
              &lt;v3d-material type=&quot;Standard&quot; color=&quot;#0000ff&quot;&gt;&lt;/v3d-material&gt;<br />
              &lt;v3d-material type=&quot;Standard&quot; color=&quot;#ff00ff&quot;&gt;&lt;/v3d-material&gt;<br />
              &lt;v3d-material type=&quot;Standard&quot; color=&quot;#ffff00&quot;&gt;&lt;/v3d-material&gt;<br />
              &lt;v3d-material type=&quot;Normal&quot; color=&quot;#00ffff&quot;&gt;&lt;/v3d-material&gt;<br />
            &lt;/v3d-geometry&gt;<br />
          &lt;/v3d-mesh&gt;<br />
        &lt;/v3d-scene&gt;<br />
      &lt;/v3d-renderer&gt;<br />
      &lt;div v-show=&quot;showInfo&quot; class=&quot;infopop&quot; ref=&quot;infopop&quot;&gt;<br />
        &lt;div &gt;{{ objInfo.uuid }}&lt;/div&gt;<br />
      &lt;/div&gt;<br />
</pre>
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
      threeSize: {w: '800px', h: '800px'},
      selectIt: 'Double click to select cube, mouse down to rotate, wheel to zoom',
      about: '3D framework for vue ',
      linkto: 'https://github.com/greenpdx/vue3d',
      mailto: 'mailto:savages@taxnvote.org?subject=vue3d%20Demo%20'
    }
  },

  created () {
    this.version3d = THREE.REVISION
    let http = Vue.http
    console.log('HTTP', http)
    let rand = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 1))
    this.mailto = this.mailto + document.referrer + '&body=Please Keep; ' + rand
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
