var api = api || {};

api.search = (function($) {
    var getCoordsForCity = function(city, done, fail) {
        $.ajax({
            method: 'get',
            url: '/city/' + city
        })
        .done(function(data, textStatus, jqXHR) {
            done(data);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            fail(JSON.parse(jqXHR.responseText).msg);
        });
    };

    return {
        getCoordsForCity: getCoordsForCity
    };
})(jQuery);
