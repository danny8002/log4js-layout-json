# string-format-json
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
Output string with json format

# installation
```
npm install string-format-json --save
```

# What this library can do
  - Parse arguments (format, ...args[]) and convert to json
  - Coordinate with [log4js](https://github.com/nomiddlename/log4js-node)

# General minimal usage
```
var configure = require('string-format-json').configure;

// 'includes' defines the filter 
var jsonFormat = configure({
    includes: [ "author", "company" ]
});

// use the formater in custom function
function myTrace(){
    var args = Array.prototype.slice.apply(arguments);
    var evt = {
        author: "My Author",
        company: "Microsoft",
        data: args
    }
    return jsonFormat(evt);
}

myTrace("my arguments. name=%s age=%d profile=%j", "MyName", 26, { a: 5, b: 6 });

=> 
        {
            "author" : "My Name",
            "company" : "Microsoft",
            "data" :
            {
                "message" : "my arguments",
                "name" : "MyName",
                "age" : 26,
                "profile" :
                {
                    "a" : 5,
                    "b" : 6
                }
            }
        }

```

# [log4js](https://github.com/nomiddlename/log4js-node) usage
This library is **compitable** with log4js and you just add the following snippet into your appender config
```
"layout": {
    "type": "json",
    "includes": ['startTime', 'categoryName', 'hostname', 'pid']
}
```
## Example
- Add layout in your log4js cofiguration file (eg. log4js.config.json)
```
{
    "appenders": [
        {
            "type": "console",
            "layout": {
                "type": "TYPE_A_NAME_HERE",
                "includes": ["startTime", "categoryName", "hostname", "pid"],
                "obj2Str": ["level"]
            }
        }
    ]
}
```
- Use it in your code

```
var log4js = require('log4js');
var jsonLayout = require('string-format-json');

log4js.layouts.addLayout('TYPE_A_NAME_HERE', jsonLayout);

var cfg = require("./log4js.config.json");
log4js.configure(cfg);

var log = log4js.getLogger();

log.info("arguments name:%s, year= %d, info= [%j]","Microsoft",100,{a:5,b:6});
// => {"level":"INFO","startTime":"2016-06-13T11:41:44.279Z","categoryName":"[default]","hostname":"xxx","pid":52048,"data":{"message":"arguments","name":"Microsoft","year":100,"info":{"a":5,"b":6}}}
```
