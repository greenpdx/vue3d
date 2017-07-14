<template>
  <div><slot></slot></div>
</template>
<script>
import { Scene } from 'three'
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
      chlds: {},
      cameras: {}
    }
  },

  created () {
    this.curObj = this.obj
    if (!(this.curObj instanceof Scene)) {
      this.curObj = new Scene()
    }
    this.curObj.name = this.name | this.curObj.uuid
    this.lights = {}
    this.cameras = {}
    this.curObj.vue = this

    this.$on('addCamera', this.addCamera)
    this.$on('addLight', this.addLight)
    this.dbgPrt('createSCN', this.id, this.curObj)
  },

  mounted () {
    this.dbgPrt('mountSCN', this.curObj.uuid)
    this.$parent.$emit('addScene', this)
//    this.$store.dispatch('sceneReady', this.curObj)
  },

  methods: {
    addCamera (camera) {
      this.dbgPrt('addCamSCN', camera.curObj.uuid)
      this.cameras[camera.name] = camera
      this.curObj.add(camera.curObj)
      this.$parent.$emit('addCamera', camera)
    },
    addLight (light) {
      this.dbgPrt('addLightSCN', light.id, this.curObj)
      this.lights[light.name] = light
      this.curObj.add(light.curObj)
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
