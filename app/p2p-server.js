const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

//ws:localhost:5001, ws:localhost:5002'

class P2PServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    const server = new Websocket.Server({
      port: P2P_PORT
    });

    //when connected first handshake
    server.on('connection', socket => this.connectSocket(socket));    
    this.connectToPeers();
    console.log(`Listen to P2P connections on ${P2P_PORT}`);
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socker Connected');

    this.messageHandler(socket);
    this.sendChain(socket);
  }

  connectToPeers() {
    peers.forEach(peer => {
      const socket = new Websocket(peer);
      socket.on('open', () => {
        this.connectSocket(socket);
      })
    });
  }
  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);

      this.blockchain.replaceChain(data);
      // console.log(this.blockchain.chain);


    })
  }
  
  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  syncChains(){
    this.sockets.forEach(socket=>this.sendChain(socket));
  }
}

module.exports = P2PServer;