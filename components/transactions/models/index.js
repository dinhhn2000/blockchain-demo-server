const SHA256 = require("crypto-js/sha256");
const { ec } = require("elliptic");
const EC = new ec("secp256k1");

module.exports = class Transaction {
  constructor(from, to, amount) {
    this.from = from;
    this.to = to;
    this.amount = amount;
  }

  calculateHash() {
    return SHA256(this.from + this.to + this.amount).toString();
  }

  signTxIn(privateKey) {
    const key = EC.keyFromPrivate(privateKey, "hex");
    if (key.getPublic("hex") !== this.from) throw "You cannot sign transactions from other wallets";

    const signature = key.sign(this.calculateHash(), "base64").toDER("hex");
    this.signature = signature;
  }

  isValid() {
    if (this.from === null) return true;
    if (!this.signature || this.signature.length == 0)
      throw "This transaction do not have signature";

    const key = EC.keyFromPublic(this.from, "hex");
    return key.verify(this.calculateHash(), this.signature);
  }
};

// const mongoose = require("mongoose");

// const transactionSchema = mongoose.Schema({
//   from: {
//     type: String,
//     require: true,
//   },
//   to: {
//     type: String,
//     require: true,
//   },
//   content: {
//     type: String,
//   },
//   amount: {
//     type: Number,
//     require: true,
//   },
// });

// const signatureSchema = mongoose.Schema({
//   transactionId: {
//     type: mongoose.Schema.Types.ObjectId,
//     require: true,
//   },
//   signature: {
//     type: Number,
//     require: true,
//   },
// });

// module.exports = {
//   transactions: mongoose.model("transactions", transactionSchema),
//   signatures: mongoose.model("signatures", signatureSchema),
// };
