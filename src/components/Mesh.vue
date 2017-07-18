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
    edge: {
//      type: String,
      default: 'true'
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
    this.dbgPrt('createMSH', this.id3d)
  },

  mounted () {
    this.dbgPrt('mshArgs', this.geo.curObj.name, this.mats[0].curObj.name)
    this.curObj = new Mesh(this.geo.curObj, this.mats[0].curObj)
    this.curObj.vue = this
    let oldid = this.id3d
    this.id3d = this.name || this.curObj.uuid
    this.curObj.name = this.id3d
    if (this.hasEdge) {
      this.edgeObj = this.drawEdges(this.geo.curObj)
      this.edgeObj.vue = this
      this.curObj.add(this.edgeObj)
    }
    Object.assign(this.curObj.position, this.pos)

    this.curObj.visible = this.visible
    this.dbgPrt('mountMsh', oldid, this.id3d)
    this.$parent.$emit('addChild', this)
  },

  updated () {
    this.dbgPrt('updateMSH')
//    this.$parent.$emit('addMesh', this.curObj)
  },

  computed: {
    hasEdge: function () {
      return (this.edge === 'true')
    },
    pos: function () {    //  position can be string, object
      let pos = {}
      let props = this.position
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
            Object.assign(pos, obj)
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
      this.dbgPrt('hoverObj', val, this.id3d)
      if (val) {
        this.curObj.material.wireframe = true
      } else {
        this.curObj.material.wireframe = false
      }
    },
    select (val) {
      let obj = this.curObj
      this.dbgPrt('selectObj', val, this.id3d)
      if (val) {
        obj.material = this.mat[1].curObj
      } else {
        obj.material = this.mat[0].curObj
      }
    }
  }
}
</script>
