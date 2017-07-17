<template>
  <div><slot></slot></div>
</template>
<script>
import {
  Light,
  AmbientLight,
  DirectionalLight
} from 'three'
// import Object3D from './Object3D'
// import bus from '@/lib/bus'

export default {
  name: 'Light',
//  mixins: [Object3D],
//  components: [Object3D],

  props: {
    obj: {
      type: Light
    },
    type: {
      default: 'AmbientLight'
    },
    color: {
      default: '#ffffff'
    },
    intensity: {
      default: 1
    }
  },

  created () {
    this.curObj = this.obj

    //    let { w, h } = this.$root.__rendererSize // fixme
    if (!(this.curObj instanceof Light)) {
      switch (this.type) {
        case 'AmbientLight':
          this.curObj = new AmbientLight(this.color, this.intensity)
          break
        case 'Directional':
          this.curObj = new DirectionalLight(this.color, this.intensity)
          break
        case 'PointLight':
        case 'SpotLight':
        default:
          this.curObj = new AmbientLight(this.color, this.intensity)
      }
    }
    this.curObj.vue = this
    this.curObj.name = this.curObj.name || this.curObj.type
    this.dbgPrt('creatLHT', this.curObj.uuid)
    this.$parent.$emit('addLight', this)
  },

  mounted () {
    this.dbgPrt('mountLGT')
//    this.$parent.$emit('addLight', this.curObj)
  }
}
</script>
