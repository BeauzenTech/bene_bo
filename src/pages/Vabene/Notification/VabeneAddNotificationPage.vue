<template>
  <BreadCrumb v-if="action === 'add'" PageTitle="Envoyer une notification" />
  <BreadCrumb v-else PageTitle="Détail de la notification" />
  <VabeneAddNotification :action="action ?? 'add'" :notificationID="notificationID ?? ''"/>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneAddNotification from "@/components/Vabene/Notification/AddNotification/VabeneAddNotification.vue";
export default defineComponent({
  name: "VabeneAddNotificationPage",
  components: {
    BreadCrumb,
    VabeneAddNotification,
  },

  data() {
    return {
      action: null as string | null,
      notificationID: null as string | null,
    };
  },
  mounted() {
    this.action = this.$route.params.action as string;
    this.notificationID = this.$route.params.notificationID as string;
    console.log('action:', this.action);
    console.log('notificationID:', this.notificationID);
  },
});
</script>