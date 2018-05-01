const winston = require('winston')
const winstonRotator = require('winston-daily-rotate-file')

const consoleConfig = [
  new winston.transports.Console({
    'colorize': true
  })
];

const createLogger = new winston.Logger({
  'transports': consoleConfig
});


const successLogger = createLogger
successLogger.add(winstonRotator, {
  'name': 'access-file',
  'level': 'info',
  'dirname': './logs/',
  'filename': '%DATE%access.log',
  'json': false,
  'datePattern': 'YYYY-MM-DD-'
})

const errorLogger = createLogger
errorLogger.add(winstonRotator, {
  'name': 'error-file',
  'level': 'error',
  'dirname': './logs/',
  'filename': '%DATE%error.log',
  'json': false,
  'datePattern': 'YYYY-MM-DD-'
})

module.exports = {
  'successlog': successLogger,
  'errorlog': errorLogger
}
