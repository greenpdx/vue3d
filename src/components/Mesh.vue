<template>
  <div><slot></slot></div>
</template>
<script>
import * as THREE from 'three'
import Object3D from './Object3D'
// import bus from '@/lib/bus'

const Mesh = THREE.Mesh

export default {
  name: 'Mesh',
  extends: [Object3D],

  render: function (createEle) {
    return function (createEle) {
      '<span></span>'
    }
  },
  props: {
    obj: {
      type: Mesh
    },
    geometry: {
//      required: true,
      type: THREE.Geometry
    },
    material: {
//      requires: true,
      type: THREE.Material
    }
  },

  data () {
    return {
      id: 'test',
      hovered: false,
      mat: [],
      geo: null
    }
  },

  beforeCreate () {
    console.log('beforeMSH')
  },

  created () {
    this.curObj = this.obj
    this.mat = []
//    console.log('Mesh0 ', this.geometry.name, this.material.name, this.lname)
    this.curObj = new THREE.Group()
    //    let { w, h } = this.$root.__rendererSize // fixme
    this.curObj.name = this.curObj.name || this.curObj.type
    this.$on('setGeometry', this.addGeo)
    this.$on('addMaterial', this.addMat)
    console.log('createMSH', this.curObj.uuid)
  },

  beforeMount () {
    console.log('beforeMountMSH', this.curObj.uuid)
  },

  mounted () {
    console.log('mountMSH', this.curObj.uuid)
    this.$parent.$emit('addMesh', this.curObj)
  },

  updated () {
    console.log('updateMSH')
//    this.$parent.$emit('addMesh', this.curObj)
  },

  methods: {
    addGeo (geo) {
      this.geo = geo
      if (!(this.curObj instanceof Mesh)) {
        this.curObj = new THREE.Mesh(geo, this.material)
        this.curObj.vue = this
      }
      this.curObj.name = this.curObj.name || this.curObj.type
      console.log('mkMSH', this.curObj.uuid)
//      this.$parent.$emit('addMesh', this.curObj)
    },
    addMat (mat) {
      console.log('addMatMSH', mat.uuid)
      this.mat.push(mat)
    },
    onClick: function (evt) {
      console.log(evt)
    },
    onHover () {
      let self = this
      this.$store.dispatch('hover', { self })
    },
    onSelect () {
      let self = this
      this.$store.dispatch('select', { self })
    },
    hover (val) {
      let mat = this.curObj.material
      console.log(val, this.curObj.uuid, mat.length)
      if (val) {
//        this.curObj.material.forEach(function (ele) {

        console.log(mat[0])
//        ele.wireframe = true
//        })
      } else {
//        this.curObj.material.forEach(function (ele) {
//        ele.wireframe = false
//        })
      }
    },
    select (val) {
      let obj = this.curObj
      let mat = obj.material
      console.log(val, Object.assign({}, mat))
      if (val) {
        mat.forEach(function (ele) {
          ele.color = ele.color
        })
      } else {
        mat.forEach(function (ele) {
          ele.color = ele.color
        })
      }
    }
  }
}
</script>
