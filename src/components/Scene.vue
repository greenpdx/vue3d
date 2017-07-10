
<script>
import { Scene } from 'three'
import Object3D from './Object3D'
// import bus from '@/lib/bus'

export default {
  name: 'Scene',
  mixins: [Object3D],

  props: {
    obj: { type: Scene }
  },

  data () {
    return {
      lights: [],
      meshes: [],
      cameras: []
    }
  },

  created () {
    this.curObj = this.obj
    if (!(this.curObj instanceof Scene)) {
      this.curObj = new Scene()
    }
    this.curObj.name = this.curObj.name || this.curObj.type
    this.lights = []
    this.meshes = []
    this.curObj.vue = this

    this.$on('addCamera', this.addCamera)
    this.$on('addLight', this.addLight)
    this.$on('addMesh', this.addMesh)
    console.log('createSCN', this.curObj.uuid)
  },

  mounted () {
    console.log('mountSCN', this.curObj.uuid)
    this.$parent.$emit('addScene', this.curObj)
//    this.$store.dispatch('sceneReady', this.curObj)
  },

  methods: {
    addCamera (camera) {
      this.cameras.push(camera)
      this.$parent.$emit('addCamera', camera)
      console.log('addCamSCN', camera.uuid)
    },
    addLight (light) {
      console.log('addLightSCN')
      this.lights.push(light)
      this.curObj.add(light)
    },
    addMesh (mesh) {
      console.log('addMeshSCN', mesh.uuid)
      this.meshes.push(mesh)
      this.curObj.add(mesh)
    }
  },

  computed: {

  }
}
</script>
