<template>
  <BreadCrumb PageTitle="Transactions" />
  <VabeneTransactionList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneTransactionList from "@/components/Vabene/POS/TransactionList/VabeneTransactionList.vue";

export default defineComponent({
  name: "VabeneListTransactionPage",
  components: {
    BreadCrumb,
    VabeneTransactionList,
  },
});
</script>