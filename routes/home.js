const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    // res.send("Welcome To Music Ranking(By Genre) Site!");
    res.render('index', { title: 'TOP 10 MUSIC', message: 'Welcome To Music Ranking(By Genre) Site!'});
});

module.exports = router;
