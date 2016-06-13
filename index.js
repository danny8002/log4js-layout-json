"use strict";

var extract = require("./lib/Parser").extract;
var util = require('util');
var os = require('os');

function formatValue(fmt, value) {
    return value;
}


function toObj(fmt, args) {
    var obj = extract(fmt);
    var result = { message: obj.message };

    for (var i = 0; i < obj.pairs.length; ++i) {
        var pair = obj.pairs[i];
        var arg = args[i];
        result[pair.key] = formatValue(pair.value, arg);
    }

    return result;
}

function toDict(array) {
    var dict = {};
    array.forEach(function (k) { dict[k] = true; });
    return dict;
}


function configure(config) {

    var obj2strItems = toDict(config.obj2str || []);
    var includes = Object.keys(toDict(Object.keys(obj2strItems).concat(config.includes || [])));


    var hasHostName = includes.indexOf("hostname") >= 0;
    var hasPid = includes.indexOf("pid") >= 0;

    function format(evt) {
        var output = {};

        for (var i = 0; i < includes.length; ++i) {
            var f = includes[i];
            output[f] = evt[f];
            if (obj2strItems[f] === true) {
                output[f] = evt[f].toString();
            }
        }
        // predefined item

        if (hasHostName && output["hostname"] === undefined) {
            output.hostname = os.hostname();
        }

        if (hasPid && output["pid"] === undefined) {
            output.pid = process.pid;
        }

        if (evt.data && Array.isArray(evt.data) && evt.data.length > 0) {
            output.data = toObj(evt.data[0], evt.data.slice(1));
        }

        return output;
    }

    // https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/log4js
    // see Layout/LogEvent definition
    return function jsonLayout(evt) {
        var output = format(evt);
        return JSON.stringify(output);
    }
}

exports = module.exports = configure;