"use strict";

exports = module.exports;

var reg0 = /[\s,.?][\s]*([0-9a-zA-Z_-]+)[\s]*([=:])[\s]*((%[sdj])|(\[%[sdj]\])|({%[sdj]}))/
var regKV = /^[\s]*[\s,.;][\s]*([0-9a-zA-Z_-]+)[\s]*([=:])[\s]*((%[sdj])|(\[%[sdj]\])|({%[sdj]}))/

function trimValuePlaceHolder(str) {
    var first = str.charAt(0);
    if (first == '{' || first == '[') str = str.substr(1);

    var last = str.charAt(str.length - 1);
    if (last == '}' || last == ']') str = str.substr(0, str.length - 1);
    return str;
}

function extract(source) {

    var message = "";
    var pairs = [];

    var str = source;

    var m0 = reg0.exec(str);

    if (m0 != null) {
        message = str.substr(0, m0.index).trim();
        str = str.substr(m0.index + m0[0].length);
        pairs.push({ key: m0[1], value: trimValuePlaceHolder(m0[3]) });

        while (true) {
            var mN = regKV.exec(str);
            if (mN == null) break;
            str = str.substr(mN.index + mN[0].length);
            pairs.push({ key: mN[1], value: trimValuePlaceHolder(mN[3]) });
        }
    }
    else {
        message = str;
    }

    return { message: message, pairs: pairs };
}



exports.extract = extract;