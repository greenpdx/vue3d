<template>
  <div><slot></slot></div>
</template>
<script>
import * as THREE from 'three'
// import Object3D from './Object3D'
import Node from '@/api/Node'

const Group = THREE.Group

export default {
  name: 'Hex',
//   mixins: [Object3D],
//  components: [Object3D],

  props: {
    obj: {

    },
    position: {
      default: '{"z":0,"y":0."y":0}'
    },
    node: {
      type: Node
    }
  },

  data () {
    return {
      grps: [],
      mats: [],
      id: ''
    }
  },

  beforeCreate () {
    this.grps = []
    this.mats = []
  },
  created () {
    this.curObj = this.obj

    this.curObj = new Group()
    this.curObj.vue = this
    this.id3d = this.curObj.name || this.curObj.uuid
    this.curObj.name = this.id3d
    Object.assign(this.curObj.position, this.pos)
    this.$on('addChild', this.addChild)
    this.$on('addMaterial', this.addMat)
    this.dbgPrt('createGrp', this.id3d)
  },

  mounted () {
    this.dbgPrt('mountGrp', this.id3d)
//    this.curObj.position.y = 10
    this.$parent.$emit('addChild', this)
  },

  updated () {
    this.dbgPrt('updateGRP', this.id3d)
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
      this.grps.push(child)
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
