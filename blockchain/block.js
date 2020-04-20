const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY } = require('../config');

class Block {
  constructor(timestamp, lastHash, hash, data, nonce) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.nonce = nonce;
    this.data = data;
  }
    
  toString() {
    // console.log(this.hash.substring(0,10));
    return `Block -
            Timestamp: ${this.timestamp}
            Last Hash: ${this.lastHash.substring(0, 10)}
            Hash     : ${this.hash.substring(0, 10)}
            Data     : ${this.data}`;
  }

  static gensis() {
    return new this('Genesis Time', '----', 'f157', [], 0);
  }
 
  static mineBlock(lastBlock, data) {
    let hash, timestamp;
    const lastHash = lastBlock.hash;
    let nonce = 0;
    do {
      timestamp = Date.now();
      nonce++;
      hash = Block.hash(timestamp, lastHash, data, nonce);
    } while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));
    
    return new this(timestamp, lastHash, hash, data);
  }

  static hash(timestamp, lastHash, data, nouce) {
    return SHA256(`${timestamp}${lastHash}${data}${nouce}`).toString();
  }

  static blockHash(block, nonce) {
    const { timestamp, lastHash, data } = block;
    return Block.hash(timestamp, lastHash, data, nonce);
  }
}

module.exports = Block;
