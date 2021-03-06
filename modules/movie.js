'use strict';

const superAgent = require('superagent');
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

function Movies(title, overview, average_votes, total_votes, image_url, popularity, released_on) {
    this.title = title;
    this.overview = overview;
    this.average_votes = average_votes;
    this.total_votes = total_votes;
    this.image_url = `https://image.tmdb.org/t/p/w500${image_url}`;
    this.popularity = popularity;
    this.released_on = released_on;

}

var movie = {
    movieFunction: function(city, res) {

        superAgent.get(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${city}`).then(data => {
            let jsonObject = data.body.results;
            let result = jsonObject.map(value => {
                let movieObject = new Movies(value.title, value.overview, value.vote_average, value.vote_count, value.poster_path, value.popularity, value.release_date);
                return movieObject;
            })
            res.status(200).json(result);
        }).catch(() => {
            res.send('error');
        });
    }
}
module.exports = movie