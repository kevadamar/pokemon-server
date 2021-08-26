require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./src/routes');
const app = express();
const http = require('http').createServer(app)

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const PORT = 5000;

app.use('/api/v1', router);

http.listen(PORT, () => console.log(`server running on port : ${PORT}`));
