var app = app || {};

app.map = new api.Map('js-map');

app.isValidCitySearch = function(city) {
    return city.trim() !== '';
};

app.showSearchError = function(msg) {
    $('.form-group').addClass('has-error');
    $('.alert').show().text(msg);
};

app.hideSearchError = function() {
    $('.form-group').removeClass('has-error');
    $('.alert').hide();
};

app.fetchCityCoords = function(city) {
    var done = function(city) {
        app.hideSearchError();
        app.map.centreTo(city);
    };

    var fail = function(msg) {
        app.showSearchError(msg);
    };

    api.search.getCoordsForCity(city, done, fail);
};

$('form').on('submit', function(e) {
    e.preventDefault();

    var city = $(this).find('[name="city"]').val();

    if (app.isValidCitySearch(city)) {
        app.hideSearchError();
        app.fetchCityCoords(city);
    }
    else {
        app.showSearchError('Please enter a city name before searching.');
    }
});
