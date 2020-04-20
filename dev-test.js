const Block = require('./blockchain/block');

// const block = new Block('foor','bar','zoo','baz');

// console.log(block.toString());

// console.log(Block.gensis().toString());


const fooBlock = Block.mineBlock(Block.gensis(), 'foo');
console.log(fooBlock.toString());