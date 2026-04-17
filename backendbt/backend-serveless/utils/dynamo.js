import AWS from 'aws-sdk';

const dynamo = new AWS.DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
  region: "us-east-1",
  accessKeyId: "fake",
  secretAccessKey: "fake",
});

module.exports = dynamo;