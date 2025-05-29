<template>
  <BreadCrumb PageTitle="Liste des categories" />
  <VabeneCategorieList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneCategorieList from "@/components/Vabene/Categorie/CategorieList/VabeneCategorieList.vue";

export default defineComponent({
  name: "VabeneCategorieListPage",
  components: {
    BreadCrumb,
    VabeneCategorieList,
  },
});
</script>