# mostly-minimal-spanning-tree
MMST is used to create spanning trees in P2P networks while minimizing connections per node

## Goals

- Peers don't know global state
- Minimize connections in the graph
- Avoid partitions
- Self-healing
- Don't actually form a minimal spanning tree
  - Minimal spanning trees potentially have more hops and highest latency

## Prior work

https://ranger.mauve.moe/graph-mst-viz/

## How it works

1. Each peer gets a randomly generated ID
1. New peer bootstraps into the network
1. Looks for random subset of existing peers
1. Sort peers by XOR distance
1. Connect to closest peer you're not already connected to
1. Random subset of peers will try to connect to furthest peer from them

## Knobs

- How big a sample of peers should you load
- What percentage of peers should connect to their furthest peer

## Uses

- Minimize WebRTC connections
- Replicate hypercores in a mesh (cabal, party)
- Pubsub

## Roadmap

- [ ] Sketch up API / unit tests
- [ ] Figure out how to view the entire state of the network
- [ ] Make visualization for viewing state of network (static)
- [ ] Implement with hyperswarm
  - [ ] Find own ID using [ping method](https://github.com/hyperswarm/discovery#dpingcb)
- [ ] Test with multifeed
- [ ] Integrate with discovery-swarm-webrtc
- [ ] Test that it's all working / TODO

## Future uses

### Content discovery in Dat

At the moment Dat has a big problem where if you have a large swarm of peers with sparsely replicated archives, it becomes hard to find peers that actually contain the data you want.

Once we reduce the number of connections we have, we could experiment with sending out broadcasts to the swarm to discover peers that have the content we want.

## Future work

- Integrate logic from epidemic broadcast trees to reduce connections further
