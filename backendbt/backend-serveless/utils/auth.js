import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { db } from "../data/db.js";
import AWS from 'aws-sdk';
import docClient from "./dbClient.js";


const SECRET = "secret123";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    SECRET,
    { expiresIn: "1h" }
  );
};

export const authorize = (event) => {
  const authHeader =
    event.headers.Authorization || event.headers.authorization;

  if (!authHeader) throw new Error("No token");

  const token = authHeader.split(" ")[1];

  return jwt.verify(token, SECRET);
};

export const register = async (event) => {
  try {
  const { email, password } = JSON.parse(event.body);
  const searchParams = {
      TableName: "Users",
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    };

    const existingUsers = await docClient.scan(searchParams).promise();

    if (existingUsers.Items && existingUsers.Items.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "El usuario con este correo ya existe" }),
      };
    }
  /*const exists = db.users.find((u) => u.email === email);

  if (exists) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Usuario ya existe" }),
    };
  }
*/
  const user = {
    id: uuid(),
    email,
    password,
  };

  /*db.users.push(user);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Usuario creado" }),
  };*/

  await docClient.put({
      TableName: "Users",
      Item: user
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Usuario creado exitosamente" }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error al registrar", error: e.message }),
    };
  }
};