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
    this.curObj.name = this.name | this.curObj.uuid
    this.lights = {}
    this.cameras = {}
    this.curObj.vue = this

    this.$on('addCamera', this.addCamera)
    this.$on('addLight', this.addLight)
    this.$on('addChild', this.addChild)
    this.dbgPrt('createSCN', this.id, this.curObj)
    this.setScene(this)
  },

  mounted () {
    this.dbgPrt('mountSCN', this.curObj.uuid)
    this.$parent.$emit('addScene', this)
//    this.$store.dispatch('sceneReady', this.curObj)
  },

  methods: {
    ...mapActions('three3d', [
      'setScene'
    ]),
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
    },
    addChild (child) {
      this.dbgPrt('addChildSCN', child.id, this.curObj)
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
