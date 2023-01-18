/** postgres **/
const pg = require('pg');

const config = {
  host: 'localhost',
  user: 'postgres',
  password: 'test',
  database: 'nodejs',
  port: 5432,
  ssl: false
}

/** express */
var express = require("express");
var app = express();

const hostname = '127.0.0.1';
const port = 3001;

/** REST API */
app.listen(3001, () => {
 console.log(`Server running at http://${hostname}:${port}/`);
});

function _addCorsHeaders(res) {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', false);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
}

app.all('/*', async (req, res, next) => {
  _addCorsHeaders(res)
  const client = new pg.Client(config);
  await client.connect()
  res.locals.client = client
  next()
})

app.get('/user', async (req, res) => {
  try {
    const query = await res.locals.client.query(`select * from public.user where login = '${req.query.username}' and password = '${req.query.password}';`)
    res.statusCode = 200
    res.end(JSON.stringify(query.rows))
  }
  catch (e) {
    console.log(e)
    res.statusCode = 400
    res.end(e.detail)
  }
})

app.post('/user', async (req, res) => {
  try {
    const query = await res.locals.client.query(`insert into public.user (login, password) values ('${req.query.username}', '${req.query.password}')`)
    res.statusCode = 200
    res.end()
  }
  catch (e) {
    console.log(e)
    res.statusCode = 400
    res.end(e.detail)
  }
})

app.get('/todo_list', async (req, res) => {
  try {
    const query = await res.locals.client.query(`select id, title from todo_list where user_id = ${req.query.user_id} order by id asc`)
    res.statusCode = 200
    res.end(JSON.stringify(query.rows))
  }
  catch (e) {
    console.log(e)
    res.statusCode = 400
    res.end(e.detail)
  }
})

app.put('/todo_list', async (req, res) => {
  try {
    let query = await res.locals.client.query(`insert into todo_list (user_id, title) values (${req.query.user_id}, '${req.query.title}')`)
    query = await res.locals.client.query(`select max(id) as id from todo_list where user_id = ${req.query.user_id}`)
    res.statusCode = 200
    res.end(query.rows[0].id)
  }
  catch (e) {
    console.log(e)
    res.statusCode = 400
    res.end(e.detail)
  }
})

app.delete('/todo_list', async (req, res) => {
  try {
    let query = await res.locals.client.query(`delete from todo_list where id = ${req.query.id}`)
    res.statusCode = 200
    res.end()
  }
  catch (e) {
    console.log(e)
    res.statusCode = 400
    res.end(e.detail)
  }
})

app.post('/todo_list', async (req, res) => {
  try {
    const query = await res.locals.client.query(`update todo_list set title = '${req.query.title}' where id = ${req.query.id}`)
    res.status = 200
    res.end()
  }
  catch (e) {
    console.log(e)
    res.statusCode = 400
    res.end(e.detail)
  }
})

app.put('/todo_item', async (req, res) => {
  try {
    let query = await res.locals.client.query(`insert into todo_item (todo_list_id, label) values (${req.query.list_id}, '${req.query.label}')`)
    query = await res.locals.client.query(`select max(id) as id from todo_item where todo_list_id = ${req.query.list_id}`)
    res.statusCode = 200
    res.end(query.rows[0].id)
  }
  catch (e) {
    console.log(e)
    res.statusCode = 400
    res.end(e.detail)
  }
})

app.get('/todo_item', async (req, res) => {
  try {
    const query = await res.locals.client.query(`select id, label, checked from todo_item where todo_list_id = ${req.query.id} order by id asc`)
    res.statusCode = 200
    res.end(JSON.stringify(query.rows))
  }
  catch (e) {
    console.log(e)
    res.statusCode = 400
    res.end(e.detail)
  }
})

app.post('/todo_item', async (req, res) => {
  try {
    const query = await res.locals.client.query(`update todo_item set label = '${req.query.label}', checked = ${req.query.checked} where id = ${req.query.id}`)
    res.statusCode = 200
    res.end()
  }
  catch (e) {
    console.log(e)
    res.statusCode = 400
    res.end(e.detail)
  }
})

app.delete('/todo_item', async (req, res) => {
  try {
    const query = await res.locals.client.query(`delete from todo_item where id = ${req.query.id}`)
    res.statusCode = 200
    res.end()
  }
  catch (e) {
    console.log(e)
    res.statusCode = 400
    res.end(e.detail)
  }
})
