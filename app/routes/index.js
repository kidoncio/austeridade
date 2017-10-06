var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var options = {
        url: 'https://www.nuuvem.com/catalog/price/free/sort/bestselling/sort-mode/desc',
        method: 'GET'
    };

    request(options, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            return false;
        }

        var arr = [];

        var $ = cheerio.load(body);

        var postItems = $('.product-card--wrapper');

        $(postItems).each(function (key, el) {
            var item = el;

            var img = $(item).find('.product-img > img').attr('src');
            var title = $(item).attr('title');
            var link = $(item).attr('href');

            arr.push({
                img: img,
                title: title,
                link: link
            });
        });

        res.render('index', {
            body: arr
        });
    });
});

module.exports = router;
