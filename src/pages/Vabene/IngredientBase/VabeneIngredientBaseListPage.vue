<template>
  <BreadCrumb PageTitle="Liste des ingrédients de base" />
  <VabeneIngredientBaseList />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneIngredientBaseList from "@/components/Vabene/IngredientBase/IngredientBaseList/VabeneIngredientBaseList.vue";

export default defineComponent({
  name: "VabeneIngredientBaseListPage",
  components: {
    BreadCrumb,
    VabeneIngredientBaseList
  }
});
</script>
