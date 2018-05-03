const crypto = require('crypto');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const log = require('debug')('app:server');

const api = require('./api');

const app = express();

let token = null;

const settings = require('../settings.json');

const PORT = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.use(bodyParser.json());

app.use((req, res, next) => {
    log(`${req.method} ${req.url}`);
    next();
});

// very unsecure login
app.post('/login', (req, res) => {
    if (!req.body || !req.body.username || !req.body.password)
        return res.status(400).send('Missing parameter');

    log(req.body.username, req.body.password);
    if (req.body.username !== settings.username || req.body.password !== settings.password)
        return res.status(401).send('Incorrect auth');

    token = crypto.randomBytes(20).toString('hex');
    res.send({
        token: token
    });
    // expire token after 5 min
    setTimeout(() => {
        token = null;
    }, 1000 * 60 * 5);
});

const auth = (req, res, next) => {
    // return next();
    if (!req.headers['authorization'])
        return res.status(400).send('Missing "authorization" header');
    if (req.headers['authorization'] !== token)
        return res.status(401).send('Invalid auth');
    next();
}

app.get('/users', auth, (req, res) => {
    res.send(api.listUsers());
});

app.get('/users/:id', auth, (req, res) => {
    if (!req.params || !req.params.id)
        return res.status(400).send('Missing parameter, requires "id" in "path"');
    const user = api.getUser(req.params.id);
    if (!user)
        return res.status(404).send('User does not exist');
    res.send(api.getUser(req.params.id));

});

app.post('/users', auth, (req, res) => {
    if (!req.body || !req.body.name || !req.body.id)
        return res.status(400).send('Missing parameter, requires "name" and "id" in "body"');
    api.addUser({
        name: req.body.name,
        id: req.body.id
    })
    res.send('Created');
});

app.delete('/users/:id', auth, (req, res) => {
    if (!req.params || !req.params.id)
        return res.status(400).send('Missing parameter, requires "id" in "path"');
    if (api.getUser(req.params.id)) {
        api.removeUser(req.params.id)
        res.send('Deleted');
    } else {
        return res.status(404).send('User does not exist');
    }
});

app.get('/logs', auth, (req, res) => {
    fs.readdir('logs', function (err, items) {
        res.send(items);
    });
})

app.listen(PORT, () => console.log(`*** App listening on port ${PORT}! ***`));

