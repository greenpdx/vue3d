<template>
  <div><slot name="orbit"></slot></div>
</template>

<script>
import OrbitControls from 'three-orbitcontrols'
// import { Camera } from 'three'
// import { assign } from '@/lib/util'

// import { Object3D } from '@/components/Object3D'
// import { mapGetters } from 'vuex'

export default {
  name: 'OrbitControls',
//  mixins: [Object3D],

  props: {
    obj: { type: OrbitControls },
    enable: { default: true },
    minPolarAngle: { default: 0 },
    maxPolarAngle: { default: Math.PI },
    enableDamping: { default: false }
  },

  created () {
    console.log('ORBIT')
    this.$on('addCamera', this.addCamera)
  },

  data () {
    return {
      curObj: null
    }
  },

  mounted () {
  },

  computed: {
    domEle: function () {
      return this.$parent.domElement
    },
    mkControls () {
      console.log('orbit real')
    }
  },

  methods: {
    addCamera (camera) {
      console.log('ORBIT camera')
      this.camera = camera
//      let domEle = this.$root.
      if (!(this.curObj instanceof OrbitControls)) {
        this.controls = new OrbitControls(this.camera, this.domEle)
      }
      this.controls.name = this.name || this.controls.uuid
      this.curObj = this.controls
      this.$parent.$emit('addCamera', camera)
//      assign(this.curObj.position, this.position)
//      assign(this.curObj.rotation, this.rotation)
    },

    animate () {

    },

    render () {

    }
  }
}
</script>
