<template>
  <BreadCrumb PageTitle="Liste des clients" />
  <VabeneCustomerList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneCustomerList from "@/components/Vabene/Customer/CustomerList/VabeneCustomerList.vue";
export default defineComponent({
  name: "VabeneCustomerListPage",
  components: {
    BreadCrumb,
    VabeneCustomerList,
  },
});
</script>