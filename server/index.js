const express = require('express')
const httpContext = require('express-http-context');
const app = express()
const cors = require('cors');
const {v4: uuidv4} = require('uuid');
const apiRouter = express.Router();
const apiRouterAuth = express.Router();
const fs = require('fs');
const path = require('path');

app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(express.json());

function getUser(token) {
    const tokens = readTokens();
    if (tokens[token]) {
        return tokens[token];
    }
    throw new Error('No user');
}

function getContextVars() {
    return {
        environment: httpContext.get('environment'),
        token: httpContext.get('token'),
    }
}

function readData() {
    const {environment} = getContextVars();
    try {
        return JSON.parse(fs.readFileSync(`data_${environment}.json`, 'utf8'));
    } catch (err) {
        return [];
    }
}

function writeData(token, items) {
    const {environment} = getContextVars();
    const filtered = items.filter(e => e.boughtAt === null || new Date(e.boughtAt).getTime() > new Date().getTime() - 1000 * 60 * 60 * 24);
    fs.writeFileSync(`data_${environment}.json`, JSON.stringify(filtered))
}

function addSuggestion(suggestion) {
    const {environment} = getContextVars();
    const suggestions = readSuggestions();
    if (!suggestions.includes(suggestion)) {
        fs.writeFileSync(`suggestions_${environment}.json`, JSON.stringify([suggestion, ...suggestions]))
    }
}

function readTokens() {
    try {
        return JSON.parse(fs.readFileSync('tokens.json', 'utf8'));
    } catch (err) {
        return [];
    }
}

function readSuggestions() {
    const {environment} = getContextVars();
    try {
        return JSON.parse(fs.readFileSync(`suggestions_${environment}.json`, 'utf8'));
    } catch (err) {
        return [];
    }
}

apiRouterAuth.use(httpContext.middleware);
apiRouterAuth.use((req, res, next) => {
    const environment = req.headers.environment;
    const token = req.headers.token;
    const tokens = readTokens();
    if (tokens[environment] && tokens[environment][token]) {
        httpContext.set('environment', environment);
        httpContext.set('token', token);
        next();
    } else {
        const err = new Error('Forbidden');
        err.status = 403;
        next(err);
    }
})

apiRouterAuth.get('/items', function (req, res) {
    const items = readData();
    res.json(items)
});
apiRouterAuth.post('/items', function (req, res) {
    const items = readData(req.headers.token);
    const body = req.body;
    const newItem = {
        "name": body.name,
        "id": uuidv4(),
        "boughtAt": null,
    };
    items.unshift(newItem);
    writeData(req.headers.token, items);
    addSuggestion( newItem.name);
    return res.json(newItem);
});
apiRouterAuth.patch('/items/:id', function (req, res) {
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
apiRouterAuth.delete('/items/:id', function (req, res) {
    const id = req.params.id;

    const items = readData(req.headers.token);
    const altered = items.filter(e => e.id !== id);
    writeData(req.headers.token, altered);
    return res.send();
});
apiRouterAuth.get('/suggestions', function (req, res) {
    const suggestions = readSuggestions(req.headers.token);
    res.json(suggestions)
});

apiRouter.post('/login', function (req, res) {
    const environment = req.body.environment;
    const token = req.body.token;
    const tokens = readTokens();
    if (tokens[environment] && tokens[environment][token]) {
        return res.json(tokens[environment][token]);
    }
    return res.status(403).send("Unknown token");
});

app.use('/api', apiRouter);
apiRouter.use('/auth', apiRouterAuth);

app.use(express.static('static/generated'))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/generated/index.html'));
});

app.listen(3000)

console.log('listening on 3000')
