const jsnx = require('jsnetworkx')
const crypto = require('crypto')
const { Readable } = require('stream')

const MMST = require('../')

const ID_LENGTH = 64
const TO_SPAWN = 32

const G = new jsnx.DiGraph()
const peers = []


bootstrap().then(draw)

async function bootstrap() {
  let toSpawn = TO_SPAWN
  while (toSpawn--) {
    const peer = createPeer()
    await peer.mmst.run()
  }
}

function getPeer (peerId) {
  return peers.find(({ id }) => id.equals(peerId))
}

function lookup (ignoreId) {
  const stream = new Readable({
    read () {
      const validPeers = peers
        .filter(({id}) => !id.equals(ignoreId))
        .map(({id}) => id)
      this.push(validPeers)
      this.push(null)
    },
    objectMode: true
  })

  return stream
}

function connect (fromId, toId) {
  const fromStr = fromId.toString('hex')
  const toStr = toId.toString('hex')

  console.log('Connect', fromStr.slice(0, 4), toStr.slice(0, 4))

  const fromPeer = getPeer(fromId)
  const toPeer = getPeer(toId)

  const connection = new Readable()
  toPeer.mmst.handleIncoming(fromId, connection)

  G.addEdge(fromStr, toStr)

  connection.once('close', () => {
    G.removeEdge(fromStr, toStr)
  })

  return connection
}

function createPeer () {
  const id = crypto.randomBytes(ID_LENGTH)

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

  G.addNode(id.toString('hex'))

  peers.push(peer)

  return peer
}

function draw () {
  jsnx.draw(G, {
    element: '#canvas',
    layoutAttr: {
      linkDistance: 100,
    },
    withLabels: true,
    // labelStyle: { fill: 'rebeccapurple' },
    labels: (d) => d.node.slice(0, 4),
    nodeStyle: {
      fill: 'white',
      strokeWidth: 4,
      stroke: (d) => {
        const mostSignificant = parseInt(d.node.slice(0,2), 16)
        const percent = mostSignificant / 255
        const hue = percent * 360
        return `hsl(${hue}, 100%, 50%)`
      }
    },
    nodeAttr: {
      r: 16,
    },
    stickyDrag: true
  })
}
