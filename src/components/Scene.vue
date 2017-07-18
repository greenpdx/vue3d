<template>
  <div><slot></slot></div>
</template>
<script>
import { Scene } from 'three'
import { mapActions } from 'vuex'
// import Object3D from './Object3D'
// import bus from '@/lib/bus'

export default {
  name: 'Scene',
//   mixins: [Object3D],

  props: {
    obj: { type: Scene }
//    name: { default: null }
  },

  data () {
    return {
      lights: {},
      childs: {},
      cameras: {}
    }
  },

  created () {
    this.curObj = this.obj
    if (!(this.curObj instanceof Scene)) {
      this.curObj = new Scene()
    }
    this.id3d = this.name || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)

    this.curObj.name = this.id3d
    this.lights = {}
    this.cameras = {}
    this.curObj.vue = this

    this.$on('addCamera', this.addCamera)
    this.$on('addLight', this.addLight)
    this.$on('addChild', this.addChild)
    this.dbgPrt('createScn', this.id3d)
    this.setScene(this)
  },

  mounted () {
    this.dbgPrt('mountScn', this.curObj.uuid)
    this.$parent.$emit('addScene', this)
//    this.$store.dispatch('sceneReady', this.curObj)
  },

  methods: {
    ...mapActions('three3d', [
      'setScene'
    ]),
    addCamera (camera) {
      this.dbgPrt('addCam2Scn', camera.id3d, this.id3d)
      this.cameras[camera.name] = camera
      this.curObj.add(camera.curObj)
      this.$parent.$emit('addCamera', camera)
    },
    addLight (light) {
      this.dbgPrt('addLight2Scn', light.id3d, this.id3d)
      this.lights[light.name] = light
      this.curObj.add(light.curObj)
    },
    addChild (child) {
      this.dbgPrt('addChild2Scn', child.id3d, this.id3d)
      this.childs[child.name] = child
      this.curObj.add(child.curObj)
    }
  },

  computed: {
    domElement: function () {
      return this.$parent.domElement
    },
    id: function () {
      return this.name || this.curObj.uuid
    }
  }
}
</script>
