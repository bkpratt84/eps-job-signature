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


const logger = createLogger

logger.add(winstonRotator, {
  'name': 'access-file',
  'level': 'silly',
  'dirname': process.env.log_path,
  'filename': '%DATE%log.log',
  'json': false,
  'datePattern': 'YYYY-MM-DD-'
})

module.exports = {
  'log': logger,
}
