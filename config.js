const AWS = require("aws-sdk");

const config = AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1",
});

const podetails = "podetails";

var dynamodb = new AWS.DynamoDB();
module.exports = { config, dynamodb, podetails };
