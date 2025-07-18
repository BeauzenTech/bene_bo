<template>
  <BreadCrumb PageTitle="POS Système (Terminal de vente)" />
  <VabeneAddOrder />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneAddOrder from "@/components/Vabene/POS/OrderNew/VabeneAddOrder.vue";
export default defineComponent({
  name: "VabeneAddOrderPage",
  components: {
    BreadCrumb,
    VabeneAddOrder,
  },
});
</script>