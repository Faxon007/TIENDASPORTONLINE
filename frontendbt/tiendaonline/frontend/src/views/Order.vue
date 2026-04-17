<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h2 class="text-3xl font-bold mb-6">Mis Pedidos en SportX</h2>

    <div v-if="loading" class="text-center py-10">Cargando tu historial...</div>

    <div v-else-if="orders.length === 0" class="text-center py-10 bg-white rounded-xl shadow">
      <p class="text-gray-500">Aún no tienes pedidos registrados.</p>
    </div>

    <div v-else class="space-y-6">
      <div v-for="order in orders" :key="order.id" class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div class="bg-gray-50 p-4 border-b flex justify-between items-center">
          <div>
            <p class="text-xs text-gray-400 uppercase font-bold">Orden ID</p>
            <p class="text-sm font-mono">{{ order.id }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-400 uppercase font-bold">Fecha</p>
            <p class="text-sm">{{ formatDate(order.createdAt) }}</p>
          </div>
        </div>

        <div class="p-4">
          <h4 class="font-bold mb-2 text-gray-600 italic">Productos:</h4>
          <ul class="divide-y">
            <li v-for="item in order.items" :key="item.productId" class="py-2 flex justify-between">
              <span>{{ item.quantity }}x {{ item.name }}</span>
              <span class="font-medium">Q {{ item.price * item.quantity }}</span>
            </li>
          </ul>
        </div>

        <div class="bg-blue-50 p-4 flex justify-between items-center">
          <span class="font-bold text-blue-800">Total Pagado:</span>
          <span class="text-xl font-black text-blue-900">
            Q {{ calculateTotal(order.items) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const orders = ref([]);
const loading = ref(false);

const loadOrders = async () => {
  loading.value = true;
  try {
    const res = await api.get("/orders"); 
    orders.value = res.data;
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
  } finally {
    loading.value = false;
  }
};

const calculateTotal = (items) => {
  return items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('es-GT', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

onMounted(loadOrders);
</script>