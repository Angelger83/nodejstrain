var cluster = require('cluster');

var express = require('express');

/* if (cluster.isMaster) {

	var cpucount = require('os').cpus().length;

	console.log(cpucount);

	for(var i=0; i<cpucount; i+=1){
		cluster.fork();
	}

} else {
		var app = express();
		app.get('/getmydata', (req,res)=>{
			res.send('hello from cluster ' + cluster.worker.id)	
		});

			cluster.on('exit', function(worker){
			console.log('worker died ' , worker.id);
			cluster.fork();
		})

		app.listen(3000);
	}
*/

if(cluster.isMaster) {
    var numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    var app = require('express')();
    app.all('/*', function(req, res) {res.send('process ' + process.pid + ' says hello!').end();})

    var server = app.listen(8000, function() {
        console.log('Process ' + process.pid + ' is listening to all incoming requests');
    });
}



