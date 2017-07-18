<template>
  <div>
    <slot></slot>
    <div ref="container"></div>
  </div>
</template>

<script>
/* global requestAnimationFrame */
/* eslint-disable no-duplicate-imports */
import { WebGLRenderer } from 'three'
import * as THREE from 'three'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Renderer',

  props: {
    size: {
      type: String // { w, h }
    },
    obj: { type: WebGLRenderer },
    alpha: {
      type: Boolean,
      default: true
    },
    antialias: {
      type: Boolean,
      default: true
    },
    clearColor: {
      type: String,
      default: '#e0e0e0'
    },
    sortObjects: {
      type: Boolean,
      default: false
    },
    name: {
      default: null
    }
  },

  data () {
    return {
      curObj: null,
      lights: [],
      domEle: null
    }
  },

  created () {
    this.curObj = this.obj
    this.width = document.documentElement.clientWidth
    this.height = document.documentElement.clientHeight
    this.size3d = {w: this.width * 0.6, h: this.width * 0.6}

    if (!(this.curObj instanceof WebGLRenderer)) {
      this.curObj = new WebGLRenderer({ antialias: this.antialias, alpha: this.alpha })
    }
    this.curObj.vue = this
    this.curObj.name = this.name || this.curObj.uuid
//    this.curObj.setSize(this.size.w, this.size.h)
    this.curObj.setSize(800, 800)
//    this.$root.__rendererSize = this.size3d // fixme
    this.domEle = this.curObj.domElement
    this.curObj.setClearColor(this.clearColor)
    this.scene = null
    this.camera = null

    this.raycast = new THREE.Raycaster()
//    this.curObj.uuid = 'renderer'
    this.domEle.addEventListener('mousemove', this.onMouseMove, true)
    this.domEle.addEventListener('dblclick', this.onClick, false)
    this.domEle.addEventListener('wheel', this.onWheel, false)

    this.$on('addScene', this.addScene)
    this.$on('addCamera', this.addCamera)
    this.dbgPrt('createREN', this.id, this.curObj)
    this.setRenderer(this)
  },

  mounted () {
    console.log('REN MNT', this.domEle)
    this.$refs.container.appendChild(this.domEle)
    this.animate()
    console.log('STORE REN', this.renderer)
//    this.setRenderer(this)
  },

  beforeDestroy () {
//    bus.$off('setScene', this.setScene)
//    bus.$off('setCamera', this.setCamera)
  },

  computed: {
    ...mapGetters('three3d', {
      renderer: 'renderer'
    }),
    domElement: function () {
      return this.domEle
    },
    id: function () {
      console.log('id func')
      return this.name || 'renderer'
    },
    scene3D: function () {
      return this.scene.curObj
    }
  },

  methods: {
    ...mapActions('three3d', [
      'setRenderer'
    ]),
    _getIntersect (evt) {
      let dom = {
        x: this.domEle.offsetLeft,
        y: this.domEle.offsetTop,
        h: this.domEle.offsetHeight,
        w: this.domEle.offsetWidth
      }
      let mouse = {}
      mouse.x = ((evt.layerX - dom.x) / dom.w) * 2 - 1
      mouse.y = -((evt.layerY - dom.y) / dom.h) * 2 + 1
      this.raycast.setFromCamera(mouse, this.camera.curObj)
      let rslt = this.raycast.intersectObjects(this.scene3D.children, true)
      return rslt
    },
    onMouseMove (evt) {
      evt.preventDefault()
      let intersect = this._getIntersect(evt)
      let obj = null
      if (intersect.length > 0) {
        obj = intersect[0].object
        obj = obj.parent
      }
      this.$store.dispatch('hover', obj)
      this.animate()
    },
    onClick (evt) {
      evt.preventDefault()
      let intersect = this._getIntersect(evt)
      let obj = null
      if (intersect.length > 0) {
        obj = intersect[0].object
        this.$store.dispatch('select', obj)
      }
      this.animate()
    },
    onWheel (evt) {
      let intersect = this._getIntersect(evt)
      if (intersect.length > 0) {
        let obj = intersect[0].object
        if (obj === this.selectObj) {
          evt.preventDefault()
          evt.stopImmediatePropagation()
          this.$store.dispatch('wheelChg', {obj: obj, val: evt.deltaY})
          this.animate()
        }
      }
    },

    addScene (scene) {
      this.scene = scene
      this.dbgPrt('RENaddScene', scene.id, Object.assign({}, this.curObj))
      if (process.env.NODE_ENV === 'development') {
        window.THREE = THREE
        window.scene = scene.curObj
      }
    },

    addCamera (camera) {
      this.dbgPrt('RENaddCam', camera.id, this.curObj)
      this.camera = camera
//      this.animate()
    },
//    setCamera (camera) {
//      this.camera = camera
//      console.log('setCamera')
//    },
//    setLight (light) {
//      console.log('setLight')
//    },
//    setControls (controls) {
//      this.controls = controls
//      console.log('setControl')
//    },
    animate () {
      if (!this.camera) {
        this.dbgPrt('RENnoCAM')
        return
      }
      if (this.controls) {
        this.controls.update()
      }
      requestAnimationFrame(this.animate)
      this.curObj.render(this.scene.curObj, this.camera.curObj)
    }
  }
}

</script>
<style scoped>
</style>
