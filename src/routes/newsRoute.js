const newsRoute = require('express').Router();
const verifyToken = require('../middleware/authorizeJWT')
const Validator = require('../utils/userInfoValidator');
const getNews = require('../utils/newsAPIHelper')
const bodyParser = require('body-parser');
const URLSearchparams = require('url-search-params');
const rateLimiterMiddleware = require('../middleware/rateLimiter')
const checkCache = require('../handlers/newsCache')

const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines'

newsRoute.use(verifyToken);
newsRoute.use(rateLimiterMiddleware);

newsRoute.get('/news', (req, res) => {
    if(!req._id && req.message == null) {
        res.status(403).send({
            message: "Invalid JWT token"
        })
    } else if (!req._id && req.message) {
        res.status(403).send({
            message: req.message
          });
    } else {
        const result = checkCache(req, res);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result.news_results)
        
    }
});

module.exports = newsRoute;
