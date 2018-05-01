require('dotenv').config()
var Promise = require('promise')
var moment = require('moment')
var CronJob = require('cron').CronJob

var sigs = require('./signature/functions.js')
const successLog = require('./util/logger').successlog
const errorLog = require('./util/logger').errorlog

successLog.info(`App started`)

var job = new CronJob({
  cronTime: '00 00 * * * *',
  onTick: function() {
    sigs.getSignatures().then(result => {
      if (result) {
        sigs.saveSignaturesToDisk(result).then(apps => {
          sigs.updateDatabase(apps).then(success => {
            var logTime = moment().format('MM/DD/YYYY hh:mm:ss A')
    
            successLog.info(`Process completed: ${logTime}`);
          }).catch(error => {
            errorLog.error(`Error Message: ${error}`)
          })
        }).catch(error => {
          errorLog.error(`Error Message: ${error}`)
        })
      }
    })
  },
  start: true,
  timeZone: 'America/Chicago'
})
