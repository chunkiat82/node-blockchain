const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');

describe('Wallet', () => {
  let wallet, tp, bc;
  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
    bc = new Blockchain();
  });

  describe('creating a transaction', () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = 'r4nd0m-4ddr355';
      transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
    });

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
      });

      it('doubles the `sendAmount` substracted from the wallet balance', () => {
        expect(
          transaction.outputs.find(
            (output) => output.address === wallet.publicKey
          ).amount
        ).toEqual(wallet.balance - sendAmount * 2);
      });

      it('clones the `sendAmount` output for recipient', () => {
        expect(
          transaction.outputs
            .filter((output) => output.address === recipient)
            .map((output) => output.amount)
        ).toEqual([sendAmount, sendAmount]);
      });
    });
  });

  describe('calculate a balance', () => {
    let addBalance, repeatAdd, senderWallet;
    beforeEach(() => {
      senderWallet = new Wallet();
      addBalance = 100;
      repeatAdd = 3;
      for (let i = 0; i < repeatAdd; i++) {
        senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
      }
      bc.addBlock(tp.transactions);
    });
    it('calculates the balance for blockchain transactions matching the recipient', () => {
      expect(wallet.calculateBalance(bc)).toEqual(
        INITIAL_BALANCE + addBalance * repeatAdd
      );
    });

    it('calculates the balance for blockchain transactions matching the sender', () => {
      expect(senderWallet.calculateBalance(bc)).toEqual(
        INITIAL_BALANCE - addBalance * repeatAdd
      );
    });
    describe('and the recipient conducts a transaction', () => {
      let subtractBalance, recipientBalance;

      beforeEach(() => {
        tp.clear();
        subtractBalance = 60;
        recipientBalance = wallet.calculateBalance(bc);
        wallet.createTransaction(
          senderWallet.publicKey,
          subtractBalance,
          bc,
          tp
        );
        bc.addBlock(tp.transactions);
      });

      describe('and the sender sends another transaction to the recipient', () => {
        beforeEach(() => {
          tp.clear();
          // console.log(`senderWallet =${JSON.stringify(senderWallet.calculateBalance(bc), null, 2)}`)
          senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);          
          bc.addBlock(tp.transactions);
          // console.log(`tp.transactions =${JSON.stringify(tp.transactions, null, 2)}`)
          console.log(`senderWallet =${JSON.stringify(senderWallet.calculateBalance(bc), null, 2)}`)
        });

        it('calculate the recipient balance only using transactions since its most recent one', () => {
          const nowRecipientBalance = wallet.calculateBalance(bc);
          console.log(
            `wallet.calculateBalance(bc) ${wallet.calculateBalance(bc)}`
          );
          expect(nowRecipientBalance).toEqual(
            recipientBalance - subtractBalance + addBalance
          );
        });
      });
    });
  });
});
