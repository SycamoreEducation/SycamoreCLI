#! /usr/bin/env node
var config = require('./config.json')
var program = require('commander');
var request = require('request');

program
    .version('0.0.1')
    .usage('<keywords>')
    .option('-u, --user [alias]', 'The user object set up in the config file to use')
    .parse(process.argv);

if(!program.args.length){
    program.help();
}else{
    var endpoint = program.args;

    if(!program.user){
        var token = config.users.default.token;
    }else{
        var token = config.users[program.user].token;
    }

    console.log("Fetching endpoint " + endpoint + " with token " + token);

    request({
        
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        url: "https://app.sycamoreeducation.com/api/v1/"+endpoint
    
    }, function(error, response, body){
    
        if(!error && response.statusCode == 200){
            console.log(body);
        }else if(error){
            console.log("Error: " + error);
        }

    });

    console.log("Keywords: " + program.args);
}

