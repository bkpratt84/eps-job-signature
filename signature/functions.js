const sql = require('mssql')
const fs = require('fs')
const path = require('path')
const atob = require('atob')
const svg2img = require('svg2img-canvas-prebuilt')

const db = require('../db/db')
const jSig = require('./jsignaturehelper')
const errorLog = require('../util/logger').errorlog

var toUpdate = []

var Obj = function() {};

Obj.prototype.getSignatures = function() {
    return new Promise(function(resolve, reject) {
        db.getDatabaseConnection()
        .then(conn => {
            var request = new sql.Request(conn)

            var query = `
                        SELECT DISTINCT TOP 1
                            appID
                            ,esignature
                        FROM
                            EPS_OLR_Posting p
                            INNER JOIN olr_application app ON app.olr_applicationID = p.appID
                            LEFT JOIN EPS_OLR_Signature s ON s.applicationID = p.appID
                        WHERE
                            s.signatureID IS NULL
                        `

            request.query(query)
            .then(result => {
                return resolve(result.recordset)
            }).catch(error => {
                return reject(error)
            })
        }).catch(error => {
            return reject(error)
        })
    })
}

Obj.prototype.updateDatabase = function(apps) {
    return new Promise(function(resolve, reject) {
        if (apps && apps.length > 0) {
            var inClause = ''

            apps.map(result => {
                inClause = inClause + `(${result}),`
            })

            inClause = inClause.substring(0, inClause.length - 1)

            db.getDatabaseConnection()
            .then(conn => {
                var request = new sql.Request(conn)

                var query = `
                            INSERT INTO EPS_OLR_Signature (applicationID)
                            VALUES ${inClause}
                            `

                request.query(query)
                .then(result => {
                    return resolve('Process Completed')
                }).catch(error => {
                    return reject(error)
                })
            }).catch(error => {
                return reject(error)
            })
        }
    })
}

Obj.prototype.saveSignaturesToDisk = function(results) {
    return new Promise(function(resolve, reject) {
        var promises = results.map(result => {
            var ext = '.png'
            var filename = process.env.file_path + 'application_' + result.appID + ext

            var sig = result.esignature.replace('image/jsignature;base30,', '')
            var appID = result.appID

            var output = jSigHelper.base30toBase64SVG(sig)
            var data = atob(output[1])

            return fs.writeFilePromise(filename, data, appID)
        })

        Promise.all(promises).then(data => {
            return resolve(toUpdate)
        }).catch(err => {
            return reject(err)
        })
    })
}

fs.writeFilePromise = function(filename, data, appID) {
    return new Promise(function(resolve, reject) {
        svg2img(data, function(error, buffer) {
            if (error) {
                errorLog.error(`Error converting file: ${path.basename(filename)}`)
                return reject(error)
            }

            fs.writeFile(filename, buffer, function(error, data) {
                if (error) {
                    errorLog.error(`Error saving file: ${path.basename(filename)}`)
                    return reject(error)
                }
                
                toUpdate.push(appID)
                return resolve()
            })
        })
    })
}

module.exports = new Obj()
