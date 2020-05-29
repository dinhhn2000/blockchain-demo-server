const SHA256 = require("crypto-js/sha256");
const Transaction = require("../../transactions/models");

module.exports = class Block {
  constructor(index, timestamp, transactions, previousHash = "") {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.nounce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index + this.previousHash + this.timestamp + this.transactions + this.nounce
    ).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nounce++;
      this.hash = this.calculateHash();
    }

    // console.log("Block mined: " + this.hash);
  }

  hasValidTransactions() {
    for (const tx of this.transactions) if (!tx.isValid()) return false;
    return true;
  }

  isValidNewBlock(newBlock, previousBlock) {}
};
