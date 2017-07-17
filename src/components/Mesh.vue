<template>
  <div><slot></slot></div>
</template>
<script>
import * as THREE from 'three'
// import Object3D from './Object3D'
// import Group from './Group'
// import bus from '@/lib/bus'

const Mesh = THREE.Mesh

export default {
  name: 'Mesh',
//  mixins: [Object3D],

  props: {
    obj: {
      type: Object
    },
    drawEdge: {
      type: Boolean,
      default: true
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
      geo: null,
      mats: [],
      childs: []
    }
  },

  beforeCreate () {
    this.edgeMat = new THREE.LineBasicMaterial({color: 0x000000})
  },

  created () {
    this.curObj = this.obj
//    this.loc = this.cleanObj(this.location)
    this.curObj = new Mesh()
    this.curObj.vue = this
    this.curObj.name = this.curObj.name || this.curObj.type
    this.$on('setGeometry', this.addGeo)
    this.$on('addMaterial', this.addMat)
    this.$on('addChild', this.addChild)
    this.dbgPrt('createMSH', this.curObj.uuid)
  },

  mounted () {
    this.dbgPrt('mountMSH', this.curObj.uuid)
    this.$parent.$emit('addChild', this)
  },

  updated () {
    this.dbgPrt('updateMSH')
//    this.$parent.$emit('addMesh', this.curObj)
  },

  methods: {
    drawEdges (obj) {
      let edges = new THREE.EdgesGeometry(obj, 1)
      let line = new THREE.LineSegments(edges, this.edgeMat)
      return line
    },
    addGeo (geo) {
      this.geo = geo
      this.curObj.geometry = geo
      this.curObj.material = this.mats[0]
      this.curObj.name = this.curObj.name || this.curObj.type
      this.dbgPrt('mkMSH', this.curObj.uuid, this.mats[0].color, Object.assign({}, this.mats[0]))
      let edge = this.drawEdges(geo)
      edge.vue = this
      this.$parent.$emit('addChild', {curObj: edge})
    },
    addMat (mat) {
      this.dbgPrt('addMatMSH', mat.curObj.name)
      this.mats.push(mat)
    },
    addChild (child) {
      this.dbgPrt('addChldMSH', child.uuid)
      this.chlds.push(child)
      this.curObj.add(child.curObj)
    },
    onClick: function (evt) {
      this.dbgPrt(evt)
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
      this.dbgPrt(val, this.curObj.uuid, mat)
      if (val) {
        this.curObj.material.wireframe = true
      } else {
        this.curObj.material.wireframe = false
      }
    },
    select (val) {
      let obj = this.curObj
      let mat = obj.material
      this.dbgPrt(val, Object.assign({}, mat))
      if (val) {
        obj.material = this.mat[1]
      } else {
        obj.material = this.mat[0]
      }
    }
  }
}
</script>
