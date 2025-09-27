const express = require("express");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler"); // For cleaner async routes
const { sql,initDB } = require("./config/db.js");
const rateLimiter = require("./middleware/rateLimiter.js"); // Simplified import
const transactionsRoute = require("./routes/transactionsRoute.js");
const job = require("./config/cron.js");

dotenv.config();


const app = express();

if(process.env.NODE_ENV === "production") job.start();
const PORT = process.env.PORT || 5001;

app.get("/api/health",(req,res) => {
    res.status(200).json({status:"ok"})
})

// --- Middleware Setup ---
// Apply middleware before any routes
app.use(rateLimiter);
app.use(express.json());

// --- Database Initialization ---


app.use("/api/transactions", transactionsRoute);


// --- Centralized Error Handling Middleware ---
app.use((err, req, res, next) => {
    console.error("An error occurred:", err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// --- Server Startup ---
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT}`);
    });
});
