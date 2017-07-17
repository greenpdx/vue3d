<template>
  <div><slot></slot></div>
</template>
<script>
import * as THREE from 'three'
// import Object3D from './Object3D'
// import bus from '@/lib/bus'

const Group = THREE.Group

export default {
  name: 'Group',
//   mixins: [Object3D],
//  components: [Object3D],

  props: {
    obj: {

    },
    location: {
      default: '{"z":0,"y":0."y":0}'
    }
  },

  data () {
    return {
      grps: [],
      mats: [],
      loc: {x: 0, y: 0, z: 0},
      id: ''
    }
  },

  beforeCreate () {
    this.grps = []
    this.mats = []
  },
  created () {
    this.curObj = this.obj
    this.mat = []
//    this.loc = this.cleanObj(this.location)

    this.curObj = new Group()
    this.curObj.vue = this
    //    let { w, h } = this.$root.__rendererSize // fixme
    this.curObj.name = this.curObj.name || this.curObj.type
    this.$on('addChild', this.addChild)
    this.$on('addMaterial', this.addMat)
    this.dbgPrt('createGRP', this.curObj.uuid)
  },

  mounted () {
    this.dbgPrt('mountGRP', this.curObj.uuid)
    this.$parent.$emit('addChild', this)
  },

  updated () {
    this.dbgPrt('updateGRP')
//    this.$parent.$emit('addGroup', this.curObj)
  },

  methods: {
    addMat (mat) {
      this.dbgPrt('addMatGRP', mat.uuid)
      this.mats.push(mat)
    },
    addChild (child) {    // also Mesh
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
      if (this.curObj.name === 'Group') {
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
