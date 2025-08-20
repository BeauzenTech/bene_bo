<template>
  <BreadCrumb PageTitle="Détail de la transaction" />
  <TransactionDetails :transactionID="transactionID" />
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import TransactionDetails from "@/components/Vabene/POS/TransactionDetails/TransactionDetails.vue";
export default defineComponent({
  name: "VabeneTransactionDetailsPage",
  components: {
    BreadCrumb,
    TransactionDetails
  },
  data() {
    return {
      transactionID: null as string | null,
    };
  },
  mounted() {
    this.transactionID = this.$route.params.transactionID as string;
    console.log('transactionID:', this.transactionID);
  },
});
</script>