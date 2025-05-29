<template>
  <BreadCrumb PageTitle="Ajouter un utilisateur" />
  <VabeneAddUser />
</template>

<script lang="ts">
import { defineComponent } from "vue";

import BreadCrumb from "@/components/Common/BreadCrumb.vue";
import VabeneAddUser from "@/components/Vabene/Users/AddUser/VabeneAddUser.vue";

export default defineComponent({
  name: "VabeneAddUserPage",
  components: {
    BreadCrumb,
    VabeneAddUser,
  },
});
</script>