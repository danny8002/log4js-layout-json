var assert_ = require("assert");
var mocha_ = require("mocha");

var jsonConfigure = require("../index");

function mockLogEvent() {
    var args = Array.prototype.slice.apply(arguments);

    return {
        level: { levelStr: "Debug" },
        startTime: new Date(),
        categoryName: 'Category',
        data: args
    }
}

describe("Layout-tests", function () {
    var config = { includes: null };
    var layout;

    before("configuration", function () {
        config = {
            includes: ['startTime', 'categoryName', 'level', 'hostname', 'pid'],
            obj2str: ['level']
        };

        layout = jsonConfigure(config);
    })

    it("empty log event", function () {
        var evt = mockLogEvent();
        var str = layout(evt);

        assert_.equal(typeof str, "string");

        var obj = JSON.parse(str);

        assert_.notEqual(obj.startTime, null);
        assert_.notEqual(obj.categoryName, null);
        assert_.notEqual(obj.hostname, null);
        assert_.notEqual(obj.pid, null);

        assert_.equal(Object.keys(obj.data || {}).length, 0);
    })

    it("message and format placeholder", function () {

        var evt = mockLogEvent("my arguments. name:%s, year= %d, info= [%j]", "Microsoft", 100, { a: 5, b: 6 });
        var str = layout(evt);

        assert_.equal(typeof str, "string");

        var obj = JSON.parse(str);

        assert_.notEqual(obj.startTime, null);
        assert_.notEqual(obj.categoryName, null);
        assert_.notEqual(obj.hostname, null);
        assert_.notEqual(obj.pid, null);

        assert_.notEqual(obj.data.message, null);
        assert_.equal(obj.data.name, "Microsoft");
        assert_.equal(obj.data.year, "100");
        assert_.equal(obj.data.info.a, "5");
        assert_.equal(obj.data.info.b, "6");
    })
});

describe("Custom-evt-tests", function () {

    var myTrace;

    before("Setup mytrace function", function () {
        var jsonFormat = jsonConfigure({
            includes: [
                "author",
                "company"
            ]
        });

        myTrace = function () {
            var args = Array.prototype.slice.apply(arguments);
            var evt = {
                author: "My Author",
                company: "Microsoft",
                data: args
            }
            return jsonFormat(evt);
        }
    })

    it("format argument as json", function () {

        var str = myTrace("my arguments. name=%s age=%d profile=%j", "MyName", 26, { a: 5, b: 6 });
        var obj = JSON.parse(str);

        assert_.strictEqual(obj.author, "My Author");
        assert_.strictEqual(obj.company, "Microsoft");
        assert_.strictEqual(obj.data.message, "my arguments");
        assert_.strictEqual(obj.data.message, "my arguments");
        assert_.strictEqual(obj.data.name, "MyName");
        assert_.strictEqual(obj.data.age, 26);
        assert_.strictEqual(obj.data.profile.a, 5);
        assert_.strictEqual(obj.data.profile.b, 6);
    })





})