<template>
  <div>
    <nav class="bg-white shadow p-4 flex justify-between items-center">
      <h3 class="font-bold text-xl">SportX Guatemala | Tu Tienda Deportiva</h3>
      <div class="flex items-center gap-4">
        <router-link to="/products" class="px-3 py-1 rounded"
          :class="route.path === '/products' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'">
          Productos
        </router-link>

        <router-link to="/cart" class="px-3 py-1 rounded"
          :class="route.path === '/cart' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'">
          Carrito
        </router-link>

        <router-link to="/orders" class="px-3 py-1 rounded"
          :class="route.path === '/orders' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'">
          Mis Pedidos
        </router-link>

        <button @click="logout"
          class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
          Salir
        </button>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const logout = () => {
  localStorage.removeItem("token");
  router.push("/");
};
</script>