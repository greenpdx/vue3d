import Node from '@/api/Node'

export default class TestData {
  rawTree = {top: null, tree: null, total: 0}

  genData () {
    return this.gen7()
  }

  gen7 () {
    let data = []
    let idx = 0
    let top = new Node('Total', -1, null)
    let total = 0

    let tsum = 0
    for (let a = 7; a > 0; a--) {
      let anam = 'A' + a.toString()
      let anode = new Node(anam, -1, top)
      top.children.push(anode)
      let asum = 0
      for (let b = 7; b > 0; b--) {
        let bnam = 'B' + anam + b.toString()
        let bnode = new Node(bnam, -1, anode)
        anode.children.push(bnode)
        let bsum = 0
        for (let c = 7; c > 0; c--) {
          let cnam = 'C' + bnam + c.toString()
          let cnode = new Node(cnam, idx, bnode)
          cnode.sum = a * b * c * 1000
          bsum += cnode.sum
          cnode._idx = idx++
          bnode.children.push(cnode)
          data.push(cnode)
          total += cnode.sum
        }
        bnode.sum = bsum
        asum += bsum
        bnode.children.forEach((itm, idx) => {
          itm.lockVal = itm.sum / bsum
        })
      }
      anode.sum = asum
      tsum += asum
      anode.children.forEach((itm, idx) => {
        itm.lockVal = itm.sum / asum
      })
    }
    top.sum = tsum
    top.children.forEach((itm, idx) => {
      itm.lockVal = itm.sum / tsum
    })
    console.log('sunCHK', tsum, total)
    top.total = total
    this.rawTree.top = top
    this.rawTree.tree = top.children
    this.rawTree.total = total
    return {
      top: top
    }
  }

  gen4 () {
    let data = []
    let idx = 0
    let top = new Node('Total', -1, null)
    top.sum = 10000000
    let tree = top.children
    let total = 0 //  = 1000000
    for (let a = 4; a > 0; a--) {
      let anam = 'A' + a.toString()
      let anode = new Node(anam, -1, top)
      anode.sum = a * 100000
      anode.lockVal = anode.value / top.value
      tree.push(anode)
      for (let b = 4; b > 0; b--) {
        let bnam = 'B' + anam + b.toString()
        let bnode = new Node(bnam, -1, anode)
        bnode.sum = a * b * 10000
        bnode.lockVal = bnode.value / anode.value
        anode.children.push(bnode)
        for (let c = 4; c > 0; c--) {
          let cnam = 'C' + bnam + c.toString()
          let cnode = new Node(cnam, idx, bnode)
          cnode.sum = a * b * c * 1000
          cnode.lockVal = cnode.value / bnode.value
          cnode._idx = idx
          bnode.children.push(cnode)
          data.push(cnode)
          idx += 1
          total += cnode.sum
          console.log(cnam, anode.sum, bnode.sum, cnode.sum)
        }
      }
    }
    console.log(total)
//    this.setNodes(data)
    top.total = total
    this.rawTree.top = top
    this.rawTree.tree = top.children
    this.rawTree.total = total
    return {
      top: top
    }
  }
}
