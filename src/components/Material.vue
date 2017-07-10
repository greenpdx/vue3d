<template>
  <div><slot></slot></div>
</template>

<script>
import * as THREE from 'three'
const Material = THREE.Material
const MeshNormalMaterial = THREE.MeshNormalMaterial
const MeshBasicMaterial = THREE.MeshBasicMaterial
// const MeshPhongMaterial = THREE.MeshPhongMaterial
// const MeshLambertMaterial = THREE.MeshLambertMaterial
const MeshStandardMaterial = THREE.MeshStandardMaterial
// import Object3D from './Object3D'
// import bus from '@/lib/bus'

export default {
  name: 'Material',

  props: {
    obj: { type: Material },
    type: { default: 'Standard' },
    fog: { default: false },
    opacity: { default: 1 },
    side: Object,
    transparent: Boolean,
    color: { default: '#88cc88' },
    parameters: { }
  },

  created () {
    this.curObj = this.obj
    if (!(this.curObj instanceof Material)) {
      switch (this.type) {
        case 'Basic':
          this.curObj = new MeshBasicMaterial({color: this.color})
          break
        case 'Standard':
          this.curObj = new MeshStandardMaterial({color: this.color})
          break
        case 'Normal':
        default:
          this.curObj = new MeshNormalMaterial()
      }
    }
    this.dbgPrt('createMAT', this.color, this.type, this.curObj.uuid)
    this.curObj.vue = this
    this.curObj.name = this.curObj.name || this.curObj.type
  },

  mounted () {
    this.$parent.$emit('addMaterial', this.curObj)
  }

}
</script>
