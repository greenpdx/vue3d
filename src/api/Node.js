// import Vue from 'vue'

var _active = []
var _total = 0

export default class Node {
  static get ONE_VAL () {
    return (2 ** 30)
  }
  name = null;
  default = 0;
  value = 0;
  parent = null;
  children = [];
  index = -1;
  selected = false;
  hover = false;

  constructor (name, idx, parent) {
    this.name = name
    this.idx = idx
    this.parent = parent
    this.children = []
    this.test = _active
    this.vue = []
  }

  /*
    val value
  */
  setValue (val) {
    let sval = this.value
    if (val < 0) {
      this.value = this.default
    } else {
      this.value = val
    }
    this.children.forEach((itm, idx) => {
      itm.setValue(val)
    })
    console.log(sval)
  }

  chgValue (val) {
    let dif = 0
    if (this.val === 0) {
      dif = this.defaultVal
    } else {
      dif = val - this.value
    }
    let sval = this.value
    this.chgChild(dif)
    this.chg = true
    if (this.parent !== null) {
      this.parent.chgParent(dif)
    }
    let pval = this.parent.value
    this.parent.children.forEach((itm, idx) => {
      itm.lockVal = (itm.lockVal) ? itm.value / pval : 0
    })

    console.log(sval, this.value)
    this.chg = false
  }

  chgChild (dif) {
    if (this.lockVal !== 0 && !this.chg) {
      let csum = 0
      this.children.forEach((itm, idx) => {
        let cdif = itm.lockVal * dif
        let cval = itm.chgChild(cdif)
        csum += cval
      })
      this.children.sort((a, b) => this.sortValue(a, b))
      console.log('cC', this.value, dif, this.lockVal, csum)
      this.value += dif
      return this.value
    }
    return 0
  }

  chgParent (dif) {
    if (this.lockVal !== 0) {
      this.value += dif
      if (this.parent !== null) {
        this.parent.chgParent(dif)
      }
    } else {
      this.chgChild(dif)
    }
  }

  chgLock (node) {
    let csum = 0
    let chld = this.children
    chld.forEach((itm, idx) => {
      csum += (itm.lockVal) ? itm.value : 0
    })
    chld.forEach((itm, idx) => {
      this.lockVal = (itm.lockVal) ? itm.value / csum : 0
    })
    chld.sort((a, b) => this.sortValue(a, b))
  }

  sortValue (a, b) {
    if (a.value > b.value) { return -1 }
    if (a.value < b.value) { return 1 }
    return 0
  }

  showVal (val = this.value) {
    return Math.floor(parseInt(val) + 0.5)
  }

  static clrNodes () {
    // clean up better
    _active = []
  }

  static getNodes () {
    return _active
  }

  get total () {
    return _total
  }
  set total (val) {
    _total = val
  }
  set sum (val) {
    this.default = val
    this.value = val
  }

  get hasChildren () {
    return (this.children.length > 0)
  }

  get sum () {
    return this.value
  }

  selectMe () {

  }

  hoverMe () {

  }

  changeMe () {

  }

  static toPercent (val) {
    return (val * this.ONE_VAL / _total)
  }

  static fromPercent (pct) {
    return (pct * _total / this.ONE_VAL)
  }
}
