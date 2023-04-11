const AWS = require('aws-sdk');

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucketName: 'team1backendbucket',
};

const config = AWS.config.update({
  region: 'ap-south-1',
  accessKeyId: credentials.accessKeyId,
  secretAccessKey: credentials.secretAccessKey,
  bucketName: credentials.bucketName,
});

const podetails = 'podetails';
var dynamodb = new AWS.DynamoDB();
module.exports = { config, dynamodb, podetails, credentials };
