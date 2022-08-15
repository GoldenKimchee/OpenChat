const moment = require('moment');

function formatMessage(username, text) {
  // 'h:mm a' represents hour, minutes, and am/pm
  return {
    username,
    text,
    time: moment().format('h:mm a')
  }
}

module.exports = formatMessage;