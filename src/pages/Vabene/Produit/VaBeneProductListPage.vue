<template>
  <BreadCrumb PageTitle="Liste des produits"/>
  <VabeneProductList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneProductList from "@/components/Vabene/Produit/ProductList/VabeneProductList.vue";
export default defineComponent({
  name: "VabeneProductListPage",
  components: {
    BreadCrumb,
    VabeneProductList,
  },
});
</script>