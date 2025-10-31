<template>
  <BreadCrumb v-if="action === 'add'" PageTitle="Ajouter un client" />
  <BreadCrumb v-else PageTitle="Détail du client" />
  <VabeneAddCustomer :action="action ?? 'add'" :customerID="customerID ?? ''"/>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneAddCustomer from "@/components/Vabene/Customer/AddCustomer/VabeneAddCustomer.vue";

export default defineComponent({
  name: "VabeneAddCustomerPage",
  components: {
    BreadCrumb,
    VabeneAddCustomer,
  },

  data() {
    return {
      action: null as string | null,
      customerID: null as string | null,
    };
  },
  mounted() {
    this.action = this.$route.params.action as string;
    this.customerID = this.$route.params.customerID as string;
  },
});
</script>