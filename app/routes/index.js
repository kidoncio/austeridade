var express = require('express');
var request = require('request-promise');
var cheerio = require('cheerio');
var router = express.Router();
var items = [];

router.get('/', function (req, res, next) {

    // Reddit
    options = {
        url: 'https://www.reddit.com/r/FreeGamesOnSteam/',
        method: 'GET'
    };

    request(options, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            return false;
        }

        var $ = cheerio.load(body);

        var postItems = $('.thing');

        $(postItems).each(function (key, el) {
            var item = el;

            var img = $(item).find('.thumbnail  > img').attr('src');
            var title = $(item).find('.entry > .top-matter > .title').text();
            var link = $(item).find('.thumbnail').attr('data-url');

            items.push({
                img: img,
                title: title,
                link: link
            });
        });
    });

    // Indie Games Bundle
    options = {
        url: 'http://www.indiegamebundles.com/tag/free-steam-key/',
        method: 'GET'
    };

    request(options, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            return false;
        }

        var $ = cheerio.load(body);

        var postItems = $('.td_module_wrap');

        $(postItems).each(function (key, el) {
            var item = el;

            var img = $(item).find('.td-module-image > .td-module-thumb > a > img').attr('src');
            var title = $(item).find('.td-module-image > .td-module-thumb > a').attr('title');
            var link = $(item).find('.td-module-image > .td-module-thumb > a').attr('href');

            items.push({
                img: img,
                title: title,
                link: link
            });
        });
    });

    // Nuuvem
    var options = {
        url: 'https://www.nuuvem.com/catalog/price/free/sort/bestselling/sort-mode/desc',
        method: 'GET'
    };

    request(options, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            return false;
        }

        var $ = cheerio.load(body);

        var postItems = $('.product-card--wrapper');

        if (postItems) {
            $(postItems).each(function (key, el) {
                var item = el;

                var img = $(item).find('.product-img > img').attr('src');
                var title = $(item).attr('title');
                var link = $(item).attr('href');

                items.push({
                    img: img,
                    title: title,
                    link: link
                });
            });
        }
    });

    res.render('index', {
        body: items
    });
});

module.exports = router;
