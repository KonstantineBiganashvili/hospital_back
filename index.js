require('dotenv').config();
const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 5000;
const routes = require('./app/router/user.router');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port);
