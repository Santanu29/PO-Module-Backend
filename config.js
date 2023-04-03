const AWS = require('aws-sdk');
var DOC = require('dynamodb-doc');

const config = AWS.config.update({
  region: 'ap-south-1',
});

const podetails = 'podetails';
// let docClient = new AWS.DynamoDB.DocumentClient();
// var docClient = new DOC.DynamoDB();
var dynamodb = new AWS.DynamoDB();
module.exports = { config, dynamodb, podetails };
