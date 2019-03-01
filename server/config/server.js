module.exports = {
  host: process.env.HTTP_HOST,
  port: process.env.HTTP_PORT,
  fullUrl: process.env.FULL_URL,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisUrl: process.env.REDIS_URL,
  sessionSecret: process.env.SESSION_SECRET,
}
