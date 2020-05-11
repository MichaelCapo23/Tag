const express = require('express');
const app = express();
const mysql_creds = require('./mysql_creds');
const mysql = require('mysql');
const db = mysql.createConnection(mysql_creds);
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '25mb'}));
app.use(express.json());
app.use(cors());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

//  GET route to show the backend is hooked up
app.get('/express_backend', (req, res) => {
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

require('./login')(app, db);