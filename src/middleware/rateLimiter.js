
const RateLimiterMemory = require('rate-limiter-flexible').RateLimiterMemory;

const MAX_REQUEST_LIMIT = 10;
const MAX_REQUEST_WINDOW = 1;
const TOO_MANY_REQUESTS_MESSAGE = 'Too many requests, please wait and try again.';

const options = {
  duration: 10,
  points: 1
};

const rateLimiter = new RateLimiterMemory(options);

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req._id)
    .then(() => {
        console.log("Came to the rate limiter middleware.")
      next();
    })
    .catch(() => {
      res.status(429).json({ message: TOO_MANY_REQUESTS_MESSAGE });
    });
};

module.exports = rateLimiterMiddleware