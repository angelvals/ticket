const express = require('express')
const router = express.Router()
const server = require('../config/server')

router.get('/', async(req, res) => {
    server.query(`
        select p.*, c.nombre as "cat_lbl"
        from products p
            inner join category c on p.category_id = c.id
    `, (err, result) => {
        if (err) throw err;
        res.send({
            success: true,
            message: null,
            result: result
        });
    });
})

router.post('/', async(req, res) => {
    if(!req.body.name || !req.body.msg || !req.body.id_cat) throw 'All fields are needed!';
    const sql = `
        insert into products (nombre, descripcion, category_id)
        values('${req.body.name}', '${req.body.msg}', ${req.body.id_cat});
    `;
    server.query(sql, (err, result) => {
        if (err) throw err;
        res.send({
            success: true,
            message: 'Product created',
            result: []
        });
    });
})

router.put('/:id', async(req, res) => {
    if(!req.params.id || !Number.isInteger(req.params.id*1)) throw 'id needed!'
    const sql = `
        update products
        set nombre = '${req.body.name}', descripcion = '${req.body.msg}', category_id = ${req.body.id_cat} where id = ${req.params.id};
    `;
    server.query(sql, (err, result) => {
        if (err) throw err;
        res.send({
            success: true,
            message: 'Product updated',
            result: []
        });
    });
})

router.delete('/:id', async(req, res) => {
    if(!req.params.id || !Number.isInteger(req.params.id*1)) throw 'id needed!'
    const sql = `
        delete from products where id = ${req.params.id};
    `;
    server.query(sql, (err, result) => {
        if (err) throw err;
        res.send({
            success: true,
            message: 'Product deleted',
            result: []
        });
    });
})

module.exports = router