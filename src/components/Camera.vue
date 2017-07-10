<script>
import {
  Camera,
  PerspectiveCamera,
  OrthographicCamera
} from 'three'
import Object3D from './Object3D'
import OrbitControls from 'three-orbitcontrols'  // move to own component
import { mapGetters } from 'vuex'

export default {
  name: 'Camera',
  mixins: [Object3D],

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
    control: Boolean
  },

  data () {
    return {
      controls: null
    }
  },

  created () {
    this.curObj = this.obj
    console.log('CAM')
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
      this.curObj.position.z = 150

      this.setCamera()
      if (this.control) {
        this.domEle = this.$parent.$parent.domEle
        this.curObj.tst = 0
        this.controls = new OrbitControls(this.curObj, this.domEle)
      }
    }
    this.curObj.name = this.curObj.name || this.curObj.type
    console.log('createCAM', this.curObj.uuid)
  },

  mounted () {
    console.log('mountCAM', this.curObj.uuid)
    this.$parent.$emit('addCamera', this.curObj)
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
