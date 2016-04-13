var express = require('express');
var app = express();
var _ = require('lodash');

app.use(express.static('public'));

app.get('/city/:city', function(req, res, next) {
    var cities = [
        {
            name: 'London',
            lat: 51.500152,
            lon: -0.126236
        },
        {
            name: 'Glasgow',
            lat: 55.8656274,
            lon: -4.251806
        },
        {
            name: 'Dublin',
            lat: 53.344104,
            lon: -6.2674937
        }
    ];

    var cityFound = _.find(cities, function(city) {
        return city.name.toLowerCase() === req.params.city.toLowerCase();
    });

    if (cityFound) {
        return res.json(cityFound);
    }
    else {
        return res.status(404).json({
            msg: "No city by the name of " + req.params.city + " has been found."
        });
    }
});

app.listen(3000, function() {
    console.log('Server is up and running.');
});
