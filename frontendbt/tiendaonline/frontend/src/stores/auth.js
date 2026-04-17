import { defineStore } from "pinia";
import api, { setAuthToken } from "../router/services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
  }),

  actions: {
    async login(email, password) {
      const res = await api.post("/login", { email, password });

      this.token = res.data.token;

      localStorage.setItem("token", this.token);
      setAuthToken(this.token);
    },

    logout() {
      this.token = null;
      localStorage.removeItem("token");
      setAuthToken(null);
    },
  },
});