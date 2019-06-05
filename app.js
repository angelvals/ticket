const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const request = require('request');
const bodyParser  = require('body-parser');
const server = require('./src/config/server');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use('/img', express.static(__dirname + '/src/img'));
app.use('/', express.static(__dirname + '/src/views'));
app.use('/scripts', express.static(__dirname + '/src/scripts'));
app.use('/styles', express.static(__dirname + '/src/styles'));
app.listen(port);
console.log(`
────────────────▄────────────────
──────────────▄▀░▀▄──────────────
────────────▄▀░░░░░▀▄────────────
──────────▄▀░░░░░░░░░▀▄──────────
────────▄█▄▄▄▄▄▄▄▄▄▄▄▄▄█▄────────
───────▄▀▄─────────────▄▀▄───────
─────▄▀░░░▀▄─────────▄▀░░░▀▄─────
───▄▀░░░░░░░▀▄─────▄▀░░░░░░░▀▄───
─▄▀░░░░░░░░░░░▀▄─▄▀░░░░░░░░░░░▀▄─
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
Server running, listening on port ${port}!
`);
//API Routes
app.post('/ticket', (req, res) => {
    if(!req.body.name || !req.body.email || !req.body.msg || !req.body.id_observacion || !req.body.id_peligro) throw 'All fields are needed!';
    const sql = `
        insert into ticket (name, email, msg, id_observacion)
        values('${req.body.name}','${req.body.email}','${req.body.msg}',${req.body.id_observacion});
    `;
    server.query(sql, (err, result) => {
        if (err) throw err;
        let sqlsub = ""
        req.body.id_peligro.forEach((value) => {
            sqlsub +=`
                insert into tbl_ticketpeligro (id_ticket, id_peligro)
                values(${result.insertId}, ${value});
            `;
        });
        server.query(sqlsub, (err) => {});
        res.send({
            success: true,
            message: 'Ticket created',
            result: []
        });
    });
});
app.get('/ticket', (req, res) => {
    getData().then(function(rows) { 
        res.send({
            success: true,
            message: null,
            result: rows
        });
    }).catch(function(err) { 
        console.error(err) 
    });
});
app.put('/ticket/:id', (req, res) => {
    if(!req.params.id || !Number.isInteger(req.params.id*1)) throw 'id needed!'
    const sql = `
        update 
            ticket 
        set
            name = ${ req.body.name ? `'${req.body.name}'` : 'name' },
            email = ${ req.body.email ? `'${req.body.email}'` : 'email' },
            msg = ${ req.body.msg ? `'${req.body.msg}'` : 'msg' },
            id_observacion = ${ req.body.id_observacion ? `'${req.body.id_observacion}'` : 'id_observacion' }
        where 
            id = ${req.params.id};
        delete from tbl_ticketpeligro where id_ticket = ${req.params.id};
    `;
    server.query(sql, (err) => {
        if (err) throw err;
        let sqlsub = ""
        req.body.id_peligro.forEach((value) => {
            sqlsub +=`
                insert into tbl_ticketpeligro (id_ticket, id_peligro)
                values(${req.params.id}, ${value});
            `;
        });
        server.query(sqlsub, (err) => {});
        res.send({
            success: true,
            message: 'Ticket updated',
            result: []
        });
    });
});
app.delete('/ticket/:id', (req, res) => {
    if(!req.params.id || !Number.isInteger(req.params.id*1)) throw 'id needed!'
    const sql = `
        delete from tbl_ticketpeligro where id_ticket = ${req.params.id};
        delete from ticket where id = ${req.params.id};
    `;
    server.query(sql, (err) => {
        if (err) throw err;
        res.send({
            success: true,
            message: 'Ticket deleted',
            result: []
        });
    });
});
app.get('/ticket/combolist', (req, res) => {
    server.query(`
        select * from tbl_observacion;
        select * from tbl_peligro;
    `, (err, result) => {
        if (err) throw err;
        res.send({
            success: true,
            message: null,
            result: {
                tbl_observacion: result[0],
                tbl_peligro: result[1],
            }
        });
    });
});

//Map routes
app.get('/map/buses/:route?', (req, res) => {
    const base = "http://developer.itsmarta.com/BRDRestService/BRDRestService.svc/";
    let query = "GetAllBus";

    request(base+query, function (error, response, body) {
        body = JSON.parse(body);
        if(req.params.route){
            body = body.filter(bus => { return bus['ROUTE'] == req.params.route });
            console.log(req.params.route)
        }
        res.send(body);
    });
})
app.get('/map/train', (req, res) => {
    if(!process.env.MARTA_API_KEY) throw 'MARTA API key needed!!';
    const base = `http://developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals?apikey=${process.env.MARTA_API_KEY}`;

    request(base, function (err, response, body) {
        if(err) throw err;
        if(response.statusCode == 401 || response.statusCode == 403) {
            res.status(response.statusCode).send({
                success: false,
                message: `Your API key seems to be invalid. Try visiting ${base}`,
                result: err
            });
        } else {
            res.send(JSON.parse(body));
        }
    });
})

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


//Nested data
async function getData() {
    var sql = `
        select 
            id, name, email, msg, tk.id_observacion, tbl_ob.descripcion as "ob_descripcion"
        from 
            ticket tk
        inner join tbl_observacion tbl_ob on tk.id_observacion = tbl_ob.id_observacion;
    `
    let promise = new Promise((resolve, reject) => {
      server.query(sql, async (err, resultSet) => { 
        if (err) reject(err);
        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array)
            }
        }
        const start = async () => {
            await asyncForEach(resultSet, async (row) => {
                let promisesub = new Promise((resolvesub, rejectsub) => {
                    server.query(`select * from tbl_ticketpeligro where id_ticket=${row.id}`, (err, rs) => { 
                        resolvesub(rs)       
                    }) 
                })
                row.id_peligro = await promisesub;
            });
            resolve(resultSet);
        };
        start();
      }) 
    })
    let result = await promise;
    return result;
};