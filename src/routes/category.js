const express = require('express')
const router = express.Router()
const server = require('../config/server');

router.get('/', async(req, res) => {
    server.query(`
        select * from category;
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
    if(!req.body.name || !req.body.msg) throw 'All fields are needed!';
    const sql = `
        insert into category (nombre, descripcion)
        values('${req.body.name}', '${req.body.msg}');
    `;
    server.query(sql, (err, result) => {
        if (err) throw err;
        res.send({
            success: true,
            message: 'Category created',
            result: []
        });
    });
})

router.put('/:id', async(req, res) => {
    if(!req.params.id || !Number.isInteger(req.params.id*1)) throw 'id needed!'
    const sql = `
        update category
        set nombre = '${req.body.name}', descripcion = '${req.body.msg}' where id = ${req.params.id});
    `;
    server.query(sql, (err, result) => {
        if (err) throw err;
        res.send({
            success: true,
            message: 'Category updated',
            result: []
        });
    });
})

router.delete('/:id', async(req, res) => {
    if(!req.params.id || !Number.isInteger(req.params.id*1)) throw 'id needed!'
    const sql = `
        delete from category where id = ${req.params.id};
    `;
    server.query(sql, (err, result) => {
        if (err) throw err;
        res.send({
            success: true,
            message: 'Category deleted',
            result: []
        });
    });
})

module.exports = router