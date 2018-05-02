require('dotenv').config()
//In prod I have to use below to load the environment variables
//require('dotenv').config({ path: `C:/signature/.env` })
var Promise = require('promise')
var moment = require('moment')
var CronJob = require('cron').CronJob

var sigs = require('./signature/functions.js')
const logger = require('./util/logger').log

logger.info(`App started`)

sigs.getSignatures().then(result => {
  if (result) {
    sigs.saveSignaturesToDisk(result).then(apps => {
      sigs.updateDatabase(apps).then(success => {
        var logTime = moment().format('MM/DD/YYYY hh:mm:ss A')

        logger.info(`Process completed: ${logTime}`);
      }).catch(error => {
        logger.error(`Error Message: ${error}`)
      })
    }).catch(error => {
      logger.error(`Error Message: ${error}`)
    })
  }
})

var job = new CronJob({
  cronTime: '00 00 * * * *',
  onTick: function() {
    sigs.getSignatures().then(result => {
      if (result) {
        sigs.saveSignaturesToDisk(result).then(apps => {
          sigs.updateDatabase(apps).then(success => {
            var logTime = moment().format('MM/DD/YYYY hh:mm:ss A')
    
            logger.info(`Process completed: ${logTime}`);
          }).catch(error => {
            logger.error(error)
          })
        }).catch(error => {
          logger.error(error)
        })
      }
    })
  },
  start: true,
  timeZone: 'America/Chicago'
})
