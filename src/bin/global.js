#!/usr/bin/env node

// Delete the 0 and 1 argument (node and script.js)
var args = process.argv.splice(process.execArgv.length + 2);

var fileName = args[0];

var testMyRide = require('../index');

testMyRide.default(fileName);
