var assert_ = require("assert");
var mocha_ = require("mocha");

var parser = require("../lib/Parser");

function matchPair(pair, k, v) {
    assert_.strictEqual(pair.key, k);
    assert_.strictEqual(pair.value, v);
}

describe("Parser-tests", function () {

    it("parser message", function () {

        var msg1 = "my message key0:%d key1=%s, key2 = %d, key3: %j key4 =%d";
        var obj = parser(msg1);

        assert_.strictEqual(obj.message, "my message");
        matchPair(obj.pairs[0],"key0","%d");
        matchPair(obj.pairs[1],"key1","%s");
        matchPair(obj.pairs[2],"key2","%d");
        matchPair(obj.pairs[3],"key3","%j");
        matchPair(obj.pairs[4],"key4","%d");
    })
});