const express = require('express');
const hbs = require('hbs');

var app = express();

app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');
app.get('/', (req, res) => {

    res.send( {
        name: 'Mihreta',
        likes: ['node.js', 'movies']
    });
} );

app.get('/about', (req, res) => {
    res.render('about.hbs', {currentYear: 2019});
});

 app.get('/bad', (req, res) => {
    res.send({
        error: 404,
        description: 'something went wrong maan'
    });
});

app.listen(3000);