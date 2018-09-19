const express = require('express');

var app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', (req, res) => {
    res.send([
        {
            name: 'Tomek',
            age: 27
        },
        {
            name: 'Mateusz',
            age: 26
        }
    ]);
});

app.listen(3000);
module.exports.app = app;