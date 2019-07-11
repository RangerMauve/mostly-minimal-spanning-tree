const crypto = require('crypto')
const { Readable } = require('stream')

const ID_SIZE = 32

module.exports =

class InMemoryHarness {
  static async init () {
    return new InMemoryHarness()
  }

  constructor () {
    this.peers = []
    this.self = new InMemoryPeer()
  }

  get id () {
    return this.self.id
  }

  async createPeer () {
    const peer = new InMemoryPeer()
    this.peers.push(peer)

    return peer.id
  }

  async destroyPeer (id) {
    const stringId = id.toString('hex')
    const peer = this.peers.find((p) => p.stringId === stringId)
    if (!peer) return
    this.peers.splice(this.peers.indexOf(peer), 1)

    for (let stream of peer.streams) {
      stream.push(null)
    }
  }

  async createFakeID () {
    const peer = new InMemoryPeer()
    return peer.id
  }

  async lookup () {
    const stream = new Readable({
      read () {
        for (let { id } of this.peers) {
          this.push(id)
        }
        this.push(null)
      },
      objectMode: true
    })

    return stream
  }

  async connect (id) {
    const stringId = id.toString('hex')
    const peer = this.peers.find((p) => p.stringId === stringId)
    if (!peer) throw new Error('Unable to connect to peer ' + id)

    const stream = new Readable({
      read () {},
      objectMode: true
    })

    peer.streams.push(stream)

    return stream
  }

  async getGraph () {
    // TODO
  }

  async destroy () {
    this.peers = null
  }
}

class InMemoryPeer {
  constructor () {
    this.id = crypto.randomBytes(ID_SIZE)
    this.stringId = this.id.toString('hex')
    this.connections = []
  }
}
