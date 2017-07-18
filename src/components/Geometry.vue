<template>
  <div><slot></slot></div>
</template>
<script>
import * as THREE from 'three'
const Geometry = THREE.Geometry

export default {
  name: 'Geometry',

  props: {
    obj: {
      type: THREE.Geometry
    },
    type: {
      type: String,
      default: null
    },
    color: {
      default: '#ffffff'
    },
    intensity: {
      default: 1
    },
    args: {
//      type: Array,
      default: ''
    }
  },

  beforeCreate () {
//    console.log('beforeGeo')
  },

  created () {
    this.curObj = this.obj
    let obj = null
    //    let { w, h } = this.$root.__rendererSize // fixme
    if (!(this.curObj instanceof Geometry)) {
//      this.dbgPrt('MG', this.type, this.args.split(','))
      let args = this.args.split(',')
      if (this.type) {
        switch (this.type) {
          case 'Cylinder':
            obj = new THREE.CylinderGeometry(...args)
            break
          case 'Box':
          default:
            obj = new THREE.BoxGeometry(...args)
        }
      } else {
        obj = new Geometry()
      }
      this.curObj = obj
      this.curObj.material = []
    }
    this.curObj.vue = this
    this.id3d = this.name || this.curObj.uuid
    this.curObj.name = this.id3d
    this.$on('addMaterial', this.addMaterial)
    this.dbgPrt('createGeo', this.id3d)
  },

  mounted () {
    this.dbgPrt('mountGeo', this.id3d)
    this.$parent.$emit('setGeometry', this)
  },

  methods: {
    addMaterial (mat) {
      this.dbgPrt('addMat2Geo', mat.id3d, this.id3d)
      this.curObj.material.push(mat)
//      this.$parent.$emit('addMaterial', mat)
    }
  }
}
</script>
