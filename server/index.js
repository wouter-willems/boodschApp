const express = require('express')
const app = express()
const fs = require('fs');
const {randomUUID} = require('crypto');

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(express.json());

function readData() {
    try {
        return JSON.parse(fs.readFileSync('data.json', 'utf8'));
    } catch (err) {
        return [];
    }
}

app.get('/items', function (req, res) {
    const items = readData();
    res.json(items)
});
app.post('/items', function (req, res) {
    const items = readData();
    const body = req.body;
    const newItem = {
        "name": body.name,
        "id": randomUUID(),
        "boughtAt": null,
    };
    items.unshift(newItem);
    fs.writeFileSync('data.json', JSON.stringify(items))
    return res.json(newItem);
});
app.patch('/items/:id', function (req, res) {
    const id = req.params.id;
    const body = req.body;

    const items = readData();
    const altered = items.map(e => {
        if (e.id === id) {
            return {
                ...e,
                name: body.name,
                boughtAt: body.boughtAt,
            }
        }
        return e;
    });
    fs.writeFileSync('data.json', JSON.stringify(altered))

    return res.json(altered.find(e => e.id === id));
});

app.listen(3000)
