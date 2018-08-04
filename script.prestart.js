const pathExists = require('path-exists')
pathExists('.out').then(isExist => !isExist && require('./start.js'))