import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BootstrapVueNext from "bootstrap-vue-next";
import { QuillEditor } from "@vueup/vue-quill";
import Vue3Prism from "vue3-prism/lib/Vue3Prism.common.js";
import { AuthService } from "./service/auth.service";
import { initializeTimezone } from "./utils/timezone";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "swiper/css";
import "swiper/css/bundle";
import "flatpickr/dist/flatpickr.css";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
import "vue3-prism/lib/Vue3Prism.css";

import "./assets/custom.scss";

import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Toast, { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App).use(router).use(store);
app.component("v-select", vSelect);
app.use(BootstrapVueNext);
const options: PluginOptions = {
  // You can set your default options here
};

app.use(Toast, options);
app.component("QuillEditor", QuillEditor).use(Vue3Prism);

// 🔐 Démarre la vérification automatique des tokens expirés
AuthService.startTokenExpirationCheck();

// 🇨🇭 Initialise le fuseau horaire suisse
initializeTimezone();

app.mount("#app");
