const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
const port = 12345;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/form-data', (req, res) => {
    console.log('[Forms server][POST]', req.url, req.body);
    res.json(req.body);
})

app.get('/user', (req, res) => {
    console.log('[Forms server][GET]', req.url, req.query);
    res.send(req.query);
})

const server = app.listen(port, () => {
    console.log(`Forms server spawned and listening at http://localhost:${port}`)
})

function closeServer() {
    server.close();
    console.log('Forms server has been shut down.');
}

app.on('exit', closeServer);
app.on('uncaughtException', closeServer);
app.on('SIGTERM', closeServer);