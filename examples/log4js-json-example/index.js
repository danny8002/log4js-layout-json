"use strict";

var log4js = require("log4js");

var jsonLayout = require('string-format-json');
log4js.layouts.addLayout('my-json', jsonLayout);

var cfg = require("./log4js.config.json");
log4js.configure(cfg);

var log = log4js.getLogger();

log.info("arguments name:%s, year= %d, info= [%j]","Microsoft",100,{a:5,b:6});


