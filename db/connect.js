const mongo = require("mongodb").MongoClient;

const MONGO_URL = 'mongodb://tester:tester@ds133922.mlab.com:33922/urlshorterner';

function getDb() {
    return new Promise((resolve, reject) => {
        mongo.connect(MONGO_URL, (err, db) => {
            if (err) {
                reject(err);
            };
            resolve(db);
        });
    })
}

module.exports = {
    mongo,
    getDb
};
