const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser  = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/src/views'));
app.use('/scripts', express.static(__dirname + '/src/scripts'));
app.use('/styles', express.static(__dirname + '/src/styles'));
app.listen(port);
console.log(`
Server running, listening on port ${port}!
`);
const products = require('./src/routes/products')
const category = require('./src/routes/category')

//API routes
app.use('/products', products)
app.use('/category', category)

//404 handler
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
    //res.sendFile('/404.html', {root: __dirname });
});
//Internal server error handler
app.use((err, req, res, next) => {
    if(err.stack) console.error(err.stack);
    res.status(500).send({
        success: false,
        message: 'Internal server error',
        result: err
    });
});