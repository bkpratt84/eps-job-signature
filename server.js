require('dotenv').config()
var Promise = require('promise')
var sigs = require('./signature/functions.js')
var moment = require('moment')

sigs.getSignatures().then(result => {
  if (result) {
    sigs.saveSignaturesToDisk(result).then(apps => {
      sigs.updateDatabase(apps).then(success => {
        console.log(success + ' @ ' + moment().format('MM/DD/YYYY hh:mm:ss A'))
      }).catch(error => {
        console.log(error)
      })
    }).catch(error => {
      console.log(error)
    })
  }
})



var CronJob = require('cron').CronJob;
var job = new CronJob({
  cronTime: '00 00 * * * *',
  onTick: function() {
    console.log(moment().format('MM/DD/YYYY hh:mm:ss A'))
  },
  start: true,
  timeZone: 'America/Chicago'
})