'use strict';
//all  require -------------------------------------------------------------
let ex = require('express');
let app = ex();
let cors = require('cors');
app.use(cors());
require('dotenv').config();

// all keys ----------------------------------------------------------------
const PORT = process.env.PORT;

//  required pages--------------------------------------------------------------------------------------------------------
const client = require('./modules/client.js');
let location = require('./modules/location.js');
let weather = require('./modules/weather.js');
let trails = require('./modules/trails.js')
let movie = require('./modules/movie.js');
let yelp = require('./modules/yelp.js');


// all routes --------------------------------------------------------------
app.get('/location', handleLocation);
app.get('/weather', handleWeather);
app.get('/trails', handleTrails);
app.get('/movies', handleMovie);
app.get('/yelp', handleYelp);
app.get('/*', res => {
    res.status(404).send('404 Not found');
});
//--------------------------------------------------------------------------

function handleLocation(req, res) {
    let city = req.query.city;
    location.locationFanction(city, res)
}

//--------------------------------------------------------------------------

function handleWeather(req, res) {
    let city = req.query.city;
    weather.weatherFunction(city, res);
}

//--------------------------------------------------------------------------

function handleTrails(req, res) {
    let lat = req.query.lat;
    let lon = req.query.lon;

    trails.trailsFunction(req, res);

};

//--------------------------------------------------------------------------

function handleMovie(req, res) {
    let city = req.query.search_query;

    movie.movieFunction(city, res);

}

//--------------------------------------------------------------------------

function handleYelp(req, res) {
    let city = req.query.search_query;

    yelp.ylepFunction(city, res);
}

//--------------------------------------------------------------------------

client.connect().then(() => {
    app.listen(PORT, () => {
        console.log('the port is :', PORT);
    })
}).catch(err => {
    console.log('there is an error in connection...', err)
});