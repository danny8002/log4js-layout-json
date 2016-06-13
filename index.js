"use strict";

var extract = require("./lib/Parser");
var util = require('util');
var os = require('os');

var now = new Date();
console.log(now.toISOString());
console.log(now.getTimezoneOffset());
console.log(JSON.stringify({ time: now }))

console.log(util.format(" key=%d, key2=%d, key3=%d", 5, undefined, NaN));
console.log(util.inspect(null));
console.log(util.inspect(undefined));

var ifaces = os.networkInterfaces();


Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }

        if (alias >= 1) {
            // this single interface has multiple ipv4 addresses
            console.log(ifname + ':' + alias, iface.address);
        } else {
            // this interface has only one ipv4 adress
            console.log(ifname, iface.address);
        }
        ++alias;
    });
});


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

function configure(config) {

    var fields = {};
    (config.includes || ["timestamp", "category", "hostname", "pid"]).forEach(function (f) {
        fields[f] = true;
    });

    function format(evt) {
        var output = {};
        if (fields.timestamp) {
            output.timestamp = evt.startTime;
        }
        if (fields.category) {
            output.category = evt.categoryName;
        }

        output.level = evt.level.levelStr;

        if (fields.hostname) {
            output.hostname = os.hostname();
        }

        if (fields.pid) {
            output.pid = process.pid;
        }

        if (config.source) {
            output.source = config.source;
        }

        if (evt.data) {
            output.data = toObj(evt.data);
        }
    }

    // https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/log4js
    // see Layout/LogEvent definition
    return function jsonLayout(evt) {
        var output = format(evt);
        return JSON.stringify(output);
    }
}