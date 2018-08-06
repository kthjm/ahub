const { pathExists } = require('fs-extra')
pathExists('.out').then(isExist => !isExist && require('./start.js'))