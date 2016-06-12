"use strict";

var reg0 = /[\s,.?]([0-9a-zA-Z_-]+)[\s]*([=:])[\s]*(%[sdj])/
var regKV = /^[\s]*[\s,.][\s]*([0-9a-zA-Z_-]+)[\s]*([=:])[\s]*(%[sdj])/

function extract(source) {

    var message = "";
    var pairs = [];

    var str = source;

    var m0 = reg0.exec(str);

    if (m0 != null) {
        message = str.substr(0, m0.index);
        str = str.substr(m0.index + m0[0].length);
        pairs.push({ key: m0[1], value: m0[3] });

        while (true) {
            var mN = regKV.exec(str);
            if (mN == null) break;
            str = str.substr(mN.index + mN[0].length);
            pairs.push({ key: mN[1], value: mN[3] });
        }
    }
    else {
        message = str;
    }

    return { message: message, pairs: pairs };
}

exports = module.exports = extract;