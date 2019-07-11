const jsnx = require('jsnetworkx')
const crypto = require('crypto')
const { Readable } = require('stream')

const MMST = require('../')

const ID_LENGTH = 2

const G = new jsnx.Graph()
const peers = []

let toSpawn = 64

while (toSpawn--) createPeer()

draw()

function getPeer (peerId) {
  return peers.find(({ id }) => id.equals(peerId))
}

function lookup (ignoreId) {
  const stream = new Readable({
    read () {
      for (let { id } of peers) {
        this.push(id)
      }
      this.push(null)
    },
    objectMode: true
  })

  return stream
}

function connect (fromId, toId) {
  const fromPeer = getPeer(fromId)
  const toPeer = getPeer(toId)

  const connection = new Readable()
  toPeer.mmst.handleIncoming(fromPeer, connection)

  G.addEdge(fromPeer, toPeer)

  return connection
}

function createPeer () {
  const id = crypto.randomBytes(ID_LENGTH)

  const _toString = id.toString
  id.toString = function(){
    return _toString.call(this, 'hex')
  }

  const mmst = new MMST({
    id,
    lookup: () => lookup(id),
    connect: (to) => connect(id, to)
  })

  const peer = {
    id,
    mmst,
    connections: []
  }

  G.addNode(id)

  peers.push(peer)
}

function draw () {
  jsnx.draw(G, {
    element: '#canvas',
    withLabels: true,
    labelStyle: { fill: 'rebeccapurple' },
    stickyDrag: true
  })
}
