import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Products from "../views/Products.vue";
import Cart from "../views/Cart.vue";
import Order from "../views/Order.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/products", component: Products },
  { path: "/cart", component: Cart },
  { path: "/orders", component: Order }
];

export default createRouter({
  history: createWebHistory(),
  routes
});