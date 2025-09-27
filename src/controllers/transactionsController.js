const asyncHandler = require('express-async-handler');
const { sql } = require('../config/db'); // Make sure sql is imported

// --- GET All Transactions for a User ---
const getTransactionById = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const transactions = await sql`
        SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    res.status(200).json(transactions);
});

// --- CREATE a New Transaction ---
// Corrected the function definition syntax
const createTransaction = asyncHandler(async (req, res) => {
    const { title, amount, category, user_id } = req.body;

    // More robust validation
    if (!title || !user_id || !category || typeof amount !== 'number') {
        return res.status(400).json({ message: "All fields are required and 'amount' must be a number." });
    }

    const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category)
        VALUES(${user_id}, ${title}, ${amount}, ${category})
        RETURNING *
    `;
    res.status(201).json(transaction[0]);
});

const deleteTransactions = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
        return res.status(400).json({ message: "Invalid Transaction ID" });
    }

    const result = await sql`
        DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
        return res.status(404).json({ message: "Transaction Not Found" });
    }
    
    res.status(200).json({ message: "Transaction Deleted Successfully" });
});

const getSummaryByUserId = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Single, efficient query for all summary data
    const summaryResult = await sql`
        SELECT
            COALESCE(SUM(amount), 0.00) AS balance,
            COALESCE(SUM(amount) FILTER (WHERE amount > 0), 0.00) AS income,
            COALESCE(SUM(amount) FILTER (WHERE amount < 0), 0.00) AS expenses
        FROM transactions
        WHERE user_id = ${userId}
    `;

    res.status(200).json(summaryResult[0]);
})

module.exports = { 
    getTransactionById,
    createTransaction,
    deleteTransactions,
    getSummaryByUserId 
};