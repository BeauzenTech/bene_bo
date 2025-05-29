<template>
  <BreadCrumb PageTitle="Liste des restaurants" />
  <VabeneRestaurantList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneRestaurantList from "@/components/Vabene/Restaurant/RestaurantList/VabeneRestaurantList.vue";

export default defineComponent({
  name: "VabeneUserListPage",
  components: {
    BreadCrumb,
    VabeneRestaurantList,
  },
});
</script>