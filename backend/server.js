'use strict'
const cors        = require('cors');
const authRoutes  = require('./auth/auth.routes');
const express     = require('express');
const propierties = require('./config/properties');
const DB          = require('./config/db');
const bodyParser  = require('body-parser')
// init DB
DB();

const app                   = express();
const router                = express.Router();
const bodyParserJSON        = bodyParser.json();
const bodyParserURLEncoded  = bodyParser.urlencoded({ extended: true });

app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);
app.use(cors());
app.use(express.static('./public'));
app.use('/api', router);
app.use( function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
authRoutes(router);
router.get('/', (req, res) => {
  res.send('Hello from home');
});
app.use(router);
app.listen(propierties.PORT, () => console.log(`Server runing on port ${propierties.PORT}`));