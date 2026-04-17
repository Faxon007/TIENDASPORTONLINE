<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
      <h2 class="text-xl font-bold mb-3">{{ title }}</h2>
      <p class="mb-5">{{ message }}</p>

      <div class="flex justify-center gap-3">
        <button v-if="showCancel"
          @click="$emit('cancel')"
          class="px-4 py-2 bg-gray-300 rounded-lg">
          Cancelar
        </button>

        <button
          @click="$emit('confirm')"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Aceptar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  message: String,
  showCancel: Boolean
});
</script>