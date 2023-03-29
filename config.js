const AWS = require('aws-sdk');

const config = AWS.config.update({
  region: 'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: 'http://localhost:8000',
});

// const dynamo = new AWS.DynamoDB.DocumentClient();

const podetails = 'podetails';

var dynamodb = new AWS.DynamoDB();
module.exports = { config, dynamodb, podetails };
