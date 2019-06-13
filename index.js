
const DEFAULT_SAMPLE_SIZE = 16
const DEFAULT_PERCENT_FAR = 0.33
const DEFAULT_LOOKUP_TIMEOUT = 1000

class MMST extends EventEmitter {
  constructor({

    // Function to invoke in order to get a list of peers
    // Should return a stream that emits IDs for potential peers
    lookup,

    // Function to invoke in order to establish a connection to a peer
    // Should take a peer ID from lookup
    connect,

    // The higher the sample size, the more likely it'll connect to "close" peers
    // However, if the sample size is the number of peers, it can have supernodes
    sampleSize=DEFAULT_SAMPLE_SIZE,

    // The higher the percentage the more redundant connections will exist,
    // But the less likely it will be to have partitions
    percentFar=DEFAULT_PERCENT_FAR,

    // How long to lookup peers fore before giving up and using what you have
    lookupTimeout=DEFAULT_LOOKUP_TIMEOUT,
  }) {

    this._lookup = lookup
    this._connect = connect
    this.sampleSize = sampleSize
    this.percentFar = percentFar
    this.lookupTimeout = lookupTimeout

    this.connectedPeers = new Set()
    this.hasConnectedFar = false
    this.destroyed = false
  }

  // This should be invoked when there's an incoming connection
  handleIncoming(id, connection) {
    // Add id to `connectedPeers`
    // Listen on close to remove from `connectedPeers`
  }

  // Run the algorithm
  async run() {
    // If `destroyed` return
    // Start looking up peers, with timeout
    // Build up array of peers
    // Once the array has `sampleSize`, start connecting
    // If it's more than `sampleSize`, randomize the list and take sampleSize
    // Sort by XOR distance
    // Connect to closest peer that isn't connected
    // Listen on the connection close to invoke `run` again
    // If `hasConnectedFar`, return
    // Generate a random number [0, 1)
    // If < `percentFar` return
    // Find furthest peer that isn't already connected
    // Connect to the peer and set `hasConnectedFar` true
    // Listen on connection close and set `hasConnectedFar` false
  }

  async destroy() {
    // Set flag saying that this is destroyed to prevent looping
  }
}
