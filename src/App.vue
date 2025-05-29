<template>
  <div :class="{'login-background': isLoginPage}">
    <MainHeader v-if="!isLoginPage" />
    <MainSidebar v-if="!isLoginPage" />
    <div class="main-content d-flex flex-column transition overflow-hidden">
      <router-view />
<!--      <MainFooter v-if="!isLoginPage" />-->
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from "vue";
import stateStore from "./utils/store";


import MainHeader from "./components/Layouts/MainHeader.vue";
import MainSidebar from "./components/Layouts/MainSidebar.vue";
import { useRoute } from "vue-router";
import {requestForToken, onMessageListener, requestNotificationPermission} from "./firebase";
import {useToast} from "vue-toastification";
import notificationSound from "@/assets/sounds/notification.wav";
import {UserGeneralKey} from "@/models/user.generalkey";


export default defineComponent({
  name: "App",
  components: {
    MainHeader,
    MainSidebar,

  },
  methods:{

  },
  async mounted() {
    document.body.classList.add("bg-body-secondary");
    const token = await requestNotificationPermission();
    if (token) {
      console.log("Token Firebase sauvegardé :", token);
    }


    //Écoute les notifications reçues
    onMessageListener().then(payload => {
      console.log("Notification reçue en foreground :", payload);
      const notification = payload.notification;
      const data = payload.data || {};
      const title = notification?.title || "Pas de titre";
      const body = notification?.body || "Pas de message";
      console.log("Titre :", title);
      console.log("Message :", body);
      console.log("Données :", data);
      // ✅ Lecture du son si interaction utilisateur préalable
      const audio = new Audio(notificationSound);
      audio.play().catch((err) => {
        console.warn("🔇 Son bloqué :", err);
      });
      // ✅ Utilisation de la toast (si installée dans `this`)
      if (this?.toast?.info) {
        this.toast.info(body);
      } else {
        console.log("ℹ️ Toast info :", body);
      }


    });

  },

  setup() {
    const toast = useToast();

    const route = useRoute();
    const isLoginPage = computed(() => route.name === "LoginPage");
    const stateStoreInstance = stateStore;
    watchEffect(() => {
      if (stateStoreInstance.open) {
        document.body.classList.remove("sidebar-show");
        document.body.classList.add("sidebar-hide");
        console.log("show");
      } else {
        document.body.classList.remove("sidebar-hide");
        document.body.classList.add("sidebar-show");

        console.log("hide");
      }
    });
    return {
      isLoginPage,
      toast
    };
  },
});
</script>

<style>

.login-background {
  background-image: url('@/assets/images/pizzeria_77.jpg') ; /* Remplacez par le chemin de votre image */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.login-background::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Couleur sombre avec opacité */
}
</style>