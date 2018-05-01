var sql = require('mssql')
var Promise = require('promise')

const config = {
    user: process.env.db_user,
    password: process.env.db_password,
    server: process.env.db_server,
    port: process.env.db_port,
    database: process.env.db_database
}

var dbConnection = null

var Obj = function() {};

Obj.prototype.getDatabaseConnection = function() {
    if (dbConnection) {
        return dbConnection
    }

    return dbConnection = new Promise(function(resolve, reject) {
        var conn = new sql.ConnectionPool(config)

        conn.connect()
        .then (pool => {
            return resolve(pool)
        })
        .catch (error => {
            return reject(error)
        })
    })
}

module.exports = new Obj()
