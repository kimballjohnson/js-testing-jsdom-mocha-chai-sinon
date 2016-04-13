var jsdom = require('jsdom');
var expect = require('chai').expect;
var sinon = require('sinon');
var fs = require('fs');

describe('MAP SEARCH FORM TESTS', function() {
    var jsdomWrap = (function() {
        var html = fs.readFileSync(__dirname + '/../public/index.html', 'utf8');
        var re = /<script src="(.+)">/gim;
        var matches = [];
        var match;

        while ((match = re.exec(html)) !== null) {
            matches.push(match[1]);
        }

        var scripts = matches.map(function(scriptSrc) {
            return fs.readFileSync(__dirname + '/../public/' + scriptSrc, 'utf8');
        });

        scripts.splice(scripts.length - 1, 0, fs.readFileSync(__dirname + '/mocks/map.js'));

        return function(cb) {
            jsdom.env({
                html: html,
                src: scripts,
                done: cb
            });
        };
    })();

    it('The search field is initially empty', function(done) {
        jsdomWrap(function(err, window) {
            var $ = window.$;

            expect($('#search').val()).to.be.empty;

            window.close();
            done();
        });
    });

    describe('Form submission tests', function() {
        it('Empty search field submission displays errors on screen', function(done) {
            jsdomWrap(function(err, window) {
                var $ = window.$;
                var errorDiv = $('.alert');

                $('form').submit();

                var hasError = $('.form-group').hasClass('has-error');
                var alertHidden = errorDiv.css('display') === 'none';

                expect(hasError).to.be.true;
                expect(alertHidden).to.be.false;
                expect(errorDiv.text()).to.equal('Please enter a city name before searching.');

                window.close();
                done();
            });
        });

        describe('AJAX requests', function() {
            it('On submission of the city search term "brussels", a GET request is made to /city/brussels', function(done) {
                jsdomWrap(function(err, window) {
                    var $ = window.$;
                    var ajaxRequests = [];

                    window.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                    window.XMLHttpRequest.onCreate = function(xhr) {
                        ajaxRequests.push(xhr);
                    };

                    $('#search').val('brussels');
                    $('form').submit();

                    var request = ajaxRequests[0];

                    expect(request.method).to.equal('GET');
                    expect(request.url).to.equal('/city/brussels');

                    window.close();
                    done();
                });
            });

            it('Form submission with an unrecognised city displays errors on screen', function(done) {
                jsdomWrap(function(err, window) {
                    var $ = window.$;
                    var errorDiv = $('.alert');
                    var ajaxRequests = [];

                    window.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                    window.XMLHttpRequest.onCreate = function(xhr) {
                        ajaxRequests.push(xhr);
                    };

                    $('#search').val('brussels');
                    $('form').submit();

                    var request = ajaxRequests[0];

                    request.respond(404, { "Content-Type": "application/json" }, JSON.stringify({
                        "msg": "No city by the name of brussels has been found."
                    }));

                    var hasError = $('.form-group').hasClass('has-error');
                    var alertHidden = errorDiv.css('display') === 'none';

                    expect(hasError).to.be.true;
                    expect(alertHidden).to.be.false;
                    expect(errorDiv.text()).to.equal('No city by the name of brussels has been found.');

                    window.close();
                    done();
                });
            });

            it('Form submission with a recognised city displays no errors on screen', function(done) {
                jsdomWrap(function(err, window) {
                    var $ = window.$;
                    var errorDiv = $('.alert');
                    var ajaxRequests = [];

                    window.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
                    window.XMLHttpRequest.onCreate = function(xhr) {
                        ajaxRequests.push(xhr);
                    };

                    $('#search').val('london');
                    $('form').submit();

                    var request = ajaxRequests[0];

                    request.respond(200, { "Content-Type": "application/json" }, JSON.stringify({
                        "name": "London", "lat": 51.500152, "lon": -0.126236
                    }));

                    var hasError = $('.form-group').hasClass('has-error');
                    var alertHidden = errorDiv.css('display') === 'none';

                    expect(hasError).to.be.false;
                    expect(alertHidden).to.be.true;

                    window.close();
                    done();
                });
            });
        });
    });

    describe('Unit tests', function() {
        it('method "app.isValidCitySearch" declines an empty string with spaces', function(done) {
            jsdomWrap(function(err, window) {
                expect(window.app.isValidCitySearch(' ')).to.be.false;

                window.close();
                done();
            });
        });

        it('method "app.isValidCitySearch" accepts a city named "London"', function(done) {
            jsdomWrap(function(err, window) {
                expect(window.app.isValidCitySearch('London')).to.be.true;

                window.close();
                done();
            });
        });
    });
});
