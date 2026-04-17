<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6">
      <h2 class="text-3xl font-bold">Productos</h2>

      <div class="mt-4 md:mt-0 flex items-center gap-2">
        <label class="font-medium">Filtrar por:</label>
        <select 
          v-model="selectedCategory" 
          @change="resetAndLoad"
          class="p-2 border rounded-lg bg-white shadow-sm"
        >
          <option value="">Todas las categorías</option>
          <option value="futbol">Fútbol</option>
          <option value="running">Running</option>
          <option value="gym">Gimnasio</option>
          <option value="ciclismo">Ciclismo</option>
          <option value="accesorios">Accesorios</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="text-center py-10">Cargando...</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="p in products" :key="p.id" class="bg-white rounded-2xl shadow p-4 flex flex-col">
        <img 
          :src="p.image || defaultImage" 
          @error="handleImageError"
          class="w-full h-40 object-cover rounded-lg mb-3" 
          :alt="p.name"
        />
        <h3 class="text-lg font-semibold">{{ p.name }}</h3>
        <p class="text-gray-400 text-sm uppercase mb-1">{{ p.category }}</p>
        <p class="text-xl font-bold mb-3 text-green-600">Q {{ p.price }}</p>

        <button @click="add(p)" class="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition">
          Agregar al carrito
        </button>
      </div>
    </div>

    <div class="mt-8 flex justify-center items-center gap-4">
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1 || loading"
        class="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 shadow-sm"
      >
        Anterior
      </button>

      <span class="font-semibold text-gray-700">Página {{ currentPage }} de {{ totalPages }}</span>

      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage >= totalPages || loading"
        class="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 shadow-sm"
      >
        Siguiente
      </button>
    </div>
  </div>

  <Modal
    :show="showAdded"
    title="Carrito"
    message="Producto agregado correctamente"
    :showCancel="false"
    @confirm="showAdded = false"
  />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "../services/api";
import Modal from "../components/Modal.vue";

import defaultImagePlaceholder from "../no-image.png";

const products = ref([]);
const loading = ref(false);
const showAdded = ref(false);

const currentPage = ref(1);
const totalItems = ref(0);
const pageSize = 5;
const selectedCategory = ref("");

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize) || 1);

const handleImageError = (event) => {
  console.warn("Imagen no encontrada, usando placeholder.");
  event.target.src = defaultImagePlaceholder; 
};
const load = async () => {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize,
    };
    
    if (selectedCategory.value) {
      params.category = selectedCategory.value;
    }

    const res = await api.get("/products", { params });
    
    products.value = res.data.data;
    totalItems.value = res.data.total;
  } catch (error) {
    console.error("Error cargando productos:", error);
  } finally {
    loading.value = false;
  }
};

const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const resetAndLoad = () => {
  currentPage.value = 1;
  load();
};

const add = async (p) => {
  try {
    await api.post("/cart", { productId: p.id, quantity: 1 });
    showAdded.value = true;
  } catch (error) {
    console.error("Error al agregar al carrito");
  }
};

onMounted(load);
</script>