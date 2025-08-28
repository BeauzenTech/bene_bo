<template>
  <BreadCrumb v-if="action === 'add'" PageTitle="Ajouter un produit" />
  <BreadCrumb v-else PageTitle="Mettre à jour produit" />
  <VabeneAddProduct :action="action ?? 'add'" :categorieID="productID ?? ''"/>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneAddProduct from "@/components/Vabene/Produit/AddProduct/VabeneAddProduct.vue";
export default defineComponent({
  name: "VabeneAddProductPage",
  components: {
    BreadCrumb,
    VabeneAddProduct,
  },

  data() {
    return {
      action: null as string | null,
      productID: null as string | null,
    };
  },
  mounted() {
    this.action = this.$route.params.action as string;
    this.productID = this.$route.params.productID as string;
  },
});
</script>