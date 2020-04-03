const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();/* ,
	HTML_FILE = path.join(__dirname, 'index.html'); */

const server = require('http').createServer(app);

app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`App listening to ${PORT}....`);
	console.log(`${__dirname}`);
	console.log('Press Ctrl+C to quit.');
});