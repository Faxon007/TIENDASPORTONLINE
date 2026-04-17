<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-80">
      <h2 class="text-2xl font-bold mb-4 text-center">
        {{ isLogin ? "Login" : "Registro" }}
      </h2>

      <input v-model="email" placeholder="Email"
        class="w-full mb-3 p-2 border rounded-lg" />

      <input v-model="password" type="password" placeholder="Password"
        class="w-full mb-4 p-2 border rounded-lg" />

      <button @click="submit"
        class="w-full bg-blue-500 text-white p-2 rounded-lg">
        {{ isLogin ? "Ingresar" : "Crear cuenta" }}
      </button>

      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>

      <p class="text-sm mt-4 text-center">
        <span v-if="isLogin">¿No tienes cuenta?</span>
        <span v-else>¿Ya tienes cuenta?</span>

        <button @click="toggle"
          class="text-blue-500 ml-1">
          {{ isLogin ? "Regístrate" : "Login" }}
        </button>
      </p>
    </div>
  </div>
  <Modal
  :show="showError"
  title="Error"
  message="Completa todos los campos"
  :showCancel="false"
  @confirm="showError = false"
/>
</template>

<script setup>
import { ref } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";
import Modal from "../components/Modal.vue";


const email = ref("");
const password = ref("");
const error = ref("");
const isLogin = ref(true);
const router = useRouter();
const showError = ref(false);

const toggle = () => {
  isLogin.value = !isLogin.value;
  error.value = "";
};


const submit = async () => {
  error.value = "";

  try {
    if (!email.value || !password.value) {
    showError.value = true;
    return;
  }
    if (isLogin.value) {
      const res = await api.post("/login", {
        email: email.value,
        password: password.value
      });

      localStorage.setItem("token", res.data.token);
      router.push("/products");

    } else {
      await api.post("/register", {
        email: email.value,
        password: password.value
      });

      isLogin.value = true;
    }

  } catch (e) {
    error.value = "Error en autenticación";
  }
};
</script>