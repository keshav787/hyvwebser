'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request')

const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.get('/test', function (req, res) {
    console.log("Inside test");
    if(req.query.qtext)
        {
    var q = req.query.qtext;
    console.log("Search query is" + req.query.qtext);
    var url = 'https://api.wit.ai/message?q='
    var output = {}

    var intentV
    var intentN
    var modifiedq = q.replace(/ /g, "+")
    var modifiedurl = url.concat(modifiedq).concat('&access_token=GZ35BVVG2TKWIQCH6RBM6KUJEQTBLPYV')
    request(modifiedurl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body)
            var obj = JSON.parse(body);

            if (obj.entities.product) {
                output["Product"] = obj.entities.product[0].value;

            }
            else {
                output["Product"] = "NA";
            }

            if (obj.entities.attribute) {
                output["Attribute"] = obj.entities.attribute[0].value;

            }
            else {
                output["Attribute"] = "NA";
            }

            if (obj.entities.amount_of_money) {

                if (obj.entities.amount_of_money[0].to) {
                    console.log("Maximum price provided");
                    output["Price"] = "max:$".concat(obj.entities.amount_of_money[0].to.value);
                }
                else if (obj.entities.amount_of_money[0].from) {
                    console.log("Minimum price provided");
                    output["Price"] = "min:$".concat(obj.entities.amount_of_money[0].from.value);
                }
                else {
                    output["Price"] = "$".concat(obj.entities.amount_of_money[0].value);
                }


            }
            else {
                output["Price"] = "NA";
            }


        }
        console.log(output);
        //res.send('Response send to client::' + JSON.stringify(output));
        res.send(output);
    });

 
        }
    else
        {
            res.send("Query text cannot be empty....");
        }

});



restService.post('/anotherecho', function (req, res) {

    console.log("In another echo");

});

restService.get('/getecho', function (req, res) {

    console.log("In get echo");

});



restService.listen((process.env.PORT || 8147), function () {
    console.log("Server up and listening");
});
