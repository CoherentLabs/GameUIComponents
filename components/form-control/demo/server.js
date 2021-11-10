const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
const port = 3000

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/form-data', (req, res) => {
    console.log('[POST]', req.url, req.body);
    res.json(req.body);
})

app.get('/user', (req, res) => {
    console.log('[GET]', req.url, req.query);
    res.send(req.query);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})