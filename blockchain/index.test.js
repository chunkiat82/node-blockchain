const Blockchain = require('./index');
const Block = require('./block');
describe('Blockchain', ()=>{
    let bc, bc2;

    beforeEach(()=>{
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('starts with gensis block', ()=>{
        expect(bc.chain[0]).toEqual(Block.gensis());
    })

    it('adds a new block', ()=>{
        const data = 'foo';
        bc.addBlock('foo');

        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    });

    it('validates a valid chain', ()=>{
        bc2.addBlock('foo');

        expect(bc.isValidChain(bc2.chain)).toBe(true);
    })

    it('invalidates a chain with a corrup gensis block', ()=>{
       bc2.chain[0].data = 'Bad data';
       expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('invalidates a corrupt chain', ()=>{
        bc2.addBlock('foo');
        bc2.chain[1].data = 'Not Foo';

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('new chain replaced', ()=>{  
        bc2.addBlock('C');

        bc.replaceChain(bc2.chain);
        
        expect(bc.chain).toEqual(bc2.chain);
    });
    

    it('it does not replace the chain if one or less than length in new chain',()=>{
        bc.addBlock('d');

        bc.replaceChain(bc2.chain);
        expect(bc.chain).not.toEqual(bc2.chain);
    })
})