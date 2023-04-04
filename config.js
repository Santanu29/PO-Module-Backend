const AWS = require("aws-sdk");
var DOC = require("dynamodb-doc");

const credentials = {

  accessKeyId: "RY4H7AV5",

  secretAccessKey: "D",

  bucketName: "team1backendbucket",

};

const config = AWS.config.update({
  region: "ap-south-1",
  accessKeyId: credentials.accessKeyId,
  secretAccessKey: credentials.secretAccessKey,
  bucketName: credentials.bucketName,
});

const podetails = "podetails";
var dynamodb = new AWS.DynamoDB();
module.exports = { config, dynamodb, podetails, credentials };
