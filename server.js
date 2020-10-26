let ex = require('express');
let app = ex();
let cors = require('cors');
app.use(cors());
let superagent = require('superagent');

require('dotenv').config();
const PORT = process.env.PORT;
const KEY = process.env.GEOCODE_API_KEY;
const KEY1 = process.env.Master_API_Key;
const KEY2 = process.env.Hiking_Key;

app.get('/location', handleLocation);
app.get('/weather', handleWeather);
app.get('/trails', handleTrails);

function handleLocation(req, res) {
    //try {
    let city = req.query.city;
    superagent.get(`https://us1.locationiq.com/v1/search.php?key=${KEY}&q=${city}&format=json
            `).then(data => {
        let jObj = data.body[0];
        let locObj = new Location(city, jObj.display_name, jObj.lat, jObj.lon);
        res.status(200).json(locObj);
    }).catch(() => {
        res.send('location error')
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

// {
//     "search_query": "seattle",
//     "formatted_query": "Seattle, WA, USA",
//     "latitude": "47.606210",
//     "longitude": "-122.332071"
//   }

function handleWeather(req, res) {
    let city = req.query.search_query;


    superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${KEY1}`)
        .then(data => {
            let jObj = data.body.data;
            console.log(jObj);
            let weatherArr = jObj.map((ele) => {
                console.log(ele);
                let descript = ele.weather.description;
                let date = transDate(Date.parse(ele.valid_date));
                let locObj = new weather(descript, date);
                console.log(weatherArr);


                return locObj;
            });


            res.status(200).json(weatherArr);

        }).catch(() => {
            res.send('an error');
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

function weather(desc, time) {
    this.forecast = desc;
    this.time = time;
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
    //    let lat = req.query.latitude;
    //  let lon = req.query.longitude;
    // console.log('herer', lat, lon);
    console.log('enter the fun');
    superagent.get(`https://www.hikingproject.com/data/get-trails?lat=50&lon=50&maxDistance=5000&key=${KEY2}`)
        .then((data) => {
            console.log('herer', req.query.latitude, req.query.longitude);
            let jObj = data.body.trails;

            let trailsArr = jObj.map((ele) => {
                let locObj = new Trails(ele);
                console.log(locObj);


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
    // this.conditions_date = trailsData.conditionDate.toString().slice(0, 10);
    //this.conditions_time = trailsData.conditionDate.toString().slice(11, 20);

}

app.listen(PORT, () => {
    console.log(PORT);
});