const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2PServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2PServer(bc, tp);

app.use(bodyParser.json());

app.get('/blocks', (req, res, error) => {
  return res.json(bc.chain);
});

app.post('/mine', (req, res, error) => {
  console.log(req.body.data);
  if (req.body.data === undefined) {
    return res.status(400);
  } else {
    const block = bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);
    p2pServer.syncChains();
    return res.redirect('./blocks');
  }
});

app.get('/public-key', (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

app.get('/transactions', (req, res) => {
  return res.json(tp.transactions);
});

app.post('/transact', (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, tp);
  p2pServer.broadcastTransaction(transaction);
  res.redirect('/transactions');
});

app.listen(HTTP_PORT, () => {
  console.log(`listening on port: ${HTTP_PORT}`);
});
p2pServer.listen();
