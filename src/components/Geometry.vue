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
    console.log('createGEO')
    let obj = null
    //    let { w, h } = this.$root.__rendererSize // fixme
    if (!(this.curObj instanceof Geometry)) {
      console.log('MG', this.type, this.args.split(','))
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
    this.curObj.name = this.curObj.name || this.curObj.type
    this.$on('addMaterial', this.addMaterial)
  },

  mounted () {
    this.$parent.$emit('setGeometry', this.curObj)
  },

  methods: {
    addMaterial (mat) {
      this.curObj.material.push(mat)
      this.$parent.$emit('addMaterial', mat)
    }
  }
}
</script>
