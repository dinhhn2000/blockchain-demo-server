const Block = require("../../blocks/models");
const Transaction = require("../../transactions/models");
const MINUTES = 1;

module.exports = class BlockChain {
  constructor() {
    this.chain = [this.getGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.reward = 200;
  }

  getGenesisBlock() {
    return new Block(0, Date.parse("2020-01-01"), [], "0");
  }

  getLastedBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransaction(address) {
    const rewardTx = new Transaction(null, address, this.reward);
    this.pendingTransactions.push(rewardTx);

    let lastBlock = this.getLastedBlock();
    console.log(Date.now() - lastBlock.timestamp);

    if (Date.now() - lastBlock.timestamp > MINUTES * 60 * 1000) {
      let newBlock = new Block(
        this.chain.length,
        Date.now(),
        this.pendingTransactions,
        this.getLastedBlock().hash
      );
      newBlock.mineBlock(this.difficulty);

      this.chain.push(newBlock);
      this.pendingTransactions = [];
    }
  }

  addTransaction(transaction) {
    if (!transaction.from || !transaction.to) throw "Transaction must include from and to";
    if (!transaction.isValid()) throw "Cannot add invalid transaction to block";
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfWallet(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.from === address) balance -= parseInt(tx.amount);
        if (tx.to === address) balance += parseInt(tx.amount);
      }
    }
    return balance;
  }

  getTransactionsOfWallet(address) {
    let transactions = [];
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.from === address || tx.to === address) transactions.push(tx);
      }
    }
    return transactions;
  }

  isValidChain() {
    if (JSON.stringify(this.chain[0]) !== JSON.stringify(this.getGenesisBlock())) return false;
    for (let i = 1; i < this.chain.length - 1; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.hasValidTransactions()) return false;
      if (currentBlock.hash !== currentBlock.calculateHash()) return false;
      if (currentBlock.previousHash !== previousBlock.calculateHash()) return false;
    }
    return true;
  }
};
