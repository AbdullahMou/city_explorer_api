'use strict';
const client = require('./client.js');

const superAgent = require('superagent');
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;

function Location(search_query, formatted_query, latitude, longitude) {
    this.search_query = search_query;
    this.formatted_query = formatted_query;
    this.latitude = latitude;
    this.longitude = longitude;
}

var location = {
    locationFanction: function(city, res) {

        fromDataBase(city).then(data => {
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
    return superagent.get(`https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json`).then(data => {
        let jObj = data.body[0];
        let locObj = new Location(city, jObj.display_name, jObj.lat, jObj.lon);
        console.log(city, '... are showed from API ...')
        return locObj;
    }).catch((err) => {
        res.send('location error API didn\'t respose...', err)
    });

};

function toDataBase(jObj) {
    let query = 'INSERT INTO locations(search_query,formatted_query,latitude,longitude) VALUES($1,$2,$3,$4);';
    let vals = [jObj.search_query, jObj.formatted_query, jObj.latitude, jObj.longitude];
    client.query(query, vals).then(data => {
        console.log(jObj.search_query, '.... is added to database');
    }).catch(err => {
        console.log('there problem while inserting', err);
    });
}

module.exports = location;