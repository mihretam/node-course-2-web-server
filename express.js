const express = require('express');
const hbs = require('hbs');
const port = process.env.PORT || 3000;

var app = express();

app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');
app.get('/', (req, res) => {

    res.render(homepage.hbs);
} );

app.get('/about', (req, res) => {
    res.render('about.hbs', {currentYear: 2019});
});


app.get('/projects', (req, res) => {
    res.render('projects.hbs');
})
 app.get('/bad', (req, res) => {
    res.send({
        error: 404,
        description: 'something went wrong maan'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port: ${port}.`);
});