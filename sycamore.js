#! /usr/bin/env node
var fs = require('fs');
var program = require('commander');
var request = require('request');
var userhome = require('userhome');
var prettyjson = require('prettyjson');

var configFile = userhome('.sycamorecli.json');
if(!fs.existsSync(configFile)){
    //config doesn't exist yet and needs to be created
    console.log("No config file present.");
    console.log("Creating file at " + configFile);
    console.log("Please edit the config file and add your unique settings.");
    fs.writeFileSync(configFile, fs.readFileSync(__dirname+"/.sycamorecli.json"));
}

var config = JSON.parse( fs.readFileSync(userhome(configFile), 'utf8')  );

program
    .version('0.0.1')
    .usage('<endpoint>')
    .option('-u, --user [string]', 'Which user to send the request as')
    .option('-t, --token [string]', 'Specific token to use for this request')
    .option('-v, --verbose', 'Display additional details about request')
    .parse(process.argv);

if(!program.args.length){
    program.help();
}else{
    var endpoint = program.args;

    if(!program.token){
        if(!program.user){
            try{
                var token = config.users.default.token;
            }catch(e){
                console.log("No default user defined!");
                program.help();
            }
        }else{
            try{
                var token = config.users[program.user].token;
            }catch(e){
                console.log("Requested user is not defined!");
                program.help();
            }
        }
    }else{
        var token = program.token;
    }
    
    if(program.verbose){
        console.log("Fetching endpoint " + endpoint);
        console.log("Using token " + token);
    }

    request({
        
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        url: "http://dev.sycamoreeducation.com/api/v1/"+endpoint
    
    }, function(error, response, body){
    
        if(!error){
            if(program.verbose)
                console.log("Response code: " + response.statusCode);
        
            console.log( prettyjson.render( JSON.parse(body) ) );
        }else{
            console.log("Error: " + error);
        }

    });
}
