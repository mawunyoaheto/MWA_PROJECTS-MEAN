const express = require('express');
require("dotenv").config();
const app = express();
require('./api/data/db');
const movies_routes = require("./api/routes/index"); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api', movies_routes);

const server = app.listen(process.env.PORT, () => {
    const port = server.address().port;
    console.log(process.env.LISTEN_TO_PORT_MSG + ' ' + process.env.HOST + port);
});