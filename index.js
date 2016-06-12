"use strict";

var extract = require("./lib/Parser");
var util = require('util');

console.log(util.format(" key=%d, key2=%d, key3=%d", 5, undefined, NaN));
console.log(util.inspect(null));
console.log(util.inspect(undefined));


function toObj(args) {
    var fmt = args[0];
    var obj = extract(fmt);
    var result = { message_: obj.message };

    for (var i = 0; i < obj.pairs.length; ++i) {
        var pair = obj.pairs[i];

        var arg = args[i + 1];

        result[pair.key] = util.format(pair.value, arg);
    }

    return result;
}

function wrapErrorsWithInspect(items) {
    return items.map(function (item) {
        if ((item instanceof Error) && item.stack) {
            return {
                inspect: function () {
                    return util.format(item) + '\n' + item.stack;
                }
            };
        } else {
            return item;
        }
    });
}

function formatLogData(logData) {
    var data = Array.isArray(logData) ? logData : Array.prototype.slice.call(arguments);
    return util.format.apply(util, wrapErrorsWithInspect(data));
}

function jsonLayout(config) {

    function formatter(evt) {
        var output = {
            "startTime": evt.startTime,
            "categoryName": evt.categoryName,
            "level": evt.level.levelStr
        };

        if (evt.data) {
            output.data = toObj(evt.data);
        }

        // if (config.source) {
        //     output.source = config.source;
        // }

        // if (output.data) {
        //     output.data = formatLogData(output.data);
        // }

        // if (config.include && config.include.length) {
        //     var newOutput = {};
        //     config.include.forEach(function (key) {
        //         if (output.hasOwnProperty(key)) {
        //             newOutput[key] = output[key];
        //         }
        //     });
        //     return newOutput;
        // } else {
        //     return output;
        // }
    }

    return function layout(data) {
        var output = formatter(data);
        return JSON.stringify(output);
    }
}