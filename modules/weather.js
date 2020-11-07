'use strict';

const superAgent = require('superagent');
const MASTER_API_KEY = process.env.MASTER_API_KEY;

let weather = {

    weatherFunction: function(city, res) {

        superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${MASTER_API_KEY}`).then(data => {
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
}


function Weather(desc, time) {
    this.forecast = desc;
    this.time = time;

}

function transDate(value) {
    var d = (new Date(value) + '').split(' ');
    return [d[0], d[1], d[2], d[3]].join(' ');

};

module.exports = weather;