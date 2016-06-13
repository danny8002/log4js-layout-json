# linq-regex
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

# installation
```
npm install jog4js-layout-json
```

# usage
layout should be type 'json'

currently we support include options only, array of items is expected
log object will contain these properties : ["startTime","categoryName","data","level"]
source param will be added to each json object if provided 

```
var log4js = require('log4js');
var jsonLayout = require('jog4js-layout-json');

log4js.layouts.addLayout('json', jsonLayout);

appenders = [{
    type: 'console',
    layout: {
        type: 'json',
        source : 'development',
        include: ['timestamp', 'category','hostname','pid','ip']
    }
  }
];

```