const express = require("express");
const router = express.Router();
const userController = require("../components/users/controllers");
const transactionController = require("../components/transactions/controllers");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/sign-in", userController.signIn);
router.post("/sign-up", userController.signUp);
router.post("/send", transactionController.createTransaction);
router.get("/balance", transactionController.getBalance);
router.get("/last-block", transactionController.getLastBlock);
router.get("/transactions", transactionController.getTransactions);

module.exports = router;
