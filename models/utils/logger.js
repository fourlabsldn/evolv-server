const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: './server-logs.log',
      json: false
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: './server-exceptions.log' })
  ]
});

module.exports = logger;
