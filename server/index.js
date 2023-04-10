const express = require('express')
const app = express()
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const apiRouter = express.Router();
const fs = require('fs');
const path = require('path');

app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(express.json());

function getUser(token) {
    if (tokens[token]) {
        return tokens[token];
    }
    throw new Error('No user');
}

function readData(token) {
    getUser(token);
    try {
        return JSON.parse(fs.readFileSync('data.json', 'utf8'));
    } catch (err) {
        return [];
    }
}

function writeData(token, items) {
    getUser(token);
    const filtered = items.filter(e => e.boughtAt === null || new Date(e.boughtAt).getTime() > new Date().getTime() - 1000 * 60 * 60 * 24);
    fs.writeFileSync('data.json', JSON.stringify(filtered))
}

function addSuggestion(token, suggestion) {
    getUser(token);
    const suggestions = readSuggestions(token);
    if (!suggestions.includes(suggestion)) {
        fs.writeFileSync('suggestions.json', JSON.stringify([suggestion, ...suggestions]))
    }

}

function readSuggestions(token) {
    getUser(token);
    try {
        return JSON.parse(fs.readFileSync('suggestions.json', 'utf8'));
    } catch (err) {
        return [];
    }
}


apiRouter.get('/items', function (req, res) {
    const items = readData(req.headers.token);
    res.json(items)
});
apiRouter.post('/items', function (req, res) {
    const items = readData(req.headers.token);
    const body = req.body;
    const newItem = {
        "name": body.name,
        "id": uuidv4(),
        "boughtAt": null,
    };
    items.unshift(newItem);
    writeData(req.headers.token, items);
    addSuggestion(req.headers.token, newItem.name);
    return res.json(newItem);
});
apiRouter.patch('/items/:id', function (req, res) {
    const id = req.params.id;
    const body = req.body;

    const items = readData(req.headers.token);
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
    writeData(req.headers.token, altered);
    addSuggestion(req.headers.token, body.name);
    return res.json(altered.find(e => e.id === id));
});
apiRouter.delete('/items/:id', function (req, res) {
    const id = req.params.id;

    const items = readData(req.headers.token);
    const altered = items.filter(e => e.id !== id);
    writeData(req.headers.token, altered);
    return res.send();
});
apiRouter.get('/suggestions', function (req, res) {
    const suggestions = readSuggestions(req.headers.token);
    res.json(suggestions)
});

const tokens = {
    'aap': 'Wouter',
    'dog': 'Maaike',
}

apiRouter.post('/login', function (req, res) {
    const token = req.body.token;
    if (tokens[token]) {
        return res.json(tokens[token]);
    }
    return res.status(403).send("Unknown token");
});

app.use('/api', apiRouter);
app.use(express.static('static/generated'))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/generated/index.html'));
});

app.listen(3000)

console.log('listening on 3000')
