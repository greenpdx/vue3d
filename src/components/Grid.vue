<template>
  <div><slot></slot></div>
</template>
<script>
import * as THREE from 'three'
import axios from 'axios'
// import Object3D from './Object3D'
// import bus from '@/lib/bus'

const Group = THREE.Group

export default {
  name: 'Grid',
//   mixins: [Object3D],
//  components: [Object3D],

  props: {
    obj: {

    },
    position: {
      default: '{"x": 0, "y": 0, "z": 0}'
    }
  },

  data () {
    return {
      grps: [],
      mats: [],
      nodes: []
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
    getData () {
      axios.get('http://10.0.42.81:8181/docs')
        .then(response => {
          console.log('DATA', response)
        })
    },

    addMat (mat) {
      this.dbgPrt('addMat2Grp', mat.uuid, this.id3d)
      this.mats.push(mat)
    },

    addChild (child) {    // also Mesh
      this.dbgPrt('addChild2Grp', child.id3d, this.id3d)
      this.grps.push(child)
      this.curObj.add(child.curObj)
    }
  }
}
</script>
