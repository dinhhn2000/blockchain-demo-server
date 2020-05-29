const Transaction = require("../models");
const elementCoin = require("../../../utils/blockchain");
const { ec } = require("elliptic");
const EC = new ec("secp256k1");

exports.getBalance = async (req, res, next) => {
  const { address } = req.body;
  console.log("Balance: " + elementCoin.getBalanceOfWallet(address));
  return res.json({
    balance: elementCoin.getBalanceOfWallet(address),
  });
};

exports.getLastBlock = async (req, res, next) => {
  return res.json({
    index: elementCoin.getLastedBlock().index,
  });
};

exports.createTransaction = async (req, res, next) => {
  const { from, to, amount, privateKey } = req.body;
  const address = from;
  try {
    if (from === "" || from === undefined) throw "Missing from";
    if (to === "" || to === undefined) throw "Missing to";
    if (amount === "" || amount === undefined) throw "Missing amount";
    if (privateKey === "" || privateKey === undefined) throw "Missing privateKey";

    const newTransaction = new Transaction(from, to, amount);
    newTransaction.signTxIn(privateKey);

    elementCoin.addTransaction(newTransaction);

    console.log("Start mining ........");
    elementCoin.minePendingTransaction(address);

    return res.json({
      message: "Transaction success",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error,
    });
  }
};
