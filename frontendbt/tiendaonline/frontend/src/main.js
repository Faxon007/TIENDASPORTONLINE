import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "./index.css";
import api, { setAuthToken } from "./services/api";

const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}
createApp(App)
  .use(createPinia())
  .use(router)
  .mount("#app");