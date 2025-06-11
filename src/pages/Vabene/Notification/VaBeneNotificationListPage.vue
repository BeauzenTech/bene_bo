<template>
  <BreadCrumb PageTitle="Liste des notifications" />
  <VabeneNotificationList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneNotificationList from "@/components/Vabene/Notification/NotificationList/VabeneNotificationList.vue";
export default defineComponent({
  name: "VabeneNotificationListPage",
  components: {
    BreadCrumb,
    VabeneNotificationList,
  },
});
</script>