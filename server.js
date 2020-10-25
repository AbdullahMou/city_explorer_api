let ex = require('express');
let app = ex();
let cors = require('cors');
app.use(cors());

require('dotenv').config();
const PORT = process.env.PORT;
app.get('/location', handleLocation);

function handleLocation(req, res) {
    let city = req.query.city;
    let jData = require('./data/location.json');
    let jObj = jData[0];

    let locObj = new Location(city, jObj.display_name, jObj.lat, jObj.lon);
    res.status(200).json(locObj);
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

app.listen(PORT, () => {
    console.log(PORT);
});