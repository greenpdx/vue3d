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
    side: {
      default: 'Double'
    },
    transparent: Boolean,
    color: { default: '#88cc88' },
    parameters: { }
  },

  created () {
    this.curObj = this.obj
    let side = THREE.DoubleSide
    switch (this.side) {
      case 'Front':
        side = THREE.FrontSide
        break
      case 'Back':
        side = THREE.BackSide
        break
      case 'Double':
      default:
        side = THREE.DoubleSide
    }

    if (!(this.curObj instanceof Material)) {
      switch (this.type) {
        case 'Basic':
          this.curObj = new MeshBasicMaterial({color: this.color, side: side})
          break
        case 'Standard':
          this.curObj = new MeshStandardMaterial({color: this.color, side: side})
          break
        case 'Normal':
        default:
          this.curObj = new MeshNormalMaterial({side: side})
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
