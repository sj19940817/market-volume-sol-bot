const express = require('express')
const app = express();
const path = require('path');
const router = require('./routes');
const bodyParser = require('body-parser');

// set middleware
// when setting middleware, we use app.use()
app.use(bodyParser.json());
// set the public path of backend
app.use(express.static(path.join(__dirname, 'public')));

// add routes
router(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app;