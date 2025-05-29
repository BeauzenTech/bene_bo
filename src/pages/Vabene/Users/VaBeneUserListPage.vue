<template>
  <BreadCrumb PageTitle="Liste des utilisateurs" />
  <VabeneUsersList />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneUsersList from "@/components/Vabene/Users/UsersList/VabeneUsersList.vue";

export default defineComponent({
  name: "VabeneUserListPage",
  components: {
    BreadCrumb,
    VabeneUsersList,
  },
});
</script>