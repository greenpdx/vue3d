<template>
  <div class="worm-hole">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <g v-if="show0">
        <polygon :points="hex1" fill-opacity="0" stroke="black"/>
        <polygon :points="mask00" :fill="green" />
        <polygon :points="mask01" :fill="green" />
        <text x="300" y="60" >{{ name0 }}</text>
        <polygon v-for="edge in edges1" :points="edge" fill="black" stroke="black"/>
      </g>
      <g v-if="show1">
        <polygon :points="hex0" fill-opacity="0" stroke="black"/>
        <polygon :points="mask10" :fill="red" />
        <polygon :points="mask11" :fill="red" />
        <text x="300" y="20" >{{ name1 }}</text>
        <polygon v-for="edge in edges0" :points="edge" fill="black" stroke="black"/>
      </g>
    </svg>
  </div>
</template>

<script>
const TAU = (Math.sqrt(3) / 2)
const PHI = Math.tan(Math.PI / 6)
const hexBase = [
  {x: -1, y: 0},
  {x: -0.5, y: -TAU},
  {x: 0.5, y: -TAU},
  {x: 1, y: 0},
  {x: 0.5, y: TAU},
  {x: -0.5, y: TAU}
]
/*
  mask0  mask array size 2 from corner to first/largest hex (hex0)
  mask1  mask array size 2 from hex0 to second/smallest hex (hex1)
  hex0        polygon points of first/largest hex
  hex1        polygon points of second/smallest hex
  edge0       array size 6 of edge lines (polygon to show depth) for hex0
  edge1       array size 6 of edge lines (polygon to show depth) for hex1
  show0       boolean for v-if for hex0 and mask0
  show1       boolean for v-if for hex1 and mask1

  start with small hex and over time 1-5 sec expand to final size
*/
export default {
  name: 'WormHole',

  props: {
    size: {},
    clearColor: 0,
    color: null
  },

  data () {
    return {
      mask00: '', // '-40,0 -40,400, 180,19 620,19 840,400 840,0',
      mask01: '', // '-40,800 -40,400 180,781, 620,781 840,400, 840,800',
      mask10: '', // '-40,400 0,400, 200,53.59 600,53.59 800,400 840,400 620,19 180,19',
      mask11: '', // '-40,400 0,400 200,746.11, 600,746.11 800,400, 840,400 620,781 180,781',
//      mask0: [this.mask00, this.mask01],
//      mask1: [this.mask10, this.mask11],
      hex1: '', // '0,400 200,53.59 600,53.59 800,400 600,746.11 200,746.11',
      edges0: [],
      edges1: [],
      hex0: '', // '-40,400 180,19 620,19 840,400 620,781.11 180,781',
      show0: true,   // smallest inside
      show1: true,    // largest outside
      red: '#f00',
      green: '#0f0',
      black: '#000',
      hexConst: {
        offset: 0,
        center: {x: 0, y: 0},
        xdm: 0
      },
      edgePts: [],
      name1: 'NAME1',
      name0: 'NAME0'
    }
  },

  created () {
    this.hexcolor = '#0f0'
    let asz = {w: 800, h: 800}

    let offset = this.hexConst.offset = (asz.h - (TAU * (asz.h + (asz.h * 1 * 0.1)))) / 2
    let center = this.hexConst.center = {x: asz.w / 2, y: (asz.h / 2) + offset}
    let xdm = this.hexConst.xdm = PHI * center.y

    let e = this.mkHex({x: asz.w * 0.61, y: asz.h * 0.61}, center)

    this.edgePts = [
      {x: 0, y: center.y},
      {x: center.y - xdm, y: 0},
      {x: center.y + xdm, y: 0},
      {x: asz.w, y: center.y},
      {x: center.y + xdm, y: asz.h},
      {x: center.y - xdm, y: asz.h}
    ]
    this.edgePts = e.pts
    console.log(this.edgePts, this.hexConst)

    let dsz = {x: asz.w * 0.55, y: asz.h * 0.55}

    let hex1 = this.mkHex({x: (asz.w / 2), y: asz.h / 2}, center)
    let hex0 = this.mkHex(dsz, center)

    this.hex0 = hex0.str.join(' ')
    this.hex1 = hex1.str.join(' ')

    let msk1 = this.mkMask(asz, hex1)
    let msk0 = this.mkMask(asz, hex0)

    this.mask00 = msk1.top.str.join(' ')
    this.mask01 = msk1.bot.str.join(' ')
    this.mask10 = msk0.top.str.join(' ')
    this.mask11 = msk0.bot.str.join(' ')
    this.edges0 = this.mkEdges(asz, hex0.pts)
    this.edges1 = this.mkEdges(asz, hex1.pts)
  },

  methods: {
    mkHex (sz, dif) {
      let pts = []
      let str = []
      for (let i = 0; i < 6; i++) {
        let hb = hexBase[i]
        let pt = {}
        pt.x = hb.x * sz.x + dif.x
        pt.y = hb.y * sz.y + dif.y
        str.push([pt.x, pt.y])
        pts.push(pt)
      }
      return {pts: pts, str: str}
    },

    mkMask (sz, hex) {
      let pts = []
      let str = []
      pts.push({x: 0, y: 0})
      str.push([0, 0])
      for (let i = 0; i < 4; i++) {
        pts.push(hex.pts[i])
        str.push(hex.str[i])
      }
      pts.push({x: sz.w, y: 0})
      str.push([sz.w, 0])
      let top = {pts: pts, str: str}

      str = []
      pts = []
      pts.push({x: sz.w, y: sz.h})
      str.push([sz.w, sz.h])
      for (let i = 3; i < 7; i++) {
        pts.push(hex.pts[i % 6])
        str.push(hex.str[i % 6])
      }
      pts.push({x: 0, y: sz.h})
      str.push([0, sz.h])
      let bot = {pts: pts, str: str}
      return {top: top, bot: bot}
    },

    mkEdges (sz, pts) {
      let edgs = []
      for (let i = 0; i < 6; i++) {
        let ept = this.edgePts[i]
        let hpt = pts[i]
        let ply = []
        ply.push([hpt.x, hpt.y])
        if (ept.x <= 0 || ept.x >= sz.w) {
          ply.push([ept.x, ept.y + 4])
          ply.push([ept.x, ept.y - 4])
        }
        if (ept.y <= 0 || ept.y >= sz.w) {
          ply.push([ept.x + 4, ept.y])
          ply.push([ept.x - 4, ept.y])
        }
        edgs.push(ply.join(' '))
      }
      return edgs
    }
  },

  watched: {

  }
}
</script>

<style scoped>
.worm-hole {
  width: 100%;
  height: 100%;
  color: #ff0000;
}
</style>
