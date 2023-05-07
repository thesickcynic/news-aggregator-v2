const cacheInstance = require('../utils/cacheProvider');
const getNews = require('../utils/newsAPIHelper')
const URLSearchparams = require('url-search-params');
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines'


const CACHE_DURATION = 600


const makeThirdPartyAPICall = (loggedInUserId, request_country, request_topic) => {
    const searchParams = new URLSearchparams({
        country: request_country,
        category: request_topic,
        apiKey: process.env.NEWS_API_KEY
    })
    const news_response = getNews(NEWS_API_URL + '?' + searchParams).then(resp => {
        cacheInstance.instance().set(loggedInUserId, resp, CACHE_DURATION)
        const respObj = {
            status: 200,
            news_results: resp.articles
        }
        return respObj;
      }).catch(err => {
        const respObj = {
            status: 200,
            news_results: resp.articles
        }
        return respObj;
      })

    return news_response;
}

const makeThirdPartyAPICallWrapper = async (loggedInUserId, request_country, request_topic) => {
    const articles = await makeThirdPartyAPICall(loggedInUserId, request_country, request_topic);
    return articles;
}

const checkCache = (loggedInUserId, request_country, request_topic) => {
    if (cacheInstance.instance().has(loggedInUserId)) {
        return {
            status:200,
            news_results: cacheInstance.instance().get(loggedInUserId)
        }
    } else {
        return makeThirdPartyAPICallWrapper(loggedInUserId, request_country, request_topic)
    }
}

const checkCacheFirstThenCallExternalAPI = (req, res) => {
    const loggedInUser = userDatabase[req._id];
    const loggedInUserId = req._id;
    const request_country = loggedInUser.preferred_country;
    const request_topic = loggedInUser.preferred_topic;
    const results = checkCache(loggedInUserId, request_country, request_topic);
    return results;
}

module.exports = checkCacheFirstThenCallExternalAPI