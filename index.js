const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.json());

const rankedMusic=[
    {rank : 1, genre : 'Heavy Metal'},
    {rank : 2, genre : "Rock'n Roll"},
    {rank : 3, genre : 'Alternative Rock'},
    {rank : 4, genre : 'Hard Rock'},
    {rank : 5, genre : 'Classical'},
    {rank : 6, genre : 'Thrash Metal'},
    {rank : 7, genre : 'Pop'},
    {rank : 8, genre : 'Progressive Rock'},
    {rank : 9, genre : 'Rap'},
    {rank : 10, genre : 'Grunge'}
];

app.get('/', (req, res) => {
    res.send("Welcome To Music Ranking(By Genre) Site!");
});

app.get('/api/genres', (req, res) =>{
    res.send(rankedMusic);
});

app.get('/api/genres/:rank', (req, res) => {
    const music = rankedMusic.find(r => r.rank === parseInt(req.params.rank));
    if(!music) return res.status(404).send(`Rank: ${req.params.rank} was not found!`);
    res.send(music);
});

app.post('/api/genres', (req, res) => {
    const {error} = validateRank(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let music = {
        rank : rankedMusic.length+1,
        genre : req.body.genre
    };
    rankedMusic.push(music);
    res.send(music);
});

app.put('/api/genres/:rank', (req, res) => {
    const music = rankedMusic.find(r => r.rank === parseInt(req.params.rank));
    if(!music) return res.status(404).send(`Rank: ${req.params.rank} was not found!`);

    const {error} = validateRank(req.body);
    if(error) return res.status(400).send(error.details[0].message);  

    music.genre = req.body.genre;
    res.send(music);
});

 app.delete('/api/genres/:rank', (req, res) =>{
    const music = rankedMusic.find(r => r.rank === parseInt(req.params.rank));
    if(!music) return res.status(404).send(`Rank: ${req.params.rank} was not found!`);

    const index = rankedMusic.indexOf(music);
    rankedMusic.splice(index, 1);
    res.send(music);
 });

function validateRank(music){
    const schema = {
        genre : Joi.string().min(3).required()
    }
    return Joi.validate(music, schema);
};

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening to PORT ${port}`));

