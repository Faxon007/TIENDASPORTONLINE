import dynamodb from 'dynamodb-local';

const port = 8000;

dynamodb.launch(port, null, ["-sharedDb"], false, true)
  .then(() => {
    console.log(`DynamoDB corriendo en http://localhost:${port}`);
  })
  .catch((err) => {
    console.error("Error iniciando DynamoDB:", err);
  });