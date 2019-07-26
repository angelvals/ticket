//run this query before connect to mysql
/*
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
  FLUSH PRIVILEGES;
*/
const mysql = require('mysql');
const port = 3306;

const server = mysql.createConnection({
  host: "remotemysql.com",
  user: "yWy6K9UVrq",
  password: "ZMVv7r74Zj",
  database: 'yWy6K9UVrq',
  port: port,
  multipleStatements: true
});

server.connect((err) => {
  if (err) throw err;
  console.log(`Connected to MySQL on port ${port}!!`);
});

module.exports = server;