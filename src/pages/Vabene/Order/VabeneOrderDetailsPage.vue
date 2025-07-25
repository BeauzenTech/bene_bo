<template>
  <BreadCrumb PageTitle="Detail de la commande" />
  <VabeneOrderDetails :commandeID="commandeID!"/>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneOrderDetails from "@/components/Vabene/POS/OrderDetails/VabeneOrderDetails.vue";
export default defineComponent({
  name: "VabeneOrderDetailsPage",
  components: {
    BreadCrumb,
    VabeneOrderDetails,
  },
  data() {
    return {
      commandeID: null as string | null,
    };
  },
  mounted() {
    this.commandeID = this.$route.params.commandeID as string;
    console.log('commandeID:', this.commandeID);
  },
});
</script>