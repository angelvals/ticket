//run this query before connect to mysql
/*
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
  FLUSH PRIVILEGES;
*/
const mysql = require('mysql');
const port = 3306;

const server = mysql.createConnection({
  host: "remotemysql.com",
  user: "beiwdYNJAs",
  password: "ntXfeiAPgs",
  database: 'beiwdYNJAs',
  port: port,
  multipleStatements: true
});

server.connect((err) => {
  if (err) throw err;
  console.log(`Connected to MySQL on port ${port}!!`);
});

module.exports = server;