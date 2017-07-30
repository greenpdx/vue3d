<template>
  <div
    v-on:addChild="addChild"
    v-on:addMaterial="addMat">
    <slot></slot>
    <div v-for="(node, index) in children" >
      <hex :node="node" v-bind:index="index">
      </hex>
    </div>
  </div>
</template>
<script>
import * as THREE from 'three'
// import axios from 'axios'
// import Object3D from './Object3D'
// import bus from '@/lib/bus'
import Hex from '@/components/Hex'
import Group from '@/components/Group'
import Mesh from '@/components/Mesh'
import Geometry from '@/components/Geometry'
import Material from '@/components/Material'

export default {
  name: 'Grid',
  components: {
    'mesh': Mesh,
    'geometry': Geometry,
    'material': Material,
    'hex': Hex,
    'v3d-group': Group
  },
/*  render: function (createElement) {
    return createElement(
      'mesh', [
        createElement('geometry', {
          attrs: {
            type: 'Cylinder',
            args: '20,20,15,6,1,true'
          }
        }),
        createElement('material', {
          attrs: {
            type: 'Normal'
          }
        }),
        this.$slots.default
      ]
    )
  }, */
//   mixins: [Object3D],
  props: {
    obj: {

    },
    position: {
      default: '{"x": 0, "y": 0, "z": 0}'
    },
    nodes: {
//      type: []
    }
  },

  data () {
    return {
      node: null,
      children: [],
      data: {}
    }
  },

  beforeCreate () {
    this.grps = []
    this.mats = []
  },
  created () {
    this.curObj = this.obj
    this.curObj = new THREE.Group()
    this.curObj.vue = this
    this.id3d = this.curObj.name || this.curObj.uuid
    this.curObj.name = this.id3d
    this.children = this.nodes
//    Object.assign(this.curObj.position, this.pos)
    this.$on('addChild', this.addChild)
    console.log('NODE', this.nodes)
    this.children = this.nodes
    this.dbgPrt('createGrd', this.id3d)
  },

  mounted () {
    this.dbgPrt('mountGrd', this.id3d)
//    this.curObj.position.y = 10
    this.$parent.$emit('addChild', this)
  },

  updated () {
    this.dbgPrt('updateGrd', this.id3d)
//    this.$parent.$emit('addGroup', this.curObj)
  },

  computed: {
    pos: function () {
      let ary = JSON.parse(this.position.replace(/'/g, '"'))
      return ary
    }
  },

  methods: {
/*    getData () {
      axios.get('http://10.0.42.81:8181/docs')
        .then(response => {
          console.log('DATA', response)
        })
    },
*/
    addMat (mat) {
      this.dbgPrt('addMat2Grd', mat.uuid, this.id3d)
      this.mats.push(mat)
    },

    addChild (child) {    // also Mesh
      this.dbgPrt('addChild2Grd', child.id3d, this.id3d)
      this.grps.push(child)
      this.curObj.add(child.curObj)
    }
  }
}
</script>
