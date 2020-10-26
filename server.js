let ex = require('express');
let app = ex();
let cors = require('cors');
app.use(cors());

require('dotenv').config();
const PORT = process.env.PORT;
app.get('/location', handleLocation);
app.get('/weather', handleWeather);

function handleLocation(req, res) {
    try {
        let city = req.query.city;
        let jData = require('./data/location.json');
        let jObj = jData[0];

        let locObj = new Location(city, jObj.display_name, jObj.lat, jObj.lon);
        res.status(200).json(locObj);


    } catch (error) {
        res.status(500).json('Sorry, something went wrong');
    }
};


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
    try {
        let jData = require('./data/weather.json');
        let jObj = jData.data;
        let weatherArr = [];
        jObj.forEach(ele => {
            let locObj = new weather(ele.weather.description);
            weatherArr.push(locObj);


        })
        res.status(200).json(weatherArr);

    } catch (error) {
        res.status(500).json('Sorry, something went wrong');
    }


};

function weather(desc) {
    this.forecast = desc;
}
// [
//     {
//       "forecast": "Partly cloudy until afternoon.",
//       "time": "Mon Jan 01 2001"
//     },
//     {
//       "forecast": "Mostly cloudy in the morning.",
//       "time": "Tue Jan 02 2001"
//     },
//     ...
//   ]

app.listen(PORT, () => {
    console.log(PORT);
});