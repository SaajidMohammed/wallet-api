const {neon} = require('@neondatabase/serverless')

const dotenv =  require("dotenv/config");

const sql = neon(process.env.DATABASE_URL);  //Create SQL Conn

async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`;
        console.log("Database Initialized Successfully");
    } catch (error) {
        console.error("Error Initializing Database:", error);
        process.exit(1);
    }
}

module.exports = {sql,initDB}
