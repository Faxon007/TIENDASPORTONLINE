<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h2 class="text-3xl font-bold mb-6">Carrito</h2>

    <div v-if="items.length === 0">Carrito vacío</div>

    <div v-else>
      <div v-for="item in items" :key="item.productId"
  class="bg-white p-4 mb-3 rounded-xl shadow">

  <img 
    :src="item.product?.image || defaultImage" 
    @error="handleImageError"
    class="w-20 h-20 object-cover rounded-lg"
  />

  <p class="font-bold">{{ item.product?.name }}</p>
  <p>Cantidad: {{ item.quantity }}</p>
  <p>Precio: Q {{ item.product?.price }}</p>
  <button @click="askRemove(item.productId)"
  class="mt-2 bg-red-500 text-white px-3 py-1 rounded">
  Eliminar
</button>
</div>
<p class="mt-4 font-bold text-xl">
  Total: Q {{
    items.reduce((acc, i) =>
      acc + (i.product?.price || 0) * i.quantity, 0)
  }}
</p>

      <button @click="confirmCheckout"
  class="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg">
  Finalizar compra
</button>

<Modal
  :show="showModal"
  title="Confirmar compra"
  message="¿Seguro que deseas finalizar la compra?"
  :showCancel="true"
  @confirm="checkout"
  @cancel="showModal = false"
/>
<Modal
  :show="showDeleteModal"
  title="Eliminar producto"
  message="¿Deseas eliminar este producto del carrito?"
  :showCancel="true"
  @confirm="remove"
  @cancel="showDeleteModal = false"
/>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import Modal from "../components/Modal.vue";
import defaultImagePlaceholder from "../no-image.png";
const showModal = ref(false);
const items = ref([]);
const productToDelete = ref(null);
const showDeleteModal = ref(false);


const handleImageError = (event) => {
  console.warn("Imagen no encontrada, usando placeholder.");
  event.target.src = defaultImagePlaceholder; 
};

const load = async () => {
  try {
    const res = await api.get("/cart");
    
    
    items.value = res.data.map(item => ({
      productId: item.id, 
      quantity: 1,       
      product: item       
    }));
  } catch (error) {
    console.error("Error cargando el carrito", error);
  }
};

const askRemove = (id) => {
  productToDelete.value = id;
  showDeleteModal.value = true;
};

const remove = async () => {
  await api.delete("/cart", { data: { productId: productToDelete.value } });
  await load();
  showDeleteModal.value = false;
};

const confirmCheckout = () => {
  showModal.value = true;
};


const checkout = async () => {
  showModal.value = false;

  try {
    await api.post("/checkout");
    items.value = [];
  } catch {
    alert("Error de stock");
  }
};



onMounted(load);
</script>