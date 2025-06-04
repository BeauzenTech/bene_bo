<template>
  <BreadCrumb PageTitle="Rapport de ventes" />
  <VabenerReportSell />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabenerReportSell from "@/components/Vabene/Order/OrderReportSells/VabenerReportSell.vue";

export default defineComponent({
  name: "VabeneOrderReportSellPage",
  components: {
    BreadCrumb,
    VabenerReportSell,
  },
});
</script>