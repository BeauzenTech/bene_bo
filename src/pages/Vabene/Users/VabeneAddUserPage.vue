<template>
  <BreadCrumb PageTitle="Ajouter un utilisateur" />
  <VabeneAddUser :action="action ?? 'add'" :userID="userID ?? ''" />
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
  data() {
    return {
      action: null as string | null,
      userID: null as string | null,
    };
  },
  mounted() {
    this.action = this.$route.params.action as string;
    this.userID = this.$route.params.userID as string;
    console.log('action:', this.action);
    console.log('userID:', this.userID);
  },
});
</script>