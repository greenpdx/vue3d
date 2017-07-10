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

export default {
  name: 'Renderer',

  props: {
    size: {
      type: Object // { w, h }
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
    this.curObj.name = this.curObj.name || this.curObj.type
    this.curObj.setSize(600, 600)
//    this.$root.__rendererSize = this.size3d // fixme
    this.domEle = this.curObj.domElement
    this.curObj.setClearColor(this.clearColor)

    this.scene = null
    this.camera = null

    this.raycast = new THREE.Raycaster()

    this.domEle.addEventListener('mousemove', this.onMouseMove, true)
    this.domEle.addEventListener('dblclick', this.onClick, false)
    this.domEle.addEventListener('wheel', this.onWheel, false)

    this.$on('addScene', this.addScene)
    this.$on('addCamera', this.addCamera)
    this.dbgPrt('createREN')
  },

  mounted () {
    this.$refs.container.appendChild(this.curObj.domElement)
    this.animate()
  },

  beforeDestroy () {
//    bus.$off('setScene', this.setScene)
//    bus.$off('setCamera', this.setCamera)
  },

  computed: {
  },

  methods: {
    _getIntersect (evt) {
      let dom = {
        x: this.domEle.offsetLeft,
        y: this.domEle.offsetTop,
        h: this.domEle.offsetHeight,
        w: this.domEle.offsetWidth
      }
      let mouse = {}
      mouse.x = ((evt.clientX - dom.x) / dom.w) * 2 - 1
      mouse.y = -((evt.clientY - dom.y) / dom.h) * 2 + 1
      this.raycast.setFromCamera(mouse, this.camera)
      return this.raycast.intersectObjects(this.scene.children)
    },
    onMouseMove (evt) {
      evt.preventDefault()
      let intersect = this._getIntersect(evt)
      let obj = null
      if (intersect.length > 0) {
        obj = intersect[0].object
        this.$store.dispatch('hover', obj)
      }
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
      this.dbgPrt('addScene', scene.uuid)
      if (process.env.NODE_ENV === 'development') {
        window.THREE = THREE
        window.scene = scene
      }
    },

    addCamera (camera) {
      this.dbgPrt('addCam', camera.uuid)
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
      this.curObj.render(this.scene, this.camera)
    }
  }
}

</script>
