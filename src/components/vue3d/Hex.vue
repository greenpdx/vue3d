<template>
  <div>
    <!--v3d-group>
      <v3d-mesh>
        <v3d-geometry type="Cylinder" :args="argCyl" ref="cyl"></v3d-geometry>
        <v3d-material type="Standard" color="#00ff00" side="Double"></v3d-material>
      </v3d-mesh>
      <v3d-mesh edge='false' ref="top">
        <v3d-geometry type="Cylinder" :args="argTop" ref="topgeo"></v3d-geometry>
        <v3d-material type="Normal" color="#00ffff" ref="topmat"></v3d-material>
      </v3d-mesh>
    </v3d-group -->
  </div>
</template>
<script>
import * as THREE from 'three'
import { mapGetters } from 'vuex'
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
    this.edgeMat = new THREE.LineBasicMaterial({color: 0x000000})
  },
  created () {
    this.curObj = this.obj
    console.log(this.node.name, this.index)

    // create new hex Object
    let group = new THREE.Group()
    group.vue = this
    this.id3d = this.name || group.uuid
    group.name = this.id3d

    this.height = this.node.value / this.scale
    this.color = '#00ff00'

    let cylGeo = new THREE.CylinderGeometry(this.size, this.size, this.height, 6, 1, true)
    let cylMat = new THREE.MeshStandardMaterial({
      color: this.color,
      side: THREE.DoubleSide
    })
    let cyl = new THREE.Mesh(cylGeo, cylMat)
    cyl.vue = this
    let edg = this.drawEdges(cylGeo, this.edgeMat)
    edg.vue = this
    cyl.add(edg)
//    console.log(edg)
    cyl.position.y = 0
//    let baseSz = 0.1
    let topGeo = new THREE.CylinderGeometry(0.1, this.size, -5, 6, 1, true)
    let topMat = new THREE.MeshNormalMaterial({side: THREE.DoubleSide})
    let top = new THREE.Mesh(topGeo, topMat)
    top.position.y = this.height / 2 - 2.5
    top.vue = this

    group.add(cyl)
    this.cyl = cyl
    group.add(top)
    this.top = top

    this.curObj = group

    let pos = this.idx2pos(this.index)
    this.hexpos = pos
    this.loc = this.positionHex(pos.x, pos.y, pos.z)
//    console.log('hex pos', this.hexpos, this.loc)

    this.$on('addChild', this.addChild)
    this.$on('addMaterial', this.addMat)
    this.dbgPrt('createHex', this.id3d, this.node.value, this.height, this.scale)
  },

  mounted () {
    this.dbgPrt('mountHex', this.id3d)
    this.$parent.$emit('addChild', this)
  },

  updated () {
    this.dbgPrt('updateHex', this.id3d)
//    this.$parent.$emit('addGroup', this.curObj)
  },

  computed: {
    ...mapGetters({
    }),
    pos: function () {
      let ary = JSON.parse(this.position.replace(/'/g, '"'))
      return ary
    }
  },

  watch: {
  },

  methods: {
    wheelChg (delta) {
      let node = this.node
      console.log(node.value, this.height, this.scale)
    },

    grow (h) {
      if (this.height + h < 1) {
        return this.height
      }
      let geo = this.top
      geo.position.y = h - 5

      let mesh = this.cyl
      geo = mesh.geometry
      geo.verticesNeedUpdate = true
      let cverts = geo.vertices.slice(6, 12)

      this.height = h + this.height
      for (let i = 0; i < 6; i++) {
        cverts[i].y = h + cverts[i].y
      }
         // update edges
      mesh.remove(mesh.children[0])
      mesh.add(this.drawEdges(mesh.geometry))

      return this.height
    },

    drawEdges (obj, mat) {
      let edges = new THREE.EdgesGeometry(obj, 1)
      let line = new THREE.LineSegments(edges, mat)
      return line
    },

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
//      console.log(side, idx, lvl)
      idx = idx - side
      let off = idx % lvl
//      console.log('idx', idx, 'lvl', lvl, 'sid', side, 'off', off)
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
      let loc = {}
      loc.x = (r - s) * this.size * (SQRT3 / 2)
      loc.y = this.height / 2
      loc.z = (q) * this.size * SQRT3 * (SQRT3 / 2)
      this.curObj.position.set(loc.x, loc.y, loc.z)
      return loc
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
        this.cyl.material.wireframe = val
        this.top.material.wireframe = val
      }
    },
    select (val) {
      if (this.curObj.name === 'Group') {
      }
    }
  }
}
</script>
