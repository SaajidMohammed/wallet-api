// Load environment variables for side effects
require('dotenv/config');

// Import packages using CommonJS 'require'
const { Redis } = require('@upstash/redis');
const { Ratelimit } = require('@upstash/ratelimit');

// Create and configure the ratelimit instance
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

// Export the instance using module.exports
module.exports = ratelimit;