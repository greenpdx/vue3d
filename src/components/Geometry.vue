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
    console.log('beforeGeo')
  },

  created () {
    this.curObj = this.obj
    console.log('createGEO')
    let obj = null
    //    let { w, h } = this.$root.__rendererSize // fixme
    if (!(this.curObj instanceof Geometry)) {
      console.log('MG', this.args, typeof this.args, this.args.split(','))
      let args = this.args.split(',')
      if (this.type) {
        switch (this.type) {
          case 'Cylinder':
            obj = new THREE.BoxGeometry(...args)
            break
          case 'Box':
          default:
            obj = new THREE.BoxGeometry(10, 10, 10)
        }
      } else {
        obj = new Geometry()
      }
      this.curObj = obj
    }
    this.curObj.vue = this
    this.curObj.name = this.curObj.name || this.curObj.type
//    this.$parent.$emit('setGeometry', this.curObj)
    console.log('MGend', Object.assign({}, this.curObj))
  },

  mounted () {
    this.$parent.$emit('setGeometry', this.curObj)
  },

  methods: {

  }
}
</script>
