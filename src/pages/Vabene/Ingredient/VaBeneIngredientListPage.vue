<template>
  <BreadCrumb PageTitle="Liste des ingredients"/>
  <VabeneIngredientList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneIngredientList from "@/components/Vabene/Ingredient/CategorieList/VabeneIngredientList.vue";
export default defineComponent({
  name: "VabeneIngredientListPage",
  components: {
    BreadCrumb,
    VabeneIngredientList,
  },
});
</script>