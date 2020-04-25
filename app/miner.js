const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransactions = this.transactionPool.validTransactions();
    // include a reward for the miner;
    // create a block consisting of the valid transaction
    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    );

    const block = this.blockchain.addBlock(validTransactions);    
    // synchronize the chains in the peer-to-peer server;
    this.p2pServer.syncChains();
    
    // clear the transaction pool;
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions();
    // broadcast to every miner to clear their transaction pools;

    return block;
  }
}

module.exports = Miner;