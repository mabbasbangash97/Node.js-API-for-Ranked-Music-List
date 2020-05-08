const mongoose = require('mongoose');
const debug = require('debug')('app:startup');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./middleware/logger');
const authenticator = require('./middleware/authenticator');
const genres = require('./routes/genres');
const home = require('./routes/home');
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

mongoose.connect('mongodb://localhost:27017/ranked_music_api')
    .then(()=> console.log('Connected to MongoDB...'))
    .catch((err) => err.log('Error', err));

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static('public'));
app.use(helmet());
app.use(logger);
app.use(authenticator);
app.use('/api/genres', genres);
app.use('/', home);

//Configuration => set password before launching to avoid errors!
// console.log(`Application Name: ${config.get('name')}`);
// console.log(`Mail Password: ${config.get('password')}`);

if ( app.get('env') === 'development' ) {
    app.use(morgan('tiny'));
    debug('Morgan Enabled...');
}

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening to PORT ${port}`));

