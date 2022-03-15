const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 12345;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/form-data', (req, res) => {
    console.log('[Forms server][POST]', req.url, req.body);
    res.json(req.body);
});

app.get('/user', (req, res) => {
    console.log('[Forms server][GET]', req.url, req.query);
    res.send(req.query);
});

app.get('/user-exists', (req, res) => {
    const username = req.query.username;
    const allUsers = ['username1', 'username2', 'username3'];
    res.json(allUsers.indexOf(username) !== -1);
});

const server = app.listen(port, () => {
    console.log(`Forms server spawned and listening at http://localhost:${port}`);
});

// eslint-disable-next-line require-jsdoc
function closeServer() {
    server.close();
    console.log('Forms server has been shut down.');
}

app.on('exit', closeServer);
app.on('uncaughtException', closeServer);
app.on('SIGTERM', closeServer);
