import { products, users, carts } from "./data/db.js";
import { generateToken, authorize } from "./utils/auth.js";
import logger from "./utils/logger.js";
import docClient from "./utils/dbClient.js";
import { v4 as uuid } from "uuid";

export const login = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    const params = {
        TableName: "Users",
        FilterExpression: "email = :e AND password = :p",
        ExpressionAttributeValues: {
            ":e": email,
            ":p": password
        }
    };
    const result = await docClient.scan(params).promise();
    const user = result.Items[0];
    /*const user = users.find(
      (u) => u.email === email && u.password === password
    );*/

    if (!user) {
      logger.warn("Login failed", { email });
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid credentials" }),
      };
    }

    const token = generateToken(user);

    logger.info("Login success", { userId: user.id });
    logger.info("token",token);

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (e) {
    logger.error("Login error", { error: e.message });

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error" }),
    };
  }
};

export const getProductsDB = async (event) => {
  try {
    let { page = 1, limit = 5, category } =
      event.queryStringParameters || {};

    page = parseInt(page);
    limit = parseInt(limit);

    let data = products;

    if (category) {
      data = data.filter((p) => p.category === category);
    }

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      statusCode: 200,
      body: JSON.stringify({
        total: data.length,
        page,
        data: data.slice(start, end),
      }),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching products" }),
    };
  }
};

export const getProducts = async (event) => {
  try {
    let { page = 1, limit = 10, category } = event.queryStringParameters || {};
    page = parseInt(page);
    limit = parseInt(limit);

    const params = { TableName: "Products" };

    if (category) {
      params.FilterExpression = "category = :c";
      params.ExpressionAttributeValues = { ":c": category };
    }

    const result = await docClient.scan(params).promise();
    const allProducts = result.Items;

    const start = (page - 1) * limit;
    const data = allProducts.slice(start, start + limit);

    return {
      statusCode: 200,
      body: JSON.stringify({
        total: allProducts.length,
        page,
        data,
      }),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ message: "Error fetching products" }) };
  }
};

export const addToCartDB = async (event) => {
  try {
    const user = authorize(event);

    const { productId } = JSON.parse(event.body);

    if (!carts[user.id]) carts[user.id] = [];

    carts[user.id].push(productId);

    logger.info("Add to cart", {
      userId: user.id,
      productId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Added to cart" }),
    };
  } catch (e) {
    logger.warn("Unauthorized addToCart");

    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }
};

export const addToCart = async (event) => {
  try {
    const user = authorize(event);
    const { productId } = JSON.parse(event.body);

    await docClient.put({
      TableName: "Carts",
      Item: {
        userId: user.id,
        productId: productId,
        addedAt: new Date().toISOString()
      }
    }).promise();

    logger.info("Add to cart", { userId: user.id, productId });
    return { statusCode: 200, body: JSON.stringify({ message: "Added to cart" }) };
  } catch (e) {
    logger.warn("Unauthorized or Error in addToCart");
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }
};


export const getCartDB = async (event) => {
  try {
    const user = authorize(event);

    const userCart = carts[user.id] || [];

    const items = userCart.map((id) =>
      products.find((p) => p.id === id)
    );

    logger.info("Get cart", { userId: user.id });

    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch {
    logger.warn("Unauthorized getCart");

    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }
};

export const getCart = async (event) => {
  try {
    const user = authorize(event);

    // Buscamos los IDs de productos en el carrito del usuario
    const cartResult = await docClient.query({
      TableName: "Carts",
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: { ":uid": user.id }
    }).promise();

    const productIds = cartResult.Items.map(item => item.productId);

    // Obtenemos los detalles de todos los productos (puedes optimizar esto con BatchGetItem)
    const productParams = { TableName: "Products" };
    const allProducts = await docClient.scan(productParams).promise();
    
    const items = allProducts.Items.filter(p => productIds.includes(p.id));

    logger.info("Get cart", { userId: user.id });
    return { statusCode: 200, body: JSON.stringify(items) };
  } catch (e) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }
};

export const checkoutDB = async (event) => {
  try {
    const user = authorize(event);

    carts[user.id] = [];

    logger.info("Checkout", { userId: user.id });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Checkout successful" }),
    };
  } catch {
    logger.warn("Unauthorized checkout");

    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }
};

export const checkout = async (event) => {
  try {
    const user = authorize(event);

    const cartResult = await docClient.query({
      TableName: "Carts",
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: { ":uid": user.id }
    }).promise();

    const cartItems = cartResult.Items;

    if (!cartItems.length) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Carrito vacío" })
      };
    }

    const productIds = cartItems.map(i => i.productId);

    const productsResult = await docClient.scan({
      TableName: "Products"
    }).promise();

    const products = productsResult.Items;

    const grouped = {};

    for (const item of cartItems) {
      if (!grouped[item.productId]) {
        grouped[item.productId] = 0;
      }
      grouped[item.productId]++;
    }

    const orderItems = [];

    for (const productId in grouped) {
      const product = products.find(p => p.id === productId);

      if (!product) continue;

      const quantity = grouped[productId];
      console.log("PRODUCT:", product);
      console.log("QUANTITY:", quantity);
      if (quantity > product.stock) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `Stock insuficiente para ${product.name}` })
        };
      }

      orderItems.push({
        productId,
        name: product.name,
        price: product.price,
        quantity
      });

      await docClient.update({
        TableName: "Products",
        Key: { id: productId },
        UpdateExpression: "SET stock = stock - :q",
        ExpressionAttributeValues: {
          ":q": quantity
        }
      }).promise();
    }

    const order = {
      id: uuid(),
      userId: user.id,
      items: orderItems,
      createdAt: new Date().toISOString()
    };

    await docClient.put({
      TableName: "Orders",
      Item: order
    }).promise();

    await Promise.all(cartItems.map(item =>
      docClient.delete({
        TableName: "Carts",
        Key: {
          userId: item.userId,
          productId: item.productId
        }
      }).promise()
    ));

    return {
      statusCode: 200,
      body: JSON.stringify(order)
    };

  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error en checkout" })
    };
  }
};

export const removeFromCart = async (event) => {
  try {
    const user = authorize(event); 
    const { productId } = JSON.parse(event.body);

    if (!productId) {
      return { statusCode: 400, body: JSON.stringify({ message: "productId es requerido" }) };
    }

    const params = {
      TableName: "Carts",
      Key: {
        userId: user.id,   
        productId: productId 
      }
    };

    await docClient.delete(params).promise();

    logger.info("Product removed from cart", { userId: user.id, productId });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Producto eliminado del carrito" }),
    };
  } catch (e) {
    logger.error("Error removing from cart", { error: e.message });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno", detail: e.message }),
    };
  }
};

export const getUserOrders = async (event) => {
  try {
    const user = authorize(event);

    const params = {
      TableName: "Orders",
      FilterExpression: "userId = :uid", 
      ExpressionAttributeValues: {
        ":uid": user.id
      }
    };

    const result = await docClient.scan(params).promise();

    const orders = result.Items.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return {
      statusCode: 200,
      body: JSON.stringify(orders),
    };
  } catch (e) {
    console.error("Error obteniendo pedidos:", e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno del servidor" }),
    };
  }
};