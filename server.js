'use strict';
let ex = require('express');
let app = ex();
let cors = require('cors');
let pg = require('pg');
app.use(cors());
let superagent = require('superagent');

require('dotenv').config();
let city0 = 'amman';
const PORT = process.env.PORT;
const KEY = process.env.GEOCODE_API_KEY;
const KEY1 = process.env.MASTER_API_KEY;
const KEY2 = process.env.HIKING_KEY;
const KEY3 = process.env.DATABASE_URL;

let client = new pg.Client(KEY3);

//app.get('/location', handleLocation);
app.get('/weather', handleWeather);
app.get('/trails', handleTrails);

/*

function handleLocation(req, res) {
    //try {
    let city = req.query.city;
    database(city).then(data => {
        
        if (data.rowCount > 0) {
            res.json()

        } else {
            gitAPI(city);

        }
    console.log('location .....', city);
    superagent.get(`https://us1.locationiq.com/v1/search.php?key=${KEY}&q=${city}&format=json`).then(data => {
        console.log('location inside .....');
        let jObj = data.body[0];
        let locObj = new Location(city, jObj.display_name, jObj.lat, jObj.lon);
        console.log('data is... ', locObj);
        res.status(200).json(locObj);
    }).catch((err) => {
        res.send('location error ... ' + err);
    });

}

function gitAPI(city ,res ) {
    // superagent.get(`https://us1.locationiq.com/v1/search.php?key=${KEY}&q=${city}&format=json
    //         `).then(data => {
    //     let jObj = data.body[0];
    //     let locObj = new Location(city, jObj.display_name, jObj.lat, jObj.lon);

    let query = 'INSERT INTO location (search_query,formated_query,latitude,longitude) VALUE ($1,$2,$3,$4) RETURN *;';
    console.log('');
    client


    //      res.status(200).json(locObj);
    // }).catch((err) => {
    //     res.send('location error...', err)
    // });

};

//     let jData = require('./data/location.json');
//     let jObj = jData[0];

//     let locObj = new Location(city, jObj.display_name, jObj.lat, jObj.lon);
//     res.status(200).json(locObj);


// } catch (error) {
//     res.status(500).json('Sorry, something went wrong');
// }
//};

function database(city) {
    let query = 'SELECT * FROM location WHERE search_query = $1';
    let value = [city];
    return client.query(query, value).then(data => {
        //console.log(data);
        return data;
    });
}

function Location(search_query, formatted_query, latitude, longitude) {
    this.search_query = search_query;
    this.formatted_query = formatted_query;
    this.latitude = latitude;
    this.longitude = longitude;
}

*/

// {
//     "search_query": "seattle",
//     "formatted_query": "Seattle, WA, USA",
//     "latitude": "47.606210",
//     "longitude": "-122.332071"
//   }

function handleWeather(req, res) {
    let city = req.query.city;
    console.log('city', city);


    superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${KEY1}`).then(data => {
        let jObj = data.body.data;

        let weatherArr = jObj.map((ele) => {
            //  console.log(ele);
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
// try {
//         let jData = require('./data/weather.json');
//         let jObj = jData.data;
//         let weatherArr = 

//         let weatherArr =  jObj.map(ele => {
//             let descript = ele.weather.description;
//             let date = transDate(Date.parse(ele.valid_date));
//             let locObj = new weather(descript, date);

//             return locObj ;

//         })
//         res.status(200).json(weatherArr);

//     } catch (error) {
//         res.status(500).json('Sorry, something went wrong');
//     }

// };

function Weather(desc, time, city) {
    this.forecast = desc;
    this.time = time;
    this.city = city;
}

function transDate(value) {
    var d = (new Date(value) + '').split(' ');
    return [d[0], d[1], d[2], d[3]].join(' ');

};
//https://api.weatherbit.io/v2.0/forecast/daily?city={city}&key=INSERT_KEY_HERE

// [
//     {
//       "forecast": "Partly cloudy until afternoon.",
//       "time": "Mon Jan 01 2001"
//     },
//     {
//       "forecast": "Mostly cloudy in the morning.",
//       "time": "Tue Jan 02 2001"
//     },
//     ....
//   ]
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

app.listen(PORT, () => {
    console.log('the port is :', PORT);
});
// client.connect().then(() => {
//     console.log('client is connected...');

// }).catch(err => {
//     console.log('there is an error in connection...', err)
// });