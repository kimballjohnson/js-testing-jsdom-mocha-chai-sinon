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
            var msg = JSON.parse(jqXHR.responseText).msg;
            fail(msg);
        });
    };

    return {
        getCoordsForCity: getCoordsForCity
    };
})(jQuery);
