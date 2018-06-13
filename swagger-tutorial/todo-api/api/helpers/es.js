'use strict';

var Elasticseatch = require('elasticsearch');
var client = new Elasticseatch.Client({
    host: 'localhost:9200',
    log: 'error'
})