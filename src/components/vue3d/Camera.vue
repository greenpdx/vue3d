<template>
  <div><slot></slot></div>
</template>

<script>
import {
  Camera,
  PerspectiveCamera,
  OrthographicCamera
} from 'three'
// import Object3D from './Object3D'
// import OrbitControls from 'three-orbitcontrols'  // move to own component
import { mapGetters } from 'vuex'

export default {
  name: 'Camera',
//  mixins: [Object3D],

  props: {
    obj: {
      type: Camera
    },
    fov: {
      default: 45
    },
    aspect: {
      default: 1
    },
    near: {
      default: 0.1
    },
    far: {
      default: 3000
    },
    type: {
      default: 'Perspective'
    },
    position: {
    }
  },

  data () {
    return {
      controls: null,
      id3d: ''
    }
  },

  created () {
    this.curObj = this.obj
    this.dbgPrt(typeof this.position, this.position)
    //    let { w, h } = this.$root.__rendererSize // fixme
    if (!(this.curObj instanceof Camera)) {
      switch (this.type) {
        case 'Orthographic':
          this.curObj = new OrthographicCamera(this.fov, this.aspect, this.near, this.far)
          break
        case 'Perspective':
        default:
          this.curObj = new PerspectiveCamera(this.fov, this.aspect, this.near, this.far)
      }
      this.curObj.vue = this
      this.curObj.position.set(this.position.x, this.position.y, this.position.z)

//      this.setCamera()
/*      if (this.control) {
        this.domEle = this.$parent.$parent.domEle
        this.curObj.tst = 0
        this.controls = new OrbitControls(this.curObj, this.domEle)
      } */
    }
    this.id3d = this.name || this.curObj.uuid
    this.curObj.name = this.id3d
    this.dbgPrt('createCam', this.id3d)
    this.$parent.$emit('addCamera', this)
  },

  beforeMount () {
//    this.$parent.$emit('addCamera', this)
  },

  mounted () {
//    this.$parent.$emit('addCamera', this)
    this.dbgPrt('mountCam', this.id3d)
  },

  computed: {
    ...mapGetters({

    }),
    thisCamera () {
      return this.curObj
    }
  },
  methods: {
    setCamera (cam) {
//      this.$store.dispatch('cameraReady', this.curObj)
//      this.$state.camera = cam
    }
  }
}
</script>
