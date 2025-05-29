import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import BootstrapVueNext from "bootstrap-vue-next";
import VueApexCharts from "vue3-apexcharts";
import { QuillEditor } from '@vueup/vue-quill'
import Vue3Prism from 'vue3-prism/lib/Vue3Prism.common.js'

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "swiper/css";
import "swiper/css/bundle";
import 'flatpickr/dist/flatpickr.css';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import "vue3-prism/lib/Vue3Prism.css"

import "./assets/custom.scss";

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import Toast, {PluginOptions} from "vue-toastification";
import "vue-toastification/dist/index.css";


const app = createApp(App).use(router);
app.component('v-select', vSelect);
app.use(BootstrapVueNext);
app.use(VueApexCharts)
const options: PluginOptions = {
    // You can set your default options here
};

app.use(Toast, options);
app.component('QuillEditor', QuillEditor)
.use(Vue3Prism)
app.mount("#app");
