<template>
  <!-- div><slot></slot></div -->
</template>

<script>
import * as orbit from 'three-orbitcontrols'
import { Camera } from 'three'
import { assign } from '@/lib/util'

// import { Object3D } from '@/components/Object3D'
// import { mapGetters } from 'vuex'

export default {
  name: 'OrbitControls',
//  mixins: [Object3D],

  props: {
    obj: { type: orbit.OrbitControls },
    enable: { default: true },
    minPolarAngle: { default: 0 },
    maxPolarAngle: { default: Math.PI },
    enableDamping: { default: false }
//    camera: { required: true, type: Camera }
//    options: { default: {} }
//    domEle: { required: true }
  },

  created () {
    this.curObj = this.obj
    console.log('ORBIT create', this.$parent.curObj)
    this.curObj = this.mkControls()
  },

  data () {
    return {
      curObj: null
    }
  },

  mounted () {
  },

  computed: {
    camera: function () {
      return this.$parent.camera
    },
    domEle: function () {
      return null
    },
    mkControls () {
      console.log('orbit real')
      let controls
      if (!(this.curObj instanceof Camera)) {
        controls = new orbit.OrbitControls(this.camera)
      }
      controls.name = controls.name || controls.type
      return controls
    }
  },

  methods: {
    setCamera (camera) {
      console.log('ORBIT camera')
      assign(this.curObj.position, this.position)
      assign(this.curObj.rotation, this.rotation)
      if (this.parentObj) {
        this.parentObj.add(this.curObj)
      }
    },

    animate () {

    },

    render () {

    }
  }
}
</script>
