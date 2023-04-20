const express = require('express')
const mysql2 = require('mysql2/promise')

const app = express()
const port = 3000

const config = {
    connectionLimit: 10,
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
}

const pool = mysql2.createPool(config);

async function verifyIfTablePeopleExists() {

    const sql = `show tables in nodedb where tables_in_nodedb = 'people'`

    const result = await pool.query(sql)

    return result[0].length > 0
}

async function createTablePeople() {

    console.log('creating table "people"')

    const sql = `create table people(id int not null auto_increment, name varchar(255), primary key(id))`

    const result = await pool.query(sql)

    console.log('table "people" created')
}

async function insertPerson(name) {

    const sql = `insert into people(name) value(?)`

    const result = await pool.query(sql, [name + ' ' + Date.now()])
}

async function listPeople() {

    const sql = `select * from people`

    const result = await pool.query(sql)

    return result[0]
}

app.get('/', async (req, res) => {

    tablePeopleExists = await verifyIfTablePeopleExists();

    if (tablePeopleExists) {
        console.log('table "people" already exists')
    } else {
        await createTablePeople()
    }

    await insertPerson('name test')

    list = await listPeople();

    res.send(`<h1>Full Cycle Rocks!</h1><pre><code>${JSON.stringify(list, null, 4)}</code></pre>`)
})

app.listen(port, () => {
    console.log('app running on port ' + port)
})