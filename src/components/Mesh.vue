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
    },
    position: {
    },
    visible: { default: true }
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
    this.id3d = this.name || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)
    this.$on('setGeometry', this.addGeo)
    this.$on('addMaterial', this.addMat)
    this.$on('addChild', this.addChild)
    this.dbgPrt('createMSH')
  },

  mounted () {
    this.dbgPrt('mshArgs', this.geo.curObj.name, this.mats[0].curObj.name)
    this.curObj = new Mesh(this.geo.curObj, this.mats[0].curObj)
    this.curObj.vue = this

    this.curObj.name = this.id3d
    this.edge = this.drawEdges(this.geo.curObj)
    this.edge.vue = this
    this.curObj.add(this.edge)
    let pos = this.curObj.position
    console.log('POS', pos)
//    this.dbgPrt('mkMSH', this.curObj.uuid, this.mats[0].curObj.color, Object.assign({}, this.mats[0]))

//    this.$parent.$emit('addChild', {curObj: edge})
    //    this.curObj.position.x = this.pos.x
// this.curObj.position.y = 10
    //    this.curObj.position.z = this.pos.z
    this.curObj.visible = this.visible
    this.dbgPrt('mountMsh', this.id3d)
    this.$parent.$emit('addChild', this)
  },

  updated () {
    this.dbgPrt('updateMSH')
//    this.$parent.$emit('addMesh', this.curObj)
  },

  computed: {
    pos: function () {    //  position can be string, object
      let pos = new THREE.Vector3(0, 0, 0)
      let props = this.position
      console.log(props, typeof this.position)
      switch (typeof props) {
        case 'undefined':
          pos.x = 0
          pos.y = 0
          pos.z = 0
          break
        case 'string':
          let str = props.replace(/'/g, '"')
          try {
            let obj = JSON.parse(str)
            pos.x = obj.x || pos.x
            pos.y = obj.y || pos.y
            pos.z = obj.z || pos.z
          } catch (err) {
            console.log(props, err)
          }
          break
        case 'object':
          pos.x = props.x || pos.x
          pos.y = props.y || pos.y
          pos.z = props.z || pos.z
          break
        default:
      }
      return pos
    }
  },

  methods: {
    drawEdges (obj) {
      let edges = new THREE.EdgesGeometry(obj, 1)
      let line = new THREE.LineSegments(edges, this.edgeMat)
      return line
    },
    addGeo (geo) {
      this.dbgPrt('addGeo2Msh', geo.id3d)
      this.geo = geo
//      this.curObj.geometry = geo
//      this.curObj.material = this.mats[0].curObj
//      this.curObj.name = this.curObj.name || this.curObj.uuid
//      this.dbgPrt('mkMSH', this.curObj.uuid, this.mats[0].curObj.color, Object.assign({}, this.mats[0]))
//      let edge = this.drawEdges(geo)
//      edge.vue = this
//      this.$parent.$emit('addChild', {curObj: edge})
    },
    addMat (mat) {
      this.dbgPrt('addMat2Msh', mat.id3d)
      this.mats.push(mat)
    },
    addChild (child) {
      this.dbgPrt('addChld2Msh', child.id3d)
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
