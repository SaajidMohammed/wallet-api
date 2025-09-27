// 1. Import the configuration only once
const ratelimit = require("../config/upstash");

// 2. Define the middleware function
const rateLimiter = async (req, res, next) => {
    try {
        const { success } = await ratelimit.limit(req.ip); // Using req.ip is common for rate limiting
        
        if (!success) {
            return res.status(429).json({ message: "Too many requests, please try again later." });
        }
        
        next();
    } catch (error) {
        console.log("Rate limit error", error);
        // Pass the error to the next error-handling middleware
        next(error);
    }
};

// 3. Export using module.exports for CommonJS
module.exports = rateLimiter;