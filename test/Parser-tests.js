var assert_ = require("assert");
var mocha_ = require("mocha");

var parser = require("../lib/Parser").extract;

function matchPair(pair, k, v) {
    assert_.strictEqual(pair.key, k);
    assert_.strictEqual(pair.value, v);
}

describe("Parser-tests", function () {

    it("only message", function () {

        var msgs = ["my message.", "my message %d", "my message=%n"]

        for (var i = 0; i < msgs.length; ++i) {
            var msg = msgs[i];
            var obj = parser(msg);
            assert_.strictEqual(obj.message, msg);
            assert_.strictEqual(obj.pairs.length, 0);
        }
    })

    it("message with pair", function () {

        var msgs = [
            "my message key=%d",
            "my message, key=%d",
            "my message. key=%d",
            "my message? key=%d",
            "my message,key=%d",
            "my message.key=%d",
            "my message?key=%d",
            "my message ?key=%d",
            "my message ? key=%d"
        ];

        for (var i = 0; i < msgs.length; ++i) {
            var msg = msgs[i];
            var obj = parser(msg);
            assert_.strictEqual(obj.message, "my message");
            matchPair(obj.pairs[0], "key", "%d");
        }
    })

    it("parser pair", function () {

        var msg1 = "my message key0:%d key1=%s, key2 = %d, key3: %j key4 =%d;key5=[%d], key6={%d}";
        var obj = parser(msg1);

        assert_.strictEqual(obj.message, "my message");
        matchPair(obj.pairs[0], "key0", "%d");
        matchPair(obj.pairs[1], "key1", "%s");
        matchPair(obj.pairs[2], "key2", "%d");
        matchPair(obj.pairs[3], "key3", "%j");
        matchPair(obj.pairs[4], "key4", "%d");
        matchPair(obj.pairs[5], "key5", "%d");
        matchPair(obj.pairs[6], "key6", "%d");
    })

    it("parser pair stop when enconter unknown token", function () {

        var msg1 = "my message key0:%d key1=%m, key2 = %d";
        var obj = parser(msg1);

        assert_.strictEqual(obj.message, "my message");
        matchPair(obj.pairs[0], "key0", "%d");
    })
});