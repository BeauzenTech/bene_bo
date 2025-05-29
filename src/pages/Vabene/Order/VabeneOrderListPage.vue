<template>
  <BreadCrumb PageTitle="Commandes" />
  <VabeneOrderList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneOrderList from "@/components/Vabene/Order/OrdersList/VabeneOrderList.vue";

export default defineComponent({
  name: "VabeneListOrderPage",
  components: {
    BreadCrumb,
    VabeneOrderList,
  },
});
</script>