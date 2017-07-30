<template>
  <div>
    <v3d-group>
      <v3d-mesh>
        <v3d-geometry type="Cylinder" :args="argCyl" ref="cyl"></v3d-geometry>
        <v3d-material type="Standard" color="#00ff00" side="Double"></v3d-material>
      </v3d-mesh>
      <v3d-mesh edge='false' ref="top">
        <v3d-geometry type="Cylinder" :args="argTop" ref="topgeo"></v3d-geometry>
        <v3d-material type="Normal" color="#00ffff" ref="topmat"></v3d-material>
      </v3d-mesh>
    </v3d-group>
  </div>
</template>
<script>
import * as THREE from 'three'
// import Object3D from './Object3D'
import Node from '@/api/Node'

import Mesh from './Mesh'
import Group from './Group'
import Geometry from './Geometry'
import Material from './Material'

const SQRT3 = Math.sqrt(3)
// const HEXLAYER = [0, 6, 18, 36, 60, 90, 126]

export default {
  name: 'Hex',
//   mixins: [Object3D],
  components: {
    'v3d-mesh': Mesh,
    'v3d-geometry': Geometry,
    'v3d-material': Material,
    'v3d-group': Group
  },

  props: {
    position: {
      default: '{"z":0,"y":0."y":0}'
    },
    node: {
      type: Node
    },
    index: 0,
    size: {
      default: 10
    },
    scale: {
      default: 1000
    }
  },

  data () {
    return {
      id: '',
      height: 0,
      grp: null,
      argCyl: '10,10,15,6,1,true',
      argTop: '10,0.1,10,6,1,true'
    }
  },

  beforeCreate () {

  },
  created () {
    this.curObj = this.obj
    console.log(this.node.name, this.index)
    this.curObj = new THREE.Group()
    this.curObj.vue = this
    this.id3d = this.name || this.curObj.uuid
    this.curObj.name = this.id3d

    this.sz = 10
    this.height = this.node.value / this.scale
    let pos = this.idx2pos(this.index)
    console.log(pos)
    this.pos = pos
    this.positionHex(pos.x, pos.y, pos.z)
//    Object.assign(this.curObj.position, pos)
//    set position, size, height
    this.argCyl = [this.size, this.size, this.height, 6, 1, true].join()
    this.argTop = [this.size, 0.1, 10, 6, 1, true].join()

    this.$on('addChild', this.addChild)
    this.$on('addMaterial', this.addMat)
    this.dbgPrt('createHex', this.id3d)
  },

  mounted () {
    let refs = this.$refs
    console.log(refs, refs.top)
    this.$refs.top.curObj.position.y = this.height / 2 - 5

    this.dbgPrt('mountHex', this.id3d)
//    this.curObj.position.y = 10
    this.$parent.$emit('addChild', this)
  },

  updated () {
    this.dbgPrt('updateHex', this.id3d)
//    this.$parent.$emit('addGroup', this.curObj)
  },

  computed: {
    pos: function () {
      let ary = JSON.parse(this.position.replace(/'/g, '"'))
      return ary
    }
  },

  methods: {
    /*
    side 0, 3   y = level, x = offset
    side 1, 4   x = level, z = offset
    side 2, 5   z = level, y = offset
    */
    /* eslint no-fallthrough: ["warn"] */
    idx2pos (idx) {
      let lvl = 0
      for (lvl = 1; (lvl * 6) <= idx; lvl++) {
        idx = idx - (lvl * 6)
      }
//      let dif = idx - HEXLAYER[lvl]
      let side = idx / lvl
      console.log(side, idx, lvl)
      idx = idx - side
      let off = idx % lvl
      console.log('idx', idx, 'lvl', lvl, 'sid', side, 'off', off)
      let sign = 1
      let y
      let x
      let z
      switch (side) {
        case 0:
          sign = -1
// eslint-disable-next-line
        case 3:
          y = lvl * sign
          x = off * sign
          z = x - y
          break
        case 4:
          sign = -1
// eslint-disable-next-line
        case 1:
          x = lvl * sign
          z = off * sign * -1
          y = z - x
          break
        case 2:
          sign = -1
// eslint-disable-next-line
        case 5:
          z = lvl * sign
          y = off * sign * -1
          x = y - z
          break
        default:
      }
      return ({x: x, y: y, z: z})
    },
    positionHex (q = 0, r = 0, s = 0) {
      this.curObj.position.set(
        (r - s) * this.size * (SQRT3 / 2),
        this.height / 2,
        (q) * this.size * SQRT3 * (SQRT3 / 2))
    },
    addMat (mat) {
      this.dbgPrt('addMat2Grp', mat.uuid, this.id3d)
      this.mats.push(mat)
    },
    addChild (child) {    // also Mesh
      this.dbgPrt('addChild2Grp', child.id3d, this.id3d)
      this.grp = child
      this.curObj.add(child.curObj)
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
      if (this.curObj.type === 'Group') {
        for (let chld of this.curObj.children) {
          console.log('CHLD', chld.type)
          if (chld.vue.hover) {
            console.log('CHLDhover', chld.type)
            chld.vue.hover(val)
          }
        }
      }
    },
    select (val) {
      if (this.curObj.name === 'Group') {
        for (let chld of this.curObj.children) {
          chld.select(val)
        }
      }
    }
  }
}
</script>
