var express = require("express");
var logfmt = require("logfmt");
var app = express();
var fs = require('fs');
 
app.use(logfmt.requestLogger());

//use restify
var restify = require('restify');
var server = restify.createServer();
server
	.use(restify.fullResponse())
	.use(restify.bodyParser())
    .use(restify.queryParser())

server.get('/api/:dummy', function(req, res, next){
	console.log(JSON.stringify(req.params));
	
	var number = 1;
	var page = 1;
	if(req.params && req.params.search)
		number = req.params.search;
	if(req.params && req.params['result-page'])
		page = req.params['result-page'];
	var data = getProboResult(number, page);
	
	res.writeHead(200, {
		  'Content-Length': Buffer.byteLength(data),
		  'Content-Type': 'text/xml; charset=utf-8'
		});
//	res.send(data);
	res.write(data);
	res.end();
});

var port = Number(process.env.PORT || 5000);
server.listen(port, function(err){
    if (err)
        console.error(err)
    else
        console.log("Listening on " + port);
});

//
function getProboResult(number, page){
	var data = '';
	data += '<?xml version="1.0" encoding="utf-8" ?>\n';
	data += '<response>\n';
	data += '<APIversion>2.0</APIversion>\n';
	data += '<totalhits>' + number + '</totalhits>\n';
	data += '<searchresults>\n';
	data += getRecords(number, page);
	data += '</searchresults>\n';
	data += '</response>';
	return data;
}

function getRecords(number, page){
	var max=10;
	if((page*10)>number) 
			max = number - ((page-1)*10);
	var data = '';
	for(var i=1;i<=max;i++){
		var t = (page-1)*10+i;
		data += '<record>';
		data += '<url>http://sample/n' + t + '</url>';
		data += '<title>xxx | xxxx | xxxx | タイトル' + t + '</title>\n';
		data += '<summary>' + (function(){var k=''; for(var i=0;i<100;i++){k+='アピリオ'} return k})() 
		       + '</summary>\n';
		data += '<wordhits>' + t + '</wordhits>\n';
		data += '<wordweight>' + t + '</wordweight>\n';
		data += '<nearby>' + t + '</nearby>\n';
		data += '<resultid>' + t + '</resultid>\n';
		data += '</record>';
	}
	return data;
}
