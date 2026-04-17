import AWS from 'aws-sdk';

const dynamo = new AWS.DynamoDB({
  endpoint: "http://localhost:8000",
  region: "us-east-1",
  accessKeyId: "fake",
  secretAccessKey: "fake",
});
const createTable = async (params) => {
  try {
    await dynamo.createTable(params).promise();
    console.log("Tabla creada:", params.TableName);
  } catch (e) {
    console.log("Error o ya existe:", params.TableName);
  }
};

(async () => {
  await createTable({
    TableName: "Products",
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    BillingMode: "PAY_PER_REQUEST",
  });

  await createTable({
    TableName: "Users",
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    BillingMode: "PAY_PER_REQUEST",
  });

  await createTable({
    TableName: "Carts",
    AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "S" },
      { AttributeName: "productId", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "userId", KeyType: "HASH" },
      { AttributeName: "productId", KeyType: "RANGE" },
    ],
    BillingMode: "PAY_PER_REQUEST",
  });

  await createTable({
    TableName: "Orders",
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    BillingMode: "PAY_PER_REQUEST",
  });
})();