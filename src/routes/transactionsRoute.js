const express = require("express");
const { getTransactionById, createTransaction, deleteTransactions, getSummaryByUserId } = require('../controllers/transactionsController.js');

const router = express.Router()

// GET all transactions for a user
router.get("/:userId", getTransactionById)

// POST a new transaction
router.post("/", createTransaction);

// DELETE a transaction
router.delete("/:id", deleteTransactions);

// GET transaction summary for a user (Now much more efficient)
router.get("/summary/:userId", getSummaryByUserId);

module.exports = router;