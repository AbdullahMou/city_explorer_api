'use strict';

const superAgent = require('superagent');
const HIKING_KEY = process.env.HIKING_KEY;


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

var trails = {
    trailsFunction: function(req, res) {
        superagent.get(`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=3000&key=${HIKING_KEY}`).then((data) => {

            let jObj = data.body.trails;

            let trailsArr = jObj.map((ele) => {
                let locObj = new Trails(ele);

                return locObj;
            });
            res.status(200).send(trailsArr);

        }).catch(() => {
            res.status(500).send('Something went wrong');
        });
    }
}

module.exports = trails;