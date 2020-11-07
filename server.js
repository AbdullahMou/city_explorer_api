'use strict';
// all require
let ex = require('express');
let app = ex();
let cors = require('cors');
let pg = require('pg');
app.use(cors());
let superagent = require('superagent');
require('dotenv').config();

// all keys
const PORT = process.env.PORT;
const KEY = process.env.GEOCODE_API_KEY;
const KEY11 = process.env.GEOCODE_API_KEY2
const KEY1 = process.env.MASTER_API_KEY;
const KEY2 = process.env.HIKING_KEY;
const KEY3 = process.env.DATABASE_URL;
let client = new pg.Client(KEY3);

// all routes 
app.get('/location', handleLocation);
app.get('/weather', handleWeather);
app.get('/trails', handleTrails);


function handleLocation(req, res) {
    let city = req.query.city;

    fromDataBase(city).then(data => {
        console.log(data);
        if (data.rowCount > 0) {
            let dbLoc = data.rows[0]
            let object = new Location(dbLoc.search_query, dbLoc.formatted_query, dbLoc.latitude, dbLoc.longitude);

            res.json(object);
        } else {
            fromAPI(city, res).then(data => {

                toDataBase(data);
                res.json(data);
            });

        }

    })
}

function fromDataBase(city) {
    let query = 'SELECT * FROM locations where search_query=$1;';
    let val = [city];
    return client.query(query, val).then(result => {
        console.log('data are showed from database ...')
        return result;
    });
}

function fromAPI(city, res) {
    return superagent.get(`https://us1.locationiq.com/v1/search.php?key=${KEY}&q=${city}&format=json`).then(data => {
        let jObj = data.body[0];
        let locObj = new Location(city, jObj.display_name, jObj.lat, jObj.lon);
        console.log('data are showed from API ...')
        return locObj;
    }).catch((err) => {
        res.send('location error API didn\'t respose...', err)
    });

};

function toDataBase(jObj) {
    let query = 'INSERT INTO locations(search_query,formatted_query,latitude,longitude) VALUES($1,$2,$3,$4);';
    let vals = [jObj.search_query, jObj.formatted_query, jObj.latitude, jObj.longitude];
    client.query(query, vals).then(data => {
        console.log('record is added to database', jObj.search_query);
    }).catch(err => {
        console.log('there problem while inserting', err);
    });
}

//     let jData = require('./data/location.json');
//     let jObj = jData[0];

//     let locObj = new Location(city, jObj.display_name, jObj.lat, jObj.lon);
//     res.status(200).json(locObj);


// } catch (error) {
//     res.status(500).json('Sorry, something went wrong');
// }
//};


function Location(search_query, formatted_query, latitude, longitude) {
    this.search_query = search_query;
    this.formatted_query = formatted_query;
    this.latitude = latitude;
    this.longitude = longitude;
}

function handleWeather(req, res) {
    let city = req.query.city;
    let lat = req.query.latitude;
    let lon = req.query.longitude;
    console.log('city', city);


    superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${KEY1}`).then(data => {
        let jObj = data.body.data;

        let weatherArr = jObj.map((ele) => {

            let descript = ele.weather.description;
            let date = transDate(Date.parse(ele.valid_date));

            let locObj = new Weather(descript, date, city);

            return locObj;
        });

        res.status(200).json(weatherArr);

    }).catch((error) => {
        res.send('an error....', error);
    });
}

function Weather(desc, time, city) {
    this.forecast = desc;
    this.time = time;
    this.city = city;
}

function transDate(value) {
    var d = (new Date(value) + '').split(' ');
    return [d[0], d[1], d[2], d[3]].join(' ');

};

function handleTrails(req, res) {
    let lat = req.query.lat;
    let lon = req.query.lon;
    console.log('herer', lat, lon);

    superagent.get(`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=3000&key=${KEY2}`).then((data) => {
        // console.log('herer', req.query.latitude, req.query.longitude);
        let jObj = data.body.trails;

        let trailsArr = jObj.map((ele) => {
            let locObj = new Trails(ele);
            // console.log(locObj);


            return locObj;
        });
        res.status(200).send(trailsArr);

    }).catch(() => {
        res.status(500).send('Something went wrong');
    });
};


function Trails(trailsData) {
    this.name = trailsData.name;
    this.location = trailsData.location;
    this.length = trailsData.length;
    this.stars = trailsData.stars;
    this.star_votes = trailsData.starVotes;
    this.summary = trailsData.summary;
    this.trails_url = trailsData.url;
    this.conditions = trailsData.conditionStatus;
    this.conditions_date = trailsData.conditionDate.toString().slice(0, 10);
    this.conditions_time = trailsData.conditionDate.toString().slice(11, 20);

}


client.connect().then(() => {
    app.listen(PORT, () => {
        console.log('the port is :', PORT);
    })
}).catch(err => {
    console.log('there is an error in connection...', err)
});