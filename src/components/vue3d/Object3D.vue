<template>
  <div><slot name="obj3d"></slot></div>
</template>

<script>
import * as THREE from 'three'
import { assign } from '@/lib/util'
const Object3D = THREE.Object3D

export default {
  name: 'Object3D',

  props: {
    obj: {
      default: {},
      type: Object3D
    },
    position: {
      type: String
    }, // { x, y, z }
    rotation: { type: Object }, // { x, y, z }
    scale: { type: Object },
    matrix: THREE.Matrix4,
    matrixWorld: THREE.Matrix4,
    usedData: Object,
    visible: Boolean,
    onAfterRender: function (renderer, scene, camera, geometry, material, group) {},
    onBeforeRender: function (renderer, scene, camera, geometry, material, group) {},
    up: { type: Object },
    name: null
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
      mats: {},
      chlds: {}
    }
  },

  computed: {
    parentObj () {
      const { curObj: parentObj } = this.$parent
      if (parentObj instanceof Object3D) {
        return parentObj
      }
      return null
    },
    defaultPosition: function () {
      return {x: 0, y: 0, z: 0}
    },
    id: function () {
      return this.name || this.curObj.uuid
    }
  },

  created () {
    this.curObj = this.obj
//    let pos = this.location
//    console.log(pos, this.location, typeof this.location)

//    if (!(this.curObj instanceof Object3D)) {
//      this.curObj = new Object3D()
//    }

//    this.id = this.curObj.name = this.name || this.curObj.uuid
//    this.curObj.vue = this
    this.$on('addChild', this.addChild)
    this.$on('rmChild', this.rmChild)
    this.$on('addMaterial', this.addMaterial)
    this.dbgPrt('createO3D', this)
  },

  mounted () {
    assign(this.curObj.position, this.position)
    assign(this.curObj.rotation, this.rotation)
    this.dbgPrt('mountO3D', this.id)
    this.$parent.$emit('addChild', this)
  },

  beforeDestroy () {
    this.$parent.$emit('rmChild', this.curObj)
  },

  methods: {
    cleanObj (str) {
      let cstr = str.replace(/'/gi, '"')
      let obj
      console.log(str, cstr)
      try {
        obj = JSON.parse(cstr, (key, val) => {
          return val
        })
      } catch (err) {
        console.log(err)
      }
      return obj
    },

    addChild (child) {
      this.dbgPrt('addChldO3D', child.id)
      this.chlds[child.id] = child
      this.curObj.add(child.curObj)
    },
    rmChild (child) {
      this.curObj.remove(child.curObj)
//      this.chlds.remove(child.id)
    },
    addMaterial (mat) {
      this.dbgPrt('addMatO3D', mat.id)
      this.mats[mat.id] = mat
    }
  }
}
</script>
