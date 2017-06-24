const router = require('express').Router();
const request = require("request");

const {getDb} = require('../db/connect');

let URL_PATTERN = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

let random = () => {
    return (+new Date).toString(36);
}

// Shorten URL
router.get('/new/*', (req, response) => {
    let url = req.originalUrl.split('/new/')[1];
    
    if (!url.match(URL_PATTERN)) {
        response.json({
            error: "Wrong url format, make sure you have a valid protocol and real site."
        });
    } else {
        let path = random();
        let short_url = `${req.protocol}://${req.hostname}/${path}`;
        // let objToSave = {};
        // objToSave[short_url] = url;
        
        response.json({
          original_url: url,
          short_url
        });
        getDb().then(db => {
            db.collection('urls').insertOne({
                original_url: url,
                short_url
            }, (err, data) => {
                if (err) console.log(err.stack);
                db.close();
            })
        })
        .catch(err => {
            if (err)
            response.json({message: 'Some error happened! Pls try again!'});
        })
    }
});

router.get('/*', (req, res) => {
    let path = req.path.replace('/', '');
    if (path === '') {
      res.end('Welcome to our Shorten URL service');
    }
    let short_url = `${req.protocol}://${req.hostname}/${path}`;
    
    getDb().then(db => {
        db.collection('urls').find({short_url}).toArray((err, result) => {
            if (err) console.log(err);
            if (result.length === 0) {
                res.json({error: 'This url is not on the database.'});
            } else {
                let originUrl = result[0]['original_url'];
                res.redirect(originUrl);
            }
            db.close();
        })
    })
    .catch(err => {
        if (err)
        res.json({message: 'Some error happened! Pls try again!'});
    })
});

module.exports = router;

