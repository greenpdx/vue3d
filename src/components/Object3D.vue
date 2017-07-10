<template>
  <div><slot></slot></div>
</template>

<script>
import * as THREE from 'three'
import { assign } from '@/lib/util'
const Object3D = THREE.Object3D

export default {
  name: 'Object3D',

  props: {
    obj: { type: Object3D },
    position: { type: Object }, // { x, y, z }
    rotation: { type: Object }, // { x, y, z }
    scale: { type: Object },
    matrix: THREE.Matrix4,
    matrixWorld: THREE.Matrix4,
    usedData: Object,
    visible: Boolean,
    onAfterRender: function (renderer, scene, camera, geometry, material, group) {},
    onBeforeRender: function (renderer, scene, camera, geometry, material, group) {},
    up: { type: Object },
    idName: ''
  },

  watch: {
    position (v) {
      assign(this.curObj.position, v)
    },
    rotation (v) {
      assign(this.curObj.rotation, v)
    }
  },

  data () {
    return {
      curObj: null,
      mats: []
    }
  },

  computed: {
    parentObj () {
      const { curObj: parentObj } = this.$parent
      if (parentObj instanceof Object3D) {
        return parentObj
      }
      return null
    }
  },

  created () {
    this.curObj = this.obj

    if (!(this.curObj instanceof Object3D)) {
      this.curObj = new Object3D()
    }

    this.curObj.name = this.curObj.name || this.curObj.type
    this.curObj.vue = this
    this.$on('addChild', this.addChild)
    this.$on('rmChild', this.rmChild)
    this.$on('addMaterial', this.addMaterial)
    this.$on('setGeometry', this.addGeometry)
    console.log('createO3D', this.curObj.uuid)
  },

  mounted () {
    assign(this.curObj.position, this.position)
    assign(this.curObj.rotation, this.rotation)
    this.$parent.$emit('addChild', this.curObj)
    console.log('mountO3D', this.curObj.uuid)
  },

  beforeDestroy () {
    this.$parent.$emit('rmChild', this.curObj)
  },

  methods: {
    addChild (child) {
      if (this.curObj.uuid !== child.uuid) {
        console.log('addChldO3D', child.uuid)
        this.curObj.add(child)
      }
    },
    rmChild (child) {
      this.curObj.remove(child)
    },
    addMaterial (mat) {
      console.log('addMatO3D', mat.uuid)
      this.mats.push(mat)
      this.curObj.material = this.mats
    },
    addGeometry (geo) {
//      this.geometry = geo
      console.log('addGeoO3D', geo.uuid)
      this.curObj.geometry = geo
    }
  }
}
</script>
