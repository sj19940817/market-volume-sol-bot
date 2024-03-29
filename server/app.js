const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const wallet = require('./config/walllet.json');
const {
    Connection,
    Keypair,
    VersionedTransaction,
  } = require("@solana/web3.js");
// set middleware
// when setting middleware, we use app.use()
app.use(bodyParser.json());

// set the public path of backend
// app.use(express.static(path.join(__dirname, 'public')));

// allow the cors error
const corsOpts = {
    origin: '*',
    credentials: true,
    methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Content-Type']
};
app.use(cors(corsOpts));

const connection = new Connection(
    "https://fittest-broken-bush.solana-mainnet.quiknode.pro/a57dd3d0fd839be918751678fe243f9fb742fd60/",
    "confirmed"
  );

app.get('/', (req, res) => {
    
    console.log('requested', req.query);
    const tokenaddress = req.query
    
    res.status(200).json({"tokenaddress":tokenaddress})

})

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

module.exports = app;