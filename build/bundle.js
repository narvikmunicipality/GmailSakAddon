var concat = require('concat');
var glob = require('glob');
var fs = require('fs');


concat(glob.sync('./src/*.js', {}).concat(glob.sync('./spec/*.js', {})), './build/generated/bundled.js');