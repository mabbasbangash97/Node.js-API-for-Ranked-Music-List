const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const rankedMusic = new mongoose.Schema({
    rank : {
        type : Number,
        required : true,
        min : 1
    },
    genre : {
        type : String,
        required : true,
        minlength : 3
    }
});

const Genre = mongoose.model('rankedMusic', rankedMusic);

//  / => api/genres 
router.get('/', async (req, res) =>{
    const music = await Genre.find();
    res.send(music);
});

router.get('/:rank', async (req, res) => {
    let music = await Genre.find({rank : parseInt(req.params.rank)});
    if (!music.rank) return res.send(`No Data Found with rank: ${req.params.rank}`);
    res.send(music);
});

router.post('/', async (req, res) => {
    const {error} = validateRank(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let music = new Genre ({
        rank : parseInt(req.body.rank),
        genre : req.body.genre
    });
    result = await music.save();
    res.send(result);
});

router.put('/:rank', async (req, res) => {
    const {error} = validateRank(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const music =await Genre.findOneAndUpdate(
                {rank : req.params.rank},
                { $set: {
                        rank : parseInt(req.body.rank),
                        genre : req.body.genre
                    }
                },
                { new : true}
                );
    if(!music) return console.log(`Music with the rank:${req.params.rank} not found`);
    res.send(music);
});

router.delete('/:rank', async (req, res) =>{
    const music = await Genre.findOneAndRemove({ rank : req.params.rank});
    if(!music) return console.log(`Music with the rank:${req.params.rank} not found`);
    res.send(music);
 });

function validateRank(music){
    const schema = {
        rank : Joi.number().required().min(1),
        genre : Joi.string().min(3).required()
    }
    return Joi.validate(music, schema);
};

module.exports = router;