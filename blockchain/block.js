const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(timestamp, lastHash, hash, data) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    toString() {
        // console.log(this.hash.substring(0,10));
        return `Block -
            Timestamp: ${this.timestamp}
            Last Hash: ${this.lastHash.substring(0,10)}
            Hash     : ${this.hash.substring(0,10)}
            Data     : ${this.data}`
    }

    static gensis() {
        return new this('Genesis Time', '----', 'f157', [])
    }

    static mineBlock(lastBlock, data) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const hash = this.hash(timestamp, lastHash, data);

        return new this(timestamp, lastHash, hash, data);
    }

    static hash(timestamp, lastHash, data) {
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }

    static blockHash(block) {
        const { timestamp, lastHash, data} = block;
        return Block.hash(timestamp, lastHash, data);
    }
 }

module.exports = Block;