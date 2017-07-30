<template>
  <div>
    <v3d-group>
      <v3d-mesh>
        <v3d-geometry type="Cylinder" args="10,10,15,6,1,true" ref="cyl"></v3d-geometry>
        <v3d-material type="Standard" color="#00ff00" side="Double"></v3d-material>
        <v3d-material type="Standard" color="#0000ff"></v3d-material>
      </v3d-mesh>
      <v3d-mesh edge='false' position="{'y':2.5}">
        <v3d-geometry type="Cylinder" args="10,0.1,10,6,1,true" ref="cyl"></v3d-geometry>
        <v3d-material type="Normal" color="#00ffff"></v3d-material>
        <v3d-material type="Standard" color="#ff0000" ref="mat"></v3d-material>
      </v3d-mesh>
    </v3d-group>
  </div>
</template>
<script>
import * as THREE from 'three'
// import Object3D from './Object3D'
import Node from '@/api/Node'

import Mesh from '@/components/Mesh'
import Group from '@/components/Group'
import Geometry from '@/components/Geometry'
import Material from '@/components/Material'

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
    obj: {

    },
    position: {
      default: '{"z":0,"y":0."y":0}'
    },
    node: {
      type: Node
    },
    index: 0
  },

  data () {
    return {
      id: '',
      height: 0,
      grp: null
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
//    Object.assign(this.curObj.position, this.pos)
    this.$on('addChild', this.addChild)
    this.$on('addMaterial', this.addMat)
    this.dbgPrt('createHex', this.id3d)
  },

  mounted () {
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
