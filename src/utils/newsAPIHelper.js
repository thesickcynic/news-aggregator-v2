const axios = require('axios');

function getNews(url){
    return new Promise((resolve, reject) => {
        axios.get(url).then( resp => {
            return resolve(resp.data);
        }).catch( err => {
            return reject(err);
        })
    });
}

module.exports = getNews;