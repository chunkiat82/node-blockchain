const express = require('express');
const bodyParser = require('body-parser')
const Blockchain = require('../blockchain');
const P2PServer = require('./p2p-server');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const bc = new Blockchain();
const p2pServer = new P2PServer(bc);

app.use(bodyParser.json());

app.get('/blocks', (req, res, error) => {
  return res.json(bc.chain);
})

app.post('/mine', (req,res, error) =>{
  console.log(req.body.data);
  if (req.body.data === undefined) {
    return res.status(400);
  } else {
    const block =  bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);
    p2pServer.syncChains();
    return res.redirect('./blocks');
  }
  
});

app.listen(HTTP_PORT, ()=>{
  console.log(`listening on port: ${HTTP_PORT}`);
});
p2pServer.listen();